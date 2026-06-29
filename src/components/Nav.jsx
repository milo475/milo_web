export default function Nav({ brand }) {
  // animated smooth-scroll to a section, offset by the fixed nav height
  const handleNav = (e, id) => {
    const target = id === 'top' ? document.body : document.getElementById(id);
    if (!target) return;
    e.preventDefault();

    const nav = document.querySelector('.nav');
    const navBottom = nav ? nav.getBoundingClientRect().bottom : 90;
    const startY = window.scrollY || window.pageYOffset;

    // absolute document offset of the target (ignores CSS transforms
    // applied by the reveal-on-scroll animation, unlike getBoundingClientRect)
    let absTop = 0;
    for (let el = target; el; el = el.offsetParent) absTop += el.offsetTop;

    const targetTop = id === 'top' ? 0 : absTop - navBottom - 16;

    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    const destY = Math.max(0, Math.min(targetTop, maxY));
    const distance = destY - startY;
    if (Math.abs(distance) < 2) return;

    const duration = 600; // ms
    const startTime = performance.now();
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(t));
      if (t < 1) requestAnimationFrame(step);
      else history.pushState(null, '', id === 'top' ? ' ' : `#${id}`);
    }
    requestAnimationFrame(step);
  };

  return (
    <header className="nav">
      <div className="nav__inner">
        <a className="logo" href="#top" onClick={(e) => handleNav(e, 'top')}>
          <span className="logo__mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M2 6.5 11 2l9 4.5v9L11 20 2 15.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M2 6.5 11 11l9-4.5M11 11v9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="logo__word">{brand}</span>
        </a>
        <nav className="nav__links">
          <a className="btn btn--ghost" href="#about" onClick={(e) => handleNav(e, 'about')}>ТАНИЛЦУУЛГА</a>
          <a className="btn btn--ghost" href="#skills" onClick={(e) => handleNav(e, 'skills')}>УР ЧАДВАР</a>
          <a className="btn btn--ghost" href="#work" onClick={(e) => handleNav(e, 'work')}>АЖИЛ</a>
          <a className="btn btn--primary" href="#contact" onClick={(e) => handleNav(e, 'contact')}>ХОЛБОО БАРИХ</a>
        </nav>
      </div>
    </header>
  );
}
