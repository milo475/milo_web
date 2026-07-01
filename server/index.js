// index.js — Сургалтын REST API (Express + MySQL)
// GET /api/health        — эрүүл мэндийн шалгалт
// GET /api/courses       — бүх курс + хичээлүүд (frontend-д бэлэн бүтэц)
// GET /api/courses/:id   — нэг курс
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pool } from './db.js';
import {
  hashPassword,
  verifyPassword,
  signToken,
  authRequired,
  adminRequired,
} from './auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// мөр бүрийг frontend-ийн хүлээж буй хэлбэрт хөрвүүлэх
function rowToLesson(r) {
  return {
    // курсын угтварыг хасаад анхны id-г сэргээнэ
    id: r.id.includes('__') ? r.id.split('__').slice(1).join('__') : r.id,
    title: r.title,
    level: r.level ?? undefined,
    summary: r.summary ?? undefined,
    // mysql2 JSON баганыг автоматаар parse хийдэг; зарим тохиолдолд string ирвэл хамгаална
    blocks: typeof r.blocks === 'string' ? JSON.parse(r.blocks) : r.blocks,
  };
}

async function loadCourses() {
  const [courses] = await pool.query(
    'SELECT id, name, tagline FROM courses ORDER BY sort_order'
  );
  const [lessons] = await pool.query(
    'SELECT id, course_id, title, level, summary, blocks FROM lessons ORDER BY course_id, sort_order'
  );
  const byCourse = new Map();
  for (const l of lessons) {
    if (!byCourse.has(l.course_id)) byCourse.set(l.course_id, []);
    byCourse.get(l.course_id).push(rowToLesson(l));
  }
  return courses.map((c) => ({
    id: c.id,
    name: c.name,
    tagline: c.tagline ?? undefined,
    lessons: byCourse.get(c.id) ?? [],
  }));
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/api/courses', async (_req, res) => {
  try {
    res.json(await loadCourses());
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Курс ачаалахад алдаа гарлаа' });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const all = await loadCourses();
    const found = all.find((c) => c.id === req.params.id);
    if (!found) return res.status(404).json({ error: 'Курс олдсонгүй' });
    res.json(found);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Алдаа гарлаа' });
  }
});

/* ===================== AUTH ===================== */
const USERNAME_RE = /^[a-zA-Z0-9_]{3,32}$/;

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!USERNAME_RE.test(username || ''))
      return res.status(400).json({ error: 'Хэрэглэгчийн нэр 3-32 тэмдэгт (a-z, 0-9, _)' });
    if (!password || password.length < 6)
      return res.status(400).json({ error: 'Нууц үг хамгийн багадаа 6 тэмдэгт' });
    const hash = await hashPassword(password);
    let result;
    try {
      [result] = await pool.execute(
        'INSERT INTO users (username, password_hash) VALUES (:u, :h)',
        { u: username, h: hash }
      );
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY')
        return res.status(409).json({ error: 'Энэ нэр аль хэдийн бүртгэлтэй' });
      throw e;
    }
    const user = { id: result.insertId, username, role: 'user' };
    res.json({ token: signToken(user), user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Бүртгэлийн алдаа' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const [rows] = await pool.execute(
      'SELECT id, username, password_hash, role FROM users WHERE username = :u',
      { u: username || '' }
    );
    const row = rows[0];
    if (!row || !(await verifyPassword(password || '', row.password_hash)))
      return res.status(401).json({ error: 'Нэр эсвэл нууц үг буруу' });
    const user = { id: row.id, username: row.username, role: row.role };
    res.json({ token: signToken(user), user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Нэвтрэх алдаа' });
  }
});

app.get('/api/auth/me', authRequired, (req, res) => {
  res.json({ user: { id: req.user.id, username: req.user.username, role: req.user.role } });
});

/* ===================== PROGRESS ===================== */
app.get('/api/progress', authRequired, async (req, res) => {
  try {
    const [lessons] = await pool.execute(
      'SELECT lesson_id FROM progress WHERE user_id = :uid',
      { uid: req.user.id }
    );
    const [challenges] = await pool.execute(
      'SELECT challenge_id FROM challenge_results WHERE user_id = :uid',
      { uid: req.user.id }
    );
    res.json({
      lessons: lessons.map((r) => r.lesson_id),
      challenges: challenges.map((r) => r.challenge_id),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Явц ачаалах алдаа' });
  }
});

app.post('/api/progress', authRequired, async (req, res) => {
  try {
    const { lessonId } = req.body || {};
    if (!lessonId) return res.status(400).json({ error: 'lessonId шаардлагатай' });
    await pool.execute(
      `INSERT INTO progress (user_id, lesson_id) VALUES (:uid, :lid)
       ON DUPLICATE KEY UPDATE completed_at = CURRENT_TIMESTAMP`,
      { uid: req.user.id, lid: String(lessonId).slice(0, 128) }
    );
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Хадгалах алдаа' });
  }
});

app.post('/api/challenge-results', authRequired, async (req, res) => {
  try {
    const { challengeId } = req.body || {};
    if (!challengeId) return res.status(400).json({ error: 'challengeId шаардлагатай' });
    await pool.execute(
      `INSERT INTO challenge_results (user_id, challenge_id) VALUES (:uid, :cid)
       ON DUPLICATE KEY UPDATE completed_at = CURRENT_TIMESTAMP`,
      { uid: req.user.id, cid: String(challengeId).slice(0, 64) }
    );
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Хадгалах алдаа' });
  }
});

/* ===================== ADMIN CRUD ===================== */
// шинэ хичээл нэмэх
app.post('/api/admin/lessons', authRequired, adminRequired, async (req, res) => {
  try {
    const { course_id, lesson_id, title, level, summary, blocks, sort_order } = req.body || {};
    if (!course_id || !lesson_id || !title)
      return res.status(400).json({ error: 'course_id, lesson_id, title шаардлагатай' });
    const id = `${course_id}__${lesson_id}`;
    await pool.execute(
      `INSERT INTO lessons (id, course_id, title, level, summary, sort_order, blocks)
       VALUES (:id, :cid, :title, :level, :summary, :sort, :blocks)`,
      {
        id, cid: course_id, title, level: level ?? null, summary: summary ?? null,
        sort: Number(sort_order) || 0, blocks: JSON.stringify(blocks ?? []),
      }
    );
    res.json({ ok: true, id });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Энэ id-тай хичээл байна' });
    if (e.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'course_id олдсонгүй' });
    console.error(e);
    res.status(500).json({ error: 'Нэмэх алдаа' });
  }
});

// хичээл засах (id = бүтэн id, ж: linux__b01)
app.put('/api/admin/lessons/:id', authRequired, adminRequired, async (req, res) => {
  try {
    const { title, level, summary, blocks, sort_order } = req.body || {};
    const [r] = await pool.execute(
      `UPDATE lessons SET
         title = COALESCE(:title, title),
         level = COALESCE(:level, level),
         summary = COALESCE(:summary, summary),
         sort_order = COALESCE(:sort, sort_order),
         blocks = COALESCE(:blocks, blocks)
       WHERE id = :id`,
      {
        id: req.params.id,
        title: title ?? null,
        level: level ?? null,
        summary: summary ?? null,
        sort: sort_order ?? null,
        blocks: blocks ? JSON.stringify(blocks) : null,
      }
    );
    if (!r.affectedRows) return res.status(404).json({ error: 'Хичээл олдсонгүй' });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Засах алдаа' });
  }
});

// хичээл устгах
app.delete('/api/admin/lessons/:id', authRequired, adminRequired, async (req, res) => {
  try {
    const [r] = await pool.execute('DELETE FROM lessons WHERE id = :id', { id: req.params.id });
    if (!r.affectedRows) return res.status(404).json({ error: 'Хичээл олдсонгүй' });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Устгах алдаа' });
  }
});

// курс нэмэх
app.post('/api/admin/courses', authRequired, adminRequired, async (req, res) => {
  try {
    const { id, name, tagline, sort_order } = req.body || {};
    if (!id || !name) return res.status(400).json({ error: 'id, name шаардлагатай' });
    await pool.execute(
      'INSERT INTO courses (id, name, tagline, sort_order) VALUES (:id, :name, :tag, :sort)',
      { id, name, tag: tagline ?? null, sort: Number(sort_order) || 0 }
    );
    res.json({ ok: true });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Энэ курс id байна' });
    console.error(e);
    res.status(500).json({ error: 'Нэмэх алдаа' });
  }
});

/* ===================== STUDY TIME (screen time) ===================== */
app.post('/api/time', authRequired, async (req, res) => {
  try {
    const { lessonId } = req.body || {};
    let seconds = Number(req.body?.seconds) || 0;
    if (!lessonId) return res.status(400).json({ error: 'lessonId шаардлагатай' });
    // нэг хүсэлтэд 5 минутаас илүүг хүлээж авахгүй (буруу өсгөлтөөс хамгаална)
    seconds = Math.max(0, Math.min(300, Math.round(seconds)));
    if (seconds === 0) return res.json({ ok: true });
    await pool.execute(
      `INSERT INTO study_time (user_id, lesson_id, day, seconds)
       VALUES (:uid, :lid, CURDATE(), :s)
       ON DUPLICATE KEY UPDATE seconds = seconds + :s`,
      { uid: req.user.id, lid: String(lessonId).slice(0, 128), s: seconds }
    );
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Хугацаа хадгалах алдаа' });
  }
});

app.get('/api/time', authRequired, async (req, res) => {
  try {
    const uid = req.user.id;
    const [[totalRow]] = await pool.execute(
      'SELECT COALESCE(SUM(seconds),0) AS total FROM study_time WHERE user_id = :uid',
      { uid }
    );
    const [[todayRow]] = await pool.execute(
      'SELECT COALESCE(SUM(seconds),0) AS today FROM study_time WHERE user_id = :uid AND day = CURDATE()',
      { uid }
    );
    const [byDay] = await pool.execute(
      `SELECT DATE_FORMAT(day, '%Y-%m-%d') AS day, SUM(seconds) AS seconds
       FROM study_time WHERE user_id = :uid AND day >= DATE_SUB(CURDATE(), INTERVAL 13 DAY)
       GROUP BY day ORDER BY day`,
      { uid }
    );
    const [byLesson] = await pool.execute(
      `SELECT lesson_id, SUM(seconds) AS seconds
       FROM study_time WHERE user_id = :uid
       GROUP BY lesson_id ORDER BY seconds DESC LIMIT 100`,
      { uid }
    );
    res.json({
      total: Number(totalRow.total),
      today: Number(todayRow.today),
      byDay: byDay.map((r) => ({ day: r.day, seconds: Number(r.seconds) })),
      byLesson: byLesson.map((r) => ({ lessonId: r.lesson_id, seconds: Number(r.seconds) })),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Хугацаа ачаалах алдаа' });
  }
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`✓ Сургалтын API → http://localhost:${PORT}/api/courses`);
});
