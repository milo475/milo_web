// seed.mjs — src/data/courses.js доторх бүх курс, хичээлийг MySQL-д хадгална.
// Ажиллуулах:  node server/seed.mjs   (эсвэл  npm run seed)
import { pool } from './db.js';
import { COURSES } from '../src/data/courses.js';

async function seed() {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Хуучин өгөгдлийг цэвэрлэж дахин бичнэ (idempotent seed).
    // FK-ийн улмаас lessons эхэлж устана (эсвэл CASCADE).
    await conn.query('DELETE FROM lessons');
    await conn.query('DELETE FROM courses');

    let courseCount = 0;
    let lessonCount = 0;

    for (let ci = 0; ci < COURSES.length; ci++) {
      const c = COURSES[ci];
      await conn.execute(
        `INSERT INTO courses (id, name, tagline, sort_order)
         VALUES (:id, :name, :tagline, :sort)`,
        { id: c.id, name: c.name, tagline: c.tagline ?? null, sort: ci }
      );
      courseCount++;

      for (let li = 0; li < c.lessons.length; li++) {
        const l = c.lessons[li];
        await conn.execute(
          `INSERT INTO lessons (id, course_id, title, level, summary, sort_order, blocks)
           VALUES (:id, :course_id, :title, :level, :summary, :sort, :blocks)`,
          {
            // хичээлийн id курсын дотор давтагдахгүй байхын тулд угтвар нэмнэ
            id: `${c.id}__${l.id}`,
            course_id: c.id,
            title: l.title,
            level: l.level ?? null,
            summary: l.summary ?? null,
            sort: li,
            blocks: JSON.stringify(l.blocks ?? []),
          }
        );
        lessonCount++;
      }
    }

    await conn.commit();
    console.log(`✓ Хадгаллаа: ${courseCount} курс, ${lessonCount} хичээл.`);
  } catch (err) {
    await conn.rollback();
    console.error('✗ Seed алдаа:', err.message);
    process.exitCode = 1;
  } finally {
    conn.release();
    await pool.end();
  }
}

seed();
