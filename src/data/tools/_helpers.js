/* ============================================================
   _helpers.js — Tool курс бичих богино туслахууд
   Блокуудыг товч бичих + 90 хичээлийг 3 түвшинд эмхэлнэ.
   ============================================================ */

export const p = (text) => ({ type: 'p', text });
export const h = (text) => ({ type: 'h', text });
export const c = (cmd, out) =>
  out !== undefined ? { type: 'cmd', cmd, out } : { type: 'cmd', cmd };
export const li = (...items) => ({ type: 'list', items });
export const note = (text) => ({ type: 'note', text });
export const warn = (text) => ({ type: 'warn', text });

// нэг хичээл: гарчиг, товч тайлбар, блокууд
export const L = (title, summary, blocks) => ({ title, summary, blocks });

/* 3 түвшний массивыг нэг курс болгон угсарна (1-30 Анхан, 31-60 Дунд,
   61-90 Ахлах). id нь tool-01 ... tool-90 хэлбэртэй. */
export function buildCourse(id, name, tagline, { anhan, dund, ahlah }) {
  const groups = [
    ['Анхан шат', anhan],
    ['Дунд шат', dund],
    ['Ахлах шат', ahlah],
  ];
  const lessons = [];
  let n = 1;
  for (const [level, arr] of groups) {
    for (const l of arr) {
      lessons.push({
        id: `${id}-${String(n).padStart(2, '0')}`,
        title: l.title,
        level,
        summary: l.summary,
        blocks: l.blocks,
      });
      n++;
    }
  }
  return { id, name, tagline, lessons };
}
