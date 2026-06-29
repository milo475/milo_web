export default function Contact({ contact, contacts }) {
  return (
    <section className="section contact" id="contact">
      <p className="eyebrow">ХОЛБОО БАРИХ</p>
      <h2 className="display display--sm">{contact?.title}</h2>
      <div className="contact__links">
        {(contacts ?? []).map((c, i) => {
          const external = c.url.startsWith('http');
          return (
            <a
              key={i}
              className={`btn ${i === 0 ? 'btn--primary' : 'btn--ghost'}`}
              href={c.url}
              {...(external ? { target: '_blank', rel: 'noopener' } : {})}
            >
              {c.label}
            </a>
          );
        })}
      </div>
    </section>
  );
}
