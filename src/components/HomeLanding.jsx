/* HomeLanding — Kali Linux сургалтын вэбийн нүүр хуудас */
import ScreenTime from './ScreenTime.jsx';

const COURSE_CARDS = [
  { id: 'linux', name: 'Linux үндэс', desc: 'Тэг мэдлэгээс эхлэн терминал, файл, эрх, сүлжээ, bash скрипт.', tags: ['Анхан', 'Дунд', 'Ахлах'] },
  { id: 'nmap', name: 'nmap', desc: 'Сүлжээ сканнердах, нээлттэй порт, үйлчилгээ, OS илрүүлэх.', tags: ['90 хичээл'] },
  { id: 'wireshark', name: 'wireshark', desc: 'Сүлжээний трафик барьж, протокол бүрийг нарийн шинжлэх.', tags: ['90 хичээл'] },
  { id: 'metasploit', name: 'metasploit', desc: 'Нэвтрэлтийн тест — exploit, payload, post-exploitation.', tags: ['90 хичээл'] },
  { id: 'john', name: 'john / hashcat', desc: 'Нууц үгийн бат бөхийг шалгах (audit), hash таалт.', tags: ['90 хичээл'] },
];

const FEATURES = [
  { icon: '🖥️', title: 'Бодит виртуал терминал', text: 'Командууд жинхэнээсээ ажиллана — ls, nmap, grep, python3 гээд олон арван команд вэб дотор шууд.' },
  { icon: '📚', title: '450+ түвшинчилсэн хичээл', text: 'Курс бүр Анхан · Дунд · Ахлах гэсэн 3 түвшинд, дугаарлагдсан хичээлүүдтэй.' },
  { icon: '🎯', title: 'Сорил ба баяр ёслол', text: 'Түвшин дуусахад терминал дээр сорил өг. Бүгдийг зөв хийвэл confetti!' },
  { icon: '📈', title: 'Явц хадгалах', text: 'Нэвтэрвэл дуусгасан хичээл, давсан сорил хадгалагдаж, үргэлжлүүлэх боломжтой.' },
];

export default function HomeLanding({ onOpenLessons, onOpenTerminal, user }) {
  return (
    <>
      {/* Hero */}
      <section className="hero section">
        <div className="hero__text">
          <p className="eyebrow eyebrow--kali">КИБЕР АЮУЛГҮЙ БАЙДЛЫН СУРГАЛТ</p>
          <h1 className="display">
            Kali Linux-ийг<br />эхнээс нь сур.
          </h1>
          <p className="body">
            Линукс огт мэдэхгүй хүнээс эхлээд нэвтрэлтийн тест хүртэл — бодит
            виртуал терминал дээр дадлага хийж, монгол хэлээр алхам алхмаар суралц.
          </p>
          <div className="hero__actions">
            <button className="btn btn--primary" onClick={() => onOpenLessons()}>
              СУРГАЛТ ЭХЛЭХ
            </button>
            <button className="btn btn--kali" onClick={() => onOpenTerminal()}>
              <span className="btn--kali__icon" aria-hidden="true">&gt;_</span>
              ТЕРМИНАЛ ТУРШИХ
            </button>
          </div>
        </div>
      </section>

      {/* Статистик */}
      <section className="section landing-stats">
        <div className="stat"><span className="stat__n">5</span><span className="stat__l">Курс</span></div>
        <div className="stat"><span className="stat__n">450+</span><span className="stat__l">Хичээл</span></div>
        <div className="stat"><span className="stat__n">15</span><span className="stat__l">Сорил</span></div>
        <div className="stat"><span className="stat__n">∞</span><span className="stat__l">Терминал дадлага</span></div>
      </section>

      {/* Нэвтэрсэн хэрэглэгчийн сурсан цаг (screen time) */}
      {user && <ScreenTime embedded />}

      {/* Курсууд */}
      <section className="section" id="courses">
        <p className="eyebrow">КУРСУУД</p>
        <h2 className="heading">Юу сурах вэ</h2>
        <div className="cards">
          {COURSE_CARDS.map((c) => (
            <button key={c.id} className="card card--btn" onClick={() => onOpenLessons()}>
              <div className="card__title">{c.name}</div>
              <div className="card__desc">{c.desc}</div>
              <div className="card__tags">
                {c.tags.map((t, j) => (
                  <span key={j}>{t}</span>
                ))}
              </div>
              <div className="card__link">ЭХЛЭХ →</div>
            </button>
          ))}
        </div>
      </section>

      {/* Онцлог */}
      <section className="section" id="features">
        <p className="eyebrow">ОНЦЛОГ</p>
        <h2 className="heading">Яагаад энд сурах вэ</h2>
        <div className="feature-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature">
              <div className="feature__icon" aria-hidden="true">{f.icon}</div>
              <div className="feature__title">{f.title}</div>
              <div className="feature__text">{f.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ёс зүй */}
      <section className="section" id="ethics">
        <div className="ethics">
          <p className="eyebrow eyebrow--plum">ЁС ЗҮЙ</p>
          <h2 className="heading">Хариуцлагатай суралц</h2>
          <p className="body body--measure">
            Энд заасан хэрэгслүүд хүчирхэг. Зөвхөн өөрийн эсвэл бичгээр зөвшөөрөл
            авсан систем дээр л дадлага хий. Бусдын системд зөвшөөрөлгүй халдах нь
            хууль зөрчсөн гэмт хэрэг. Бид аюулгүй виртуал орчинд сурахыг дэмждэг.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section landing-cta-wrap">
        <div className="landing-cta">
          <h2 className="heading">Өнөөдөр эхэл</h2>
          <p className="body body--measure">
            Эхний хичээл хүлээж байна. Терминалаа нээгээд анхны командаа бичээрэй.
          </p>
          <div className="hero__actions">
            <button className="btn btn--primary" onClick={() => onOpenLessons()}>
              СУРГАЛТ ЭХЛЭХ
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
