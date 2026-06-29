export default function Hero({ hero }) {
  return (
    <section className="hero section">
      <div className="hero__text">
        <p className="eyebrow">{hero?.eyebrow}</p>
        <h1
          className="display"
          dangerouslySetInnerHTML={{ __html: hero?.title ?? '' }}
        />
        <p className="body">{hero?.subtitle}</p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#work">АЖЛУУДЫГ ҮЗЭХ</a>
          <a className="btn btn--ghost" href="#contact">ХОЛБОО БАРИХ</a>
        </div>
      </div>
    </section>
  );
}
