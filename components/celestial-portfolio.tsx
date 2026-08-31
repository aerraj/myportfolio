'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Download, Github, Linkedin, Mail } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, stagger } from 'animejs';
import { capabilities, featuredProjects, proof, secondaryProjects, timeline } from '@/content/portfolio';

const CelestialParticles = dynamic(() => import('./celestial-particles'), { ssr: false });

function SectionHead({ number, title, note }: { number: string; title: string; note: string }) {
  return <header className="section-head"><span>{number}</span><h2>{title}</h2><p>{note}</p></header>;
}

export default function CelestialPortfolio() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [descentSpeed, setDescentSpeed] = useState(1);
  const [gloryIntensity, setGloryIntensity] = useState(1);
  const reveal: Variants = {
    hidden: { opacity: 1, y: reduced ? 0 : -26 },
    visible: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: reduced ? 0 : 1.1, delay, ease: [0.16, 1, 0.3, 1] as const } })
  };

  useEffect(() => {
    if (!rootRef.current || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.project-row').forEach((row) => {
        gsap.fromTo(row, { y: -72, opacity: 0 }, { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out', scrollTrigger: { trigger: row, start: 'top 84%' } });
      });
      gsap.utils.toArray<HTMLElement>('.descent-section').forEach((section) => {
        gsap.fromTo(section.querySelector('.light-shaft'), { opacity: 0, scaleY: .35 }, { opacity: 1, scaleY: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'center center', scrub: 1 } });
      });
    }, rootRef);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const targets = entry.target.classList.contains('capability-grid')
          ? entry.target.querySelectorAll('.capability')
          : entry.target.querySelectorAll('.proof-value');
        animate(targets, { opacity: [0, 1], translateY: [-28, 0], delay: stagger(110), duration: 850, ease: 'outExpo' });
        observer.unobserve(entry.target);
      });
    }, { threshold: .2 });
    rootRef.current.querySelectorAll('.capability-grid,.proof-strip').forEach((node) => observer.observe(node));
    return () => { observer.disconnect(); context.revert(); };
  }, [reduced]);

  return (
    <div className="portfolio-shell" ref={rootRef}>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Rishabh Raj, home">RR<span>∴</span></a>
        <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#research">Research</a><a href="#building">Building</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
        <a className="header-status" href="https://github.com/aerraj" target="_blank" rel="noreferrer"><span aria-hidden="true" /> GitHub</a>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="glory" aria-hidden="true" style={{ opacity: Math.min(1, gloryIntensity) }} /><CelestialParticles descentSpeed={descentSpeed} gloryIntensity={gloryIntensity} /><div className="hero-stars" aria-hidden="true" />
          <div className="hero-copy">
            <motion.p custom={0.35} initial="hidden" animate="visible" variants={reveal} className="hero-kicker">Rishabh Raj <span>/</span> Engineer reaching for research</motion.p>
            <motion.h1 custom={0.5} initial="hidden" animate="visible" variants={reveal} id="hero-title">Machine learning, markets,<br />and the systems between.</motion.h1>
            <motion.div custom={0.68} initial="hidden" animate="visible" variants={reveal} className="hero-bottom">
              <p>I turn research ideas into instruments that survive contact with data, hardware, and the real world.</p>
              <div className="hero-instrument">
                <div className="hero-readout" aria-label="Ornstein-Uhlenbeck particle readout"><span><b>σ</b> 0.184</span><span><b>t½</b> 4.20s</span><span><i /> MEAN REVERTING</span></div>
                <details className="swarm-controls"><summary>Tune field</summary><label>Descent <input aria-label="Descent speed" type="range" min="0.55" max="1.6" step="0.05" value={descentSpeed} onChange={(event) => setDescentSpeed(Number(event.target.value))} /></label><label>Glory <input aria-label="Glory intensity" type="range" min="0.45" max="1.45" step="0.05" value={gloryIntensity} onChange={(event) => setGloryIntensity(Number(event.target.value))} /></label></details>
              </div>
            </motion.div>
          </div>
          <p className="scroll-cue"><span /> Scroll to observe</p>
        </section>

        <section className="descent-section work-section" id="work">
          <div className="light-shaft" aria-hidden="true" />
          <div className="section-inner">
            <SectionHead number="01" title="Selected work" note="Three systems. One habit: make the idea executable." />
            <div className="project-list">
              {featuredProjects.map((project) => (
                <article className="project-row" key={project.title}>
                  <div className="project-index"><span>{project.index}</span><em>{project.track}</em></div>
                  <div className="project-main">
                    <h3>{project.title}</h3><p className="project-summary">{project.summary}</p><p className="project-detail">{project.detail}</p>
                    <ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div className="project-side"><code>{project.signal}</code><a href={project.href} target={project.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{project.cta}<ArrowUpRight size={15} /></a></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="descent-section capability-section" id="research">
          <div className="light-shaft" aria-hidden="true" />
          <div className="section-inner">
            <SectionHead number="02" title="How I work" note="Research judgment with an engineer’s intolerance for hand-waving." />
            <div className="capability-grid">
              {capabilities.map((item) => <article className="capability" key={item.id}><span>{item.id}</span><p className="cap-theorem">{item.theorem}</p><h3>{item.title}</h3><p>{item.copy}</p><div className="cap-line" /></article>)}
            </div>
            <div className="method-note"><span>Working principle</span><blockquote>“A model is not finished when it predicts. It is finished when its assumptions, failure modes, and route to reality are visible.”</blockquote></div>
          </div>
        </section>

        <section className="descent-section building-section" id="building">
          <div className="light-shaft" aria-hidden="true" />
          <div className="section-inner">
            <SectionHead number="03" title="Building" note="Proof that the range is real, not rhetorical." />
            <div className="building-grid">
              {secondaryProjects.map((project, index) => <a className="build-card" href={project.href} target="_blank" rel="noreferrer" key={project.title}><span>0{index + 1}</span><code>{project.lang}</code><h3>{project.title}</h3><p>{project.note}</p><ArrowUpRight aria-hidden="true" /></a>)}
            </div>
          </div>
        </section>

        <section className="descent-section about-section" id="about">
          <div className="light-shaft" aria-hidden="true" />
          <div className="section-inner">
            <SectionHead number="04" title="Trajectory" note="From physical systems to financial ones—and toward research." />
            <div className="about-layout">
              <div className="about-statement"><p>I am drawn to problems where the signal is faint, the system is consequential, and the answer has to work outside a notebook.</p><p>My route is deliberately non-linear: electrical engineering, competitive programming, production operations, quantitative development, and financial engineering. The destination is AI research or quantitative research with real technical depth.</p><a href="/resume.pdf" target="_blank">Download résumé <Download size={16} /></a></div>
              <ol className="timeline">{timeline.map((item) => <li key={`${item.date}-${item.role}`}><time>{item.date}</time><div><h3>{item.role}</h3><span>{item.place}</span><p>{item.copy}</p></div></li>)}</ol>
            </div>
            <div className="proof-strip">{proof.map((item) => <div key={item.label}><strong className="proof-value">{item.value}</strong><span>{item.label}</span></div>)}</div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-stars" aria-hidden="true" />
          <div className="section-inner">
            <SectionHead number="05" title="Contact" note="For research, systems, and difficult questions worth staying up for." />
            <p className="contact-line">Let’s find the signal.</p>
            <a className="email-link" href="mailto:rraj09102002@gmail.com">rraj09102002@gmail.com <ArrowUpRight /></a>
            <div className="contact-links">
              <a href="https://github.com/aerraj" target="_blank" rel="noreferrer"><Github /> GitHub</a>
              <a href="https://linkedin.com/in/aerraj" target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a>
              <a href="mailto:rraj09102002@gmail.com"><Mail /> Email</a>
              <a href="#top"><ArrowDown className="back-arrow" /> Back to the light</a>
            </div>
            <footer><span>Rishabh Raj · 2026</span><span>New Delhi / Jamshedpur · India</span><span>Built from first principles</span></footer>
          </div>
        </section>
      </main>
    </div>
  );
}
