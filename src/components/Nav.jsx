import { smoothScrollTo } from '../utils/smoothScroll.js';

export default function Nav({
  brand,
  view = 'home',
  onOpenLessons,
  onGoHome,
  user,
  onLogin,
  onLogout,
  onOpenAdmin,
}) {
  // anchor click: scroll within the home page, or first return home then scroll
  const handleNav = (e, id) => {
    e.preventDefault();
    if (view !== 'home') {
      onGoHome?.(id); // App switches to home, then scrolls once mounted
      return;
    }
    smoothScrollTo(id);
  };

  const handleLogo = (e) => {
    e.preventDefault();
    if (view !== 'home') onGoHome?.('top');
    else smoothScrollTo('top');
  };

  return (
    <header className="nav">
      <div className="nav__inner">
        <a className="logo" href="#top" onClick={handleLogo}>
          <span className="logo__mark logo__mark--text" aria-hidden="true">ocir</span>
        </a>
        <nav className="nav__links">
          <button
            type="button"
            className={`btn btn--kali ${view !== 'home' ? 'is-active' : ''}`}
            onClick={() => onOpenLessons?.()}
          >
            <span className="btn--kali__icon" aria-hidden="true">&gt;_</span>
            kali-linux
          </button>
          {view === 'home' && (
            <>
              <a className="btn btn--ghost" href="#courses" onClick={(e) => handleNav(e, 'courses')}>КУРСУУД</a>
              <a className="btn btn--ghost" href="#features" onClick={(e) => handleNav(e, 'features')}>ОНЦЛОГ</a>
              <button type="button" className="btn btn--primary" onClick={() => onOpenLessons?.()}>СУРГАЛТ ЭХЛЭХ</button>
            </>
          )}
          {user ? (
            <span className="nav__auth">
              {user.role === 'admin' && (
                <button type="button" className="btn btn--ghost" onClick={() => onOpenAdmin?.()}>
                  АДМИН
                </button>
              )}
              <span className="nav__user" title={user.username}>@{user.username}</span>
              <button type="button" className="btn btn--ghost" onClick={() => onLogout?.()}>
                ГАРАХ
              </button>
            </span>
          ) : (
            <button type="button" className="btn btn--ghost nav__auth" onClick={() => onLogin?.()}>
              НЭВТРЭХ
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
