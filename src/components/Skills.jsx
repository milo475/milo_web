export default function Skills({ skills }) {
  return (
    <section className="section skills" id="skills">
      <p className="eyebrow">УР ЧАДВАР</p>
      <h2 className="heading">Юу хийж чаддаг вэ</h2>
      <div className="chips">
        {(skills ?? []).map((s, i) => (
          <span key={i} className={`chip ${i % 4 === 0 ? 'chip--accent' : ''}`}>
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}
