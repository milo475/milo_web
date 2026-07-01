import { useEffect, useRef } from 'react';

/* Confetti — баяр ёслолын canvas эффект. Дэлгэцийн дээрээс өнгөт
   хэсгүүд буудаж унана. `duration` мс-ийн дараа onDone дуудна. */
export default function Confetti({ duration = 4500, onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const colors = ['#2bd6ff', '#8052ff', '#ffb829', '#4be38a', '#ff5f87', '#ffffff'];
    const COUNT = 180;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // эхлээд доороос дээш "буудаж" гарах хэсгүүд
    const parts = Array.from({ length: COUNT }, () => {
      const fromLeft = Math.random() < 0.5;
      return {
        x: fromLeft ? w * 0.15 : w * 0.85,
        y: h + 10,
        vx: (fromLeft ? 1 : -1) * (2 + Math.random() * 6),
        vy: -(9 + Math.random() * 9),
        size: 5 + Math.random() * 7,
        color: colors[(Math.random() * colors.length) | 0],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
        shape: Math.random() < 0.5 ? 'rect' : 'circle',
      };
    });

    const gravity = 0.22;
    const start = performance.now();
    let raf;

    const frame = (now) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - elapsed / duration);
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      if (elapsed < duration && !reduce) raf = requestAnimationFrame(frame);
      else {
        ctx.clearRect(0, 0, w, h);
        onDone?.();
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [duration, onDone]);

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}
