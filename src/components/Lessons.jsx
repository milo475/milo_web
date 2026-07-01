import { useState, useRef, useEffect } from 'react';
import { loadCourses, STATIC_COURSES } from '../data/loadCourses.js';
import { apiFetch } from '../auth/AuthContext.jsx';

/* A single Kali-style terminal command block.
   ┌──(kali㉿kali)-[~]
   └─$ <command>
   <output>
   An empty `cmd` renders just the prompt (used as a demo). */
function Term({ cmd, out }) {
  return (
    <div className="term" role="figure" aria-label="terminal">
      <div className="term__bar">
        <span className="term__dot term__dot--r" />
        <span className="term__dot term__dot--y" />
        <span className="term__dot term__dot--g" />
      </div>
      <pre className="term__body">
        <span className="term__line1">
          ┌──(<span className="term__user">kali</span>㉿<span className="term__user">kali</span>)-[<span className="term__path">~</span>]
        </span>
        {'\n'}
        <span className="term__line2">
          └─<span className="term__prompt">$</span>{cmd ? ` ${cmd}` : ' '}
        </span>
        {out ? <span className="term__out">{'\n' + out}</span> : null}
      </pre>
    </div>
  );
}

function Block({ block }) {
  switch (block.type) {
    case 'h':
      return <h3 className="lesson__h">{block.text}</h3>;
    case 'list':
      return (
        <ul className="lesson__list">
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case 'cmd':
      return <Term cmd={block.cmd} out={block.out} />;
    case 'note':
      return (
        <div className="callout callout--note">
          <span className="callout__tag">ЗӨВЛӨМЖ</span>
          <p>{block.text}</p>
        </div>
      );
    case 'warn':
      return (
        <div className="callout callout--warn">
          <span className="callout__tag">АНХААР</span>
          <p>{block.text}</p>
        </div>
      );
    case 'p':
    default:
      return <p className="lesson__p">{block.text}</p>;
  }
}

export default function Lessons({
  onBack,
  onOpenTerminal,
  user,
  doneLessons = new Set(),
  doneChallenges = new Set(),
  onMarkLesson,
  onRequireLogin,
}) {
  const [courses, setCourses] = useState(STATIC_COURSES);
  const [courseIdx, setCourseIdx] = useState(0);
  const [active, setActive] = useState(0);
  const contentRef = useRef(null);

  // Курсуудыг MySQL API-аас татна (бүтэлгүйтвэл локал өгөгдөл хэвээр).
  useEffect(() => {
    const ctrl = new AbortController();
    loadCourses(ctrl.signal).then(({ courses: data }) => {
      setCourses(data);
      setCourseIdx((i) => Math.min(i, data.length - 1));
      setActive(0);
    });
    return () => ctrl.abort();
  }, []);

  const course = courses[courseIdx] ?? courses[0];
  const lessons = course?.lessons ?? [];
  const lesson = lessons[active] ?? lessons[0];

  // Түвшин дуусах хичээл дээр СОРИЛ санал болгоно
  const TOOL_IDS = ['nmap', 'wireshark', 'metasploit', 'john'];
  let challengeId = null;
  if (lesson) {
    if (course?.id === 'linux') {
      challengeId = { b30: 'anhan', m30: 'dund', a30: 'ahlah' }[lesson.id] || null;
    } else if (TOOL_IDS.includes(course?.id)) {
      const m = /-(\d+)$/.exec(lesson.id);
      const n = m ? Number(m[1]) : 0;
      const lvl = n === 30 ? 'anhan' : n === 60 ? 'dund' : n === 90 ? 'ahlah' : null;
      if (lvl) challengeId = `${course.id}_${lvl}`;
    }
  }

  // явцын тооцоо
  const keyOf = (l) => `${course?.id}:${l.id}`;
  const doneCount = lessons.reduce((n, l) => n + (doneLessons.has(keyOf(l)) ? 1 : 0), 0);
  const percent = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;
  const lessonDone = lesson ? doneLessons.has(keyOf(lesson)) : false;
  const challengeDone = challengeId ? doneChallenges.has(challengeId) : false;

  const markDone = () => {
    if (!user) return onRequireLogin?.();
    if (lesson) onMarkLesson?.(keyOf(lesson));
  };

  // --- хичээлд зарцуулсан хугацааг ЖИНХЭНЭ бодит цагаар хэмжих (screen time) ---
  const timeKeyRef = useRef(null);
  timeKeyRef.current = lesson && course ? `${course.id}:${lesson.id}` : null;
  useEffect(() => {
    if (!user) return undefined;
    let last = Date.now();
    let pending = 0; // илгээгээгүй хуримтлагдсан секунд
    let key = timeKeyRef.current;

    const send = (k, secs) => {
      if (!k || secs < 1) return;
      apiFetch('/api/time', {
        method: 'POST',
        body: JSON.stringify({ lessonId: k, seconds: Math.round(secs) }),
      }).catch(() => {});
    };

    // өнгөрсөн бодит хугацааг (зөвхөн дэлгэц харагдаж байх үед) нэмнэ
    const accumulate = () => {
      const now = Date.now();
      const delta = (now - last) / 1000;
      last = now;
      // 15с-ээс дээш үсрэлтийг (sleep/throttle) хязгаарлана
      if (document.visibilityState === 'visible') pending += Math.min(delta, 15);
    };

    const iv = setInterval(() => {
      accumulate();
      if (timeKeyRef.current !== key) {
        send(key, pending); // хичээл солигдвол өмнөх хичээл рүү бичнэ
        pending = 0;
        key = timeKeyRef.current;
      } else if (pending >= 20) {
        send(key, pending);
        pending = 0;
      }
    }, 5000);

    const onVis = () => {
      accumulate();
      if (document.visibilityState !== 'visible') {
        send(key, pending);
        pending = 0;
      }
      last = Date.now(); // нуугдсан хугацааг тоолохгүйн тулд суурийг шинэчилнэ
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      clearInterval(iv);
      accumulate();
      send(key, pending); // дэлгэцээс гарахад үлдсэнийг бичнэ
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [user]);

  // scroll the content pane back to the top when switching lessons/courses
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [active, courseIdx]);

  const selectCourse = (i) => {
    setCourseIdx(i);
    setActive(0);
  };

  return (
    <section className="lessons" id="lessons" aria-label="Kali Linux хичээлүүд">
      <div className="lessons__head">
        <div>
          <p className="eyebrow eyebrow--kali">KALI LINUX · СУРГАЛТ</p>
          <h1 className="lessons__title">Хэрэгсэл сонгож сур</h1>
          <p className="lessons__sub">
            Курс сонгоод дугаарлагдсан хичээлүүдийг эхнээс нь үзээрэй.
          </p>
        </div>
        <div className="lessons__actions">
          <button
            className="btn btn--kali lessons__terminal"
            onClick={() => onOpenTerminal()}
          >
            <span className="btn--kali__icon" aria-hidden="true">&gt;_</span>
            terminal нээх
          </button>
          <button className="btn btn--ghost lessons__back" onClick={onBack}>
            ← PORTFOLIO РУУ
          </button>
        </div>
      </div>

      {/* course / tool selector */}
      <div className="course-tabs" role="tablist" aria-label="Курс сонгох">
        {courses.map((c, i) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={i === courseIdx}
            className={`course-tab ${i === courseIdx ? 'is-active' : ''}`}
            onClick={() => selectCourse(i)}
          >
            <span className="course-tab__name">{c.name}</span>
            <span className="course-tab__tag">{c.tagline}</span>
          </button>
        ))}
      </div>

      <div className="course-progress">
        <div className="course-progress__bar">
          <span className="course-progress__fill" style={{ width: `${percent}%` }} />
        </div>
        <span className="course-progress__label">
          {user
            ? `${doneCount}/${lessons.length} дууссан · ${percent}%`
            : 'Явц хадгалахын тулд нэвтэрнэ үү'}
        </span>
      </div>

      <div className="lessons__grid">
        <nav className="lesson-list" aria-label="Хичээлийн жагсаалт">
          <ol>
            {lessons.map((l, i) => (
              <li key={l.id}>
                <button
                  className={`lesson-list__item ${i === active ? 'is-active' : ''} ${doneLessons.has(`${course?.id}:${l.id}`) ? 'is-done' : ''}`}
                  onClick={() => setActive(i)}
                >
                  <span className="lesson-list__num">
                    {doneLessons.has(`${course?.id}:${l.id}`)
                      ? '✓'
                      : String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="lesson-list__text">
                    <span className="lesson-list__name">{l.title}</span>
                    <span className="lesson-list__level">{l.level}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <article className="lesson-content" ref={contentRef}>
          <header className="lesson-content__head">
            <span className="lesson-content__kicker">
              {course.name.toUpperCase()} · ХИЧЭЭЛ {String(active + 1).padStart(2, '0')} · {lesson.level}
            </span>
            <h2 className="lesson-content__title">{lesson.title}</h2>
            {lesson.summary && (
              <p className="lesson-content__summary">{lesson.summary}</p>
            )}
          </header>

          <div className="lesson-content__body">
            {lesson.blocks.map((b, i) => (
              <Block key={i} block={b} />
            ))}
          </div>

          <div className="lesson-done">
            <button
              className={`btn ${lessonDone ? 'btn--ghost' : 'btn--primary'} lesson-done__btn`}
              onClick={markDone}
              disabled={lessonDone}
            >
              {lessonDone ? '✓ Дууссан' : 'Дуусгасан гэж тэмдэглэх'}
            </button>
            {!user && (
              <span className="lesson-done__hint">(нэвтэрвэл явц хадгалагдана)</span>
            )}
          </div>

          {challengeId && (
            <div className="challenge-cta">
              <div className="challenge-cta__info">
                <p className="challenge-cta__title">
                  🎯 {lesson.level} дууслаа! {challengeDone && <span className="challenge-cta__done">✓ Сорил давсан</span>}
                </p>
                <p className="challenge-cta__text">
                  Сурсан зүйлээ терминал дээр сорилоор бататга.
                </p>
              </div>
              <button
                className="btn btn--primary challenge-cta__btn"
                onClick={() => onOpenTerminal(challengeId)}
              >
                {challengeDone ? 'ДАХИН ӨГӨХ →' : 'СОРИЛ ӨГӨХ →'}
              </button>
            </div>
          )}

          <div className="lesson-content__nav">
            <button
              className="btn btn--ghost"
              disabled={active === 0}
              onClick={() => setActive((a) => Math.max(0, a - 1))}
            >
              ← ӨМНӨХ
            </button>
            <span className="lesson-content__progress">
              {active + 1} / {lessons.length}
            </span>
            <button
              className="btn btn--primary"
              disabled={active === lessons.length - 1}
              onClick={() => setActive((a) => Math.min(lessons.length - 1, a + 1))}
            >
              ДАРАА →
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
