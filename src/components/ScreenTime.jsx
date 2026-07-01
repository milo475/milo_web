import { useEffect, useState } from 'react';
import { apiFetch } from '../auth/AuthContext.jsx';

function fmt(sec) {
  sec = Math.round(sec || 0);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}ц ${m}м`;
  if (m > 0) return `${m}м`;
  return `${sec}с`;
}

const WD = ['Ня', 'Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя'];

/* сүүлийн 7 өдрийг (өнөөдрөөр төгсгөж) тэгээр дүүргэж бэлдэнэ */
function last7(byDay) {
  const map = new Map((byDay || []).map((d) => [d.day, d.seconds]));
  const out = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ day: key, label: WD[d.getDay()], dom: d.getDate(), seconds: map.get(key) || 0 });
  }
  return out;
}

export default function ScreenTime({ onBack, embedded = false }) {
  const [data, setData] = useState(null);
  const [nameMap, setNameMap] = useState({});
  const [err, setErr] = useState('');

  useEffect(() => {
    Promise.all([apiFetch('/api/time'), apiFetch('/api/courses').catch(() => [])])
      .then(([t, courses]) => {
        setData(t);
        const m = {};
        (courses || []).forEach((c) =>
          (c.lessons || []).forEach((l) => {
            m[`${c.id}:${l.id}`] = `${c.name} · ${l.title}`;
          })
        );
        setNameMap(m);
      })
      .catch((e) => setErr(e.message));
  }, []);

  const days = last7(data?.byDay);
  const maxSec = Math.max(60, ...days.map((d) => d.seconds));

  return (
    <section className={embedded ? 'section screentime screentime--embedded' : 'screentime'}>
      <div className="screentime__head">
        <div>
          <p className="eyebrow eyebrow--kali">МИНИЙ ЦАГ · SCREEN TIME</p>
          <h1 className="screentime__title">Сурсан хугацаа</h1>
        </div>
        {!embedded && (
          <button className="btn btn--ghost" onClick={onBack}>← БУЦАХ</button>
        )}
      </div>

      {err && <p className="auth-form__err">{err}</p>}
      {!data && !err && <p className="body">Ачааллаж байна…</p>}

      {data && (
        <>
          <div className="st-cards">
            <div className="st-card">
              <span className="st-card__l">Өнөөдөр</span>
              <span className="st-card__v">{fmt(data.today)}</span>
            </div>
            <div className="st-card">
              <span className="st-card__l">Нийт</span>
              <span className="st-card__v">{fmt(data.total)}</span>
            </div>
            <div className="st-card">
              <span className="st-card__l">Идэвхтэй өдөр</span>
              <span className="st-card__v">{(data.byDay || []).length}</span>
            </div>
          </div>

          {/* өдрийн bar chart (утасны screen time шиг) */}
          <div className="st-chart-wrap">
            <h2 className="heading st-h">Сүүлийн 7 хоног</h2>
            <div className="st-chart">
              {days.map((d) => (
                <div key={d.day} className="st-bar">
                  <span className="st-bar__time">{d.seconds ? fmt(d.seconds) : ''}</span>
                  <div className="st-bar__track">
                    <span
                      className="st-bar__fill"
                      style={{ height: `${Math.round((d.seconds / maxSec) * 100)}%` }}
                    />
                  </div>
                  <span className="st-bar__day">{d.label}</span>
                  <span className="st-bar__dom">{d.dom}</span>
                </div>
              ))}
            </div>
          </div>

          {/* хичээл тус бүрийн задаргаа */}
          <div className="st-lessons-wrap">
            <h2 className="heading st-h">Хичээл тус бүрээр</h2>
            {(data.byLesson || []).length === 0 ? (
              <p className="body body--measure">
                Одоогоор бүртгэгдсэн цаг алга. Хичээл үзэж эхэлбэл энд харагдана.
              </p>
            ) : (
              <ul className="st-lessons">
                {data.byLesson.map((l) => {
                  const pct = Math.round((l.seconds / data.byLesson[0].seconds) * 100);
                  return (
                    <li key={l.lessonId} className="st-lesson">
                      <span className="st-lesson__name">
                        {nameMap[l.lessonId] || l.lessonId}
                      </span>
                      <span className="st-lesson__bar">
                        <span className="st-lesson__fill" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="st-lesson__time">{fmt(l.seconds)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  );
}
