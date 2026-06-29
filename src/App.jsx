import { useEffect } from 'react';
import { PORTFOLIO_DATA as D } from './data.js';
import useReveal from './hooks/useReveal.js';
import Constellation from './components/Constellation.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Work from './components/Work.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  // sync document <title> / meta description from data
  useEffect(() => {
    if (D.meta?.title) document.title = D.meta.title;
    if (D.meta?.desc) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', D.meta.desc);
    }
  }, []);

  // reveal-on-scroll after content mounts
  useReveal();

  return (
    <>
      <Constellation />
      <Nav brand={D.brand} />
      <main id="top">
        <Hero hero={D.hero} />
        <About about={D.about} />
        <Skills skills={D.skills} />
        <Work projects={D.projects} />
        <Contact contact={D.contact} contacts={D.contacts} />
      </main>
      <Footer footer={D.footer} />
    </>
  );
}
