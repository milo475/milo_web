import { useEffect, useRef } from 'react';

/**
 * Particle constellation background.
 * Full-bleed fixed canvas with drifting shapes, linking lines,
 * and subtle mouse repulsion. Honors prefers-reduced-motion.
 */
export default function Constellation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const PALETTE = ['#8052ff', '#ffb829', '#15846e', '#ffffff'];
    const SHAPES = ['triangle', 'circle', 'diamond', 'square'];
    let w, h, particles, dpr;
    let rafId = null;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      seed();
    }

    function seed() {
      const count = Math.min(260, Math.floor((innerWidth * innerHeight) / 7000));
      particles = [];
      // bias clustering toward the right half (hero constellation)
      for (let i = 0; i < count; i++) {
        const cluster = Math.random() < 0.6;
        const cx = cluster ? w * 0.72 : Math.random() * w;
        const cy = cluster ? h * 0.45 : Math.random() * h;
        const spread = cluster ? Math.min(w, h) * 0.28 : 0;
        const ang = Math.random() * Math.PI * 2;
        const r = cluster ? Math.pow(Math.random(), 0.6) * spread : 0;
        particles.push({
          x: cluster ? cx + Math.cos(ang) * r : cx,
          y: cluster ? cy + Math.sin(ang) * r : cy,
          size: (2 + Math.random() * 4) * dpr,
          vx: (Math.random() - 0.5) * 0.12 * dpr,
          vy: (Math.random() - 0.5) * 0.12 * dpr,
          color: PALETTE[Math.random() < 0.55 ? 0 : Math.floor(Math.random() * PALETTE.length)],
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          rot: Math.random() * Math.PI,
          alpha: 0.4 + Math.random() * 0.6,
        });
      }
    }

    function drawShape(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      const s = p.size;
      switch (p.shape) {
        case 'circle':
          ctx.beginPath(); ctx.arc(0, 0, s / 2, 0, Math.PI * 2); ctx.fill(); break;
        case 'triangle':
          ctx.beginPath(); ctx.moveTo(0, -s / 1.6); ctx.lineTo(s / 1.8, s / 2); ctx.lineTo(-s / 1.8, s / 2); ctx.closePath(); ctx.fill(); break;
        case 'diamond':
          ctx.beginPath(); ctx.moveTo(0, -s / 1.4); ctx.lineTo(s / 1.4, 0); ctx.lineTo(0, s / 1.4); ctx.lineTo(-s / 1.4, 0); ctx.closePath(); ctx.fill(); break;
        default:
          ctx.fillRect(-s / 2, -s / 2, s, s);
      }
      ctx.restore();
    }

    function link() {
      const maxD = 120 * dpr;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < maxD) {
            ctx.globalAlpha = (1 - d / maxD) * 0.12;
            ctx.strokeStyle = '#8052ff';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      const mx = mouse.x * dpr, my = mouse.y * dpr;
      for (const p of particles) {
        // gentle drift
        p.x += p.vx; p.y += p.vy; p.rot += 0.002;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        // subtle mouse repulsion
        const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
        if (d < 120 * dpr) { p.x += (dx / d) * 0.8; p.y += (dy / d) * 0.8; }
        drawShape(p);
      }
      link();
      rafId = requestAnimationFrame(tick);
    }

    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);

    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      resize(); tick();
    } else {
      resize();
      // static render once
      ctx.clearRect(0, 0, w, h);
      particles.forEach(drawShape); link();
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas id="constellation" aria-hidden="true" ref={canvasRef} />;
}
