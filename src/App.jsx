import { useEffect, useState, useRef, useCallback } from 'react';
import { PORTFOLIO_DATA as D } from './data.js';
import useReveal from './hooks/useReveal.js';
import { smoothScrollTo } from './utils/smoothScroll.js';
import { useAuth, apiFetch } from './auth/AuthContext.jsx';
import Constellation from './components/Constellation.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import HomeLanding from './components/HomeLanding.jsx';
import Lessons from './components/Lessons.jsx';
import Terminal from './components/Terminal.jsx';
import AuthModal from './components/AuthModal.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import { createShell } from './terminal/shell.js';

export default function App() {
  const { user, logout } = useAuth();
  const [view, setView] = useState('home'); // 'home' | 'lessons' | 'terminal' | 'admin'
  const [authOpen, setAuthOpen] = useState(false);
  const pendingScroll = useRef(null);

  // явц: дуусгасан хичээл/сорилын id-ууд
  const [doneLessons, setDoneLessons] = useState(() => new Set());
  const [doneChallenges, setDoneChallenges] = useState(() => new Set());

  // persistent terminal session (kept here so it survives close/reopen)
  const termShell = useRef(null);
  if (termShell.current === null) termShell.current = createShell();
  const [termEntries, setTermEntries] = useState([]);
  const [termInput, setTermInput] = useState('');
  const [termBoot, setTermBoot] = useState(null);

  // sync document <title> / meta description from data
  useEffect(() => {
    if (D.meta?.title) document.title = D.meta.title;
    if (D.meta?.desc) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', D.meta.desc);
    }
  }, []);

  useReveal();

  // хэрэглэгч нэвтрэх/гарах үед явцыг ачаалах/цэвэрлэх
  useEffect(() => {
    if (!user) {
      setDoneLessons(new Set());
      setDoneChallenges(new Set());
      if (view === 'admin' || view === 'screentime') setView('home');
      return;
    }
    apiFetch('/api/progress')
      .then((d) => {
        setDoneLessons(new Set(d.lessons || []));
        setDoneChallenges(new Set(d.challenges || []));
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const markLesson = useCallback(
    (lessonKey) => {
      if (!user) return;
      setDoneLessons((prev) => new Set(prev).add(lessonKey));
      apiFetch('/api/progress', {
        method: 'POST',
        body: JSON.stringify({ lessonId: lessonKey }),
      }).catch(() => {});
    },
    [user]
  );

  const onChallengeWin = useCallback(
    (challengeId) => {
      if (!user || !challengeId) return;
      setDoneChallenges((prev) => new Set(prev).add(challengeId));
      apiFetch('/api/challenge-results', {
        method: 'POST',
        body: JSON.stringify({ challengeId }),
      }).catch(() => {});
    },
    [user]
  );

  const openLessons = () => {
    setView('lessons');
    window.scrollTo(0, 0);
  };
  const openTerminal = (challengeId) => {
    if (typeof challengeId === 'string') setTermBoot(`soril start ${challengeId}`);
    setView('terminal');
    window.scrollTo(0, 0);
  };
  const openAdmin = () => {
    setView('admin');
    window.scrollTo(0, 0);
  };
  const resetTerminal = () => {
    termShell.current = createShell();
    setTermEntries([]);
    setTermInput('');
  };

  const goHome = (id) => {
    pendingScroll.current = id ?? null;
    setView('home');
  };

  useEffect(() => {
    if (view === 'home' && pendingScroll.current) {
      const id = pendingScroll.current;
      pendingScroll.current = null;
      requestAnimationFrame(() => smoothScrollTo(id));
    }
  }, [view]);

  return (
    <>
      <Constellation />
      <Nav
        brand={D.brand}
        view={view}
        onOpenLessons={openLessons}
        onGoHome={goHome}
        user={user}
        onLogin={() => setAuthOpen(true)}
        onLogout={logout}
        onOpenAdmin={openAdmin}
      />

      {view === 'admin' ? (
        <main id="top">
          <AdminPanel onBack={openLessons} />
        </main>
      ) : view === 'terminal' ? (
        <main id="top">
          <Terminal
            shell={termShell.current}
            entries={termEntries}
            setEntries={setTermEntries}
            input={termInput}
            setInput={setTermInput}
            onClose={openLessons}
            onReset={resetTerminal}
            bootCommand={termBoot}
            onBootConsumed={() => setTermBoot(null)}
            onChallengeWin={onChallengeWin}
          />
        </main>
      ) : view === 'lessons' ? (
        <main id="top">
          <Lessons
            onBack={() => goHome('top')}
            onOpenTerminal={openTerminal}
            user={user}
            doneLessons={doneLessons}
            doneChallenges={doneChallenges}
            onMarkLesson={markLesson}
            onRequireLogin={() => setAuthOpen(true)}
          />
        </main>
      ) : (
        <main id="top">
          <HomeLanding onOpenLessons={openLessons} onOpenTerminal={openTerminal} user={user} />
        </main>
      )}

      <Footer footer={D.footer} />
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}
