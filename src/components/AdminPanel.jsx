import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../auth/AuthContext.jsx';

const empty = { lesson_id: '', title: '', level: '', summary: '', blocksText: '[]' };

export default function AdminPanel({ onBack }) {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null); // бүтэн id засаж байгаа эсэх
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const data = await apiFetch('/api/courses');
    setCourses(data);
    if (!courseId && data[0]) setCourseId(data[0].id);
  }, [courseId]);

  useEffect(() => {
    load().catch((e) => setMsg('Ачаалах алдаа: ' + e.message));
  }, [load]);

  const course = courses.find((c) => c.id === courseId);
  const lessons = course?.lessons ?? [];

  const resetForm = () => {
    setForm(empty);
    setEditingId(null);
  };

  const editLesson = (l) => {
    setEditingId(`${courseId}__${l.id}`);
    setForm({
      lesson_id: l.id,
      title: l.title || '',
      level: l.level || '',
      summary: l.summary || '',
      blocksText: JSON.stringify(l.blocks ?? [], null, 2),
    });
  };

  const save = async () => {
    setMsg('');
    let blocks;
    try {
      blocks = JSON.parse(form.blocksText || '[]');
    } catch {
      setMsg('blocks JSON буруу байна');
      return;
    }
    try {
      if (editingId) {
        await apiFetch(`/api/admin/lessons/${encodeURIComponent(editingId)}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: form.title, level: form.level, summary: form.summary, blocks,
          }),
        });
        setMsg('✓ Шинэчлэгдлээ');
      } else {
        await apiFetch('/api/admin/lessons', {
          method: 'POST',
          body: JSON.stringify({
            course_id: courseId,
            lesson_id: form.lesson_id,
            title: form.title, level: form.level, summary: form.summary,
            blocks, sort_order: lessons.length + 1,
          }),
        });
        setMsg('✓ Нэмэгдлээ');
      }
      resetForm();
      await load();
    } catch (e) {
      setMsg('Алдаа: ' + e.message);
    }
  };

  const del = async (l) => {
    if (!window.confirm(`"${l.title}" хичээлийг устгах уу?`)) return;
    try {
      await apiFetch(`/api/admin/lessons/${encodeURIComponent(`${courseId}__${l.id}`)}`, {
        method: 'DELETE',
      });
      setMsg('✓ Устгагдлаа');
      if (editingId === `${courseId}__${l.id}`) resetForm();
      await load();
    } catch (e) {
      setMsg('Алдаа: ' + e.message);
    }
  };

  return (
    <section className="admin">
      <div className="admin__head">
        <div>
          <p className="eyebrow eyebrow--kali">ADMIN · ХИЧЭЭЛ УДИРДАХ</p>
          <h1 className="admin__title">Админ панел</h1>
        </div>
        <button className="btn btn--ghost" onClick={onBack}>← БУЦАХ</button>
      </div>

      <div className="admin__bar">
        <label>
          Курс:{' '}
          <select value={courseId} onChange={(e) => { setCourseId(e.target.value); resetForm(); }}>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.lessons.length})</option>
            ))}
          </select>
        </label>
        <button className="btn btn--ghost" onClick={resetForm}>+ Шинэ хичээл</button>
        {msg && <span className="admin__msg">{msg}</span>}
      </div>

      <div className="admin__grid">
        <div className="admin__list">
          {lessons.map((l, i) => (
            <div key={l.id} className="admin__row">
              <span className="admin__rownum">{String(i + 1).padStart(2, '0')}</span>
              <span className="admin__rowtitle">{l.title}</span>
              <span className="admin__rowlevel">{l.level}</span>
              <button className="admin__mini" onClick={() => editLesson(l)}>засах</button>
              <button className="admin__mini admin__mini--del" onClick={() => del(l)}>устгах</button>
            </div>
          ))}
        </div>

        <div className="admin__form">
          <h3>{editingId ? 'Хичээл засах' : 'Шинэ хичээл'}</h3>
          {!editingId && (
            <label className="admin__field">
              <span>lesson_id (давтагдашгүй, ж: b31)</span>
              <input value={form.lesson_id} onChange={(e) => setForm({ ...form, lesson_id: e.target.value })} />
            </label>
          )}
          <label className="admin__field">
            <span>Гарчиг</span>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label className="admin__field">
            <span>Түвшин</span>
            <input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="Анхан шат" />
          </label>
          <label className="admin__field">
            <span>Тайлбар (summary)</span>
            <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </label>
          <label className="admin__field">
            <span>blocks (JSON)</span>
            <textarea
              rows={10}
              value={form.blocksText}
              onChange={(e) => setForm({ ...form, blocksText: e.target.value })}
              spellCheck={false}
            />
          </label>
          <button className="btn btn--primary" onClick={save}>
            {editingId ? 'ХАДГАЛАХ' : 'НЭМЭХ'}
          </button>
        </div>
      </div>
    </section>
  );
}
