/* ============================================================
   smoothScroll.js — fixed-nav-aware animated scroll-to-section
   Shared by Nav (anchor clicks) and App (deferred scroll after a
   view switch back to the home page).
   ============================================================ */

/**
 * Smoothly scroll the window to the element with the given id.
 * Pass 'top' to scroll to the very top of the document.
 * Accounts for the fixed nav height and ignores CSS transforms applied
 * by the reveal-on-scroll animation (uses offsetTop chain, not rects).
 */
export function smoothScrollTo(id) {
  const target = id === 'top' ? document.body : document.getElementById(id);
  if (!target) return;

  const nav = document.querySelector('.nav');
  const navBottom = nav ? nav.getBoundingClientRect().bottom : 90;
  const startY = window.scrollY || window.pageYOffset;

  // absolute document offset of the target (ignores CSS transforms)
  let absTop = 0;
  for (let el = target; el; el = el.offsetParent) absTop += el.offsetTop;

  const targetTop = id === 'top' ? 0 : absTop - navBottom - 16;
  const maxY = document.documentElement.scrollHeight - window.innerHeight;
  const destY = Math.max(0, Math.min(targetTop, maxY));
  const distance = destY - startY;

  const setHash = () =>
    history.pushState(null, '', id === 'top' ? ' ' : `#${id}`);

  if (Math.abs(distance) < 2) {
    setHash();
    return;
  }

  const duration = 600; // ms
  const startTime = performance.now();
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(t));
    if (t < 1) requestAnimationFrame(step);
    else setHash();
  }
  requestAnimationFrame(step);
}

export default smoothScrollTo;
