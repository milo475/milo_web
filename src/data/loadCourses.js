/* loadCourses.js — Курсуудыг API-аас татна, бүтэлгүйтвэл локал
   (static) COURSES рүү найдварлан шилжинэ.

   Ингэснээр backend/MySQL ажиллаагүй үед ч сайт хэвийн ажиллана. */
import { COURSES as STATIC_COURSES } from './courses.js';
import { API_BASE } from '../config.js';

const API_URL = API_BASE + '/api/courses';

export async function loadCourses(signal) {
  try {
    const res = await fetch(API_URL, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return { courses: data, source: 'api' };
    }
    throw new Error('хоосон хариу');
  } catch (err) {
    if (err?.name !== 'AbortError') {
      console.warn('[courses] API-аас татаж чадсангүй, локал өгөгдөл ашиглана:', err.message);
    }
    return { courses: STATIC_COURSES, source: 'static' };
  }
}

export { STATIC_COURSES };
export default loadCourses;
