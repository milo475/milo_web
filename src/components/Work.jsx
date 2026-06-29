export default function Work({ projects }) {
  return (
    <section className="section work" id="work">
      <p className="eyebrow">АЖИЛ</p>
      <h2 className="heading">Сонгомол төслүүд</h2>
      <div className="cards">
        {(projects ?? []).map((p, i) => {
          const linkProps = p.url
            ? { href: p.url, target: '_blank', rel: 'noopener' }
            : { href: '#' };
          return (
            <a key={i} className="card" {...linkProps}>
              <div className="card__title">{p.title}</div>
              <div className="card__desc">{p.desc}</div>
              <div className="card__tags">
                {(p.tags ?? []).map((t, j) => (
                  <span key={j}>{t}</span>
                ))}
              </div>
              {p.url && <div className="card__link">ҮЗЭХ →</div>}
            </a>
          );
        })}
      </div>
    </section>
  );
}
