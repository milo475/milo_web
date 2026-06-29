/* ============================================================
   app.js — particle constellation + content rendering
   ============================================================ */

/* ---------- 1. PARTICLE CONSTELLATION ---------- */
(function constellation() {
  const canvas = document.getElementById('constellation');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const PALETTE = ['#8052ff', '#ffb829', '#15846e', '#ffffff'];
  const SHAPES = ['triangle', 'circle', 'diamond', 'square'];
  let w, h, particles, dpr;
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
    requestAnimationFrame(tick);
  }

  addEventListener('resize', resize);
  addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    resize(); tick();
  } else {
    resize();
    // static render once
    ctx.clearRect(0, 0, w, h);
    particles.forEach(drawShape); link();
  }
})();

/* ---------- 2. RENDER CONTENT FROM data.js ---------- */
(function render() {
  const D = window.PORTFOLIO_DATA;
  if (!D) return;

  const setText = (sel, val) => { document.querySelectorAll(sel).forEach(el => { if (val != null) el.textContent = val; }); };
  const setHTML = (sel, val) => { document.querySelectorAll(sel).forEach(el => { if (val != null) el.innerHTML = val; }); };

  // simple bindings
  if (D.brand) setText('[data-bind="brand"]', D.brand);
  if (D.meta?.title) document.title = D.meta.title;
  if (D.meta?.title) document.querySelector('[data-bind="metaTitle"]')?.replaceChildren(document.createTextNode(D.meta.title));
  if (D.meta?.desc) document.querySelector('[data-bind="metaDesc"]')?.setAttribute('content', D.meta.desc);

  setText('[data-bind="heroEyebrow"]', D.hero?.eyebrow);
  setHTML('[data-bind="heroTitle"]', D.hero?.title);
  setText('[data-bind="heroSubtitle"]', D.hero?.subtitle);

  setText('[data-bind="aboutTitle"]', D.about?.title);
  setText('[data-bind="aboutBody"]', D.about?.body);

  setText('[data-bind="contactTitle"]', D.contact?.title);
  setText('[data-bind="footer"]', D.footer);

  // about facts
  const facts = document.querySelector('[data-region="facts"]');
  if (facts && D.about?.facts?.length) {
    facts.innerHTML = D.about.facts.map(f =>
      `<li><span class="k">${f.k}</span><span class="v">${f.v}</span></li>`).join('');
  }

  // skills chips
  const skills = document.querySelector('[data-region="skills"]');
  if (skills && D.skills?.length) {
    skills.innerHTML = D.skills.map((s, i) =>
      `<span class="chip ${i % 4 === 0 ? 'chip--accent' : ''}">${s}</span>`).join('');
  }

  // projects
  const projects = document.querySelector('[data-region="projects"]');
  if (projects && D.projects?.length) {
    projects.innerHTML = D.projects.map(p => `
      <a class="card" ${p.url ? `href="${p.url}" target="_blank" rel="noopener"` : 'href="#"'}>
        <div class="card__title">${p.title}</div>
        <div class="card__desc">${p.desc}</div>
        <div class="card__tags">${(p.tags || []).map(t => `<span>${t}</span>`).join('')}</div>
        ${p.url ? '<div class="card__link">ҮЗЭХ →</div>' : ''}
      </a>`).join('');
  }

  // contacts
  const contacts = document.querySelector('[data-region="contacts"]');
  if (contacts && D.contacts?.length) {
    contacts.innerHTML = D.contacts.map((c, i) =>
      `<a class="btn ${i === 0 ? 'btn--primary' : 'btn--ghost'}" href="${c.url}" ${c.url.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${c.label}</a>`).join('');
  }
})();

/* ---------- 3. REVEAL ON SCROLL ---------- */
(function reveal() {
  document.querySelectorAll('.section').forEach(s => s.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
