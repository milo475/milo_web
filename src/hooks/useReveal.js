import { useEffect } from 'react';

/**
 * Reveal-on-scroll: adds `is-in` to every `.reveal` element when it
 * enters the viewport. Run once after the content has mounted.
 */
export default function useReveal() {
  useEffect(() => {
    const sections = document.querySelectorAll('.section');
    sections.forEach((s) => s.classList.add('reveal'));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);
}
