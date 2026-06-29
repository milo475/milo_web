export default function About({ about }) {
  return (
    <section className="section about" id="about">
      <p className="eyebrow">ТАНИЛЦУУЛГА</p>
      <h2 className="heading">{about?.title}</h2>
      <p className="body body--measure">{about?.body}</p>
      <ul className="facts">
        {(about?.facts ?? []).map((f, i) => (
          <li key={i}>
            <span className="k">{f.k}</span>
            <span className="v">{f.v}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
