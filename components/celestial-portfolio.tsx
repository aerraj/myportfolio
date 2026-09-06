'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Download, Github, Linkedin, Mail } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { capabilities, featuredProjects, proof, secondaryProjects, timeline } from '@/content/portfolio';
import QuantTelemetry from './quant-telemetry';
import GalaxyField from './galaxy-field';
import { BuildArtifact, CapabilityArtifact, ProjectEvidence, SignalBlueprintTransition } from './evidence-scenes';

const CelestialParticles = dynamic(() => import('./celestial-particles'), { ssr: false });

function SectionHead({ number, title, note }: { number: string; title: string; note: string }) {
  return <header className="section-head"><span>{number}</span><h2>{title}</h2><p>{note}</p></header>;
}

function trajectoryMaterial(role: string) {
  if (role.includes('Electrical')) return 'circuit';
  if (role.includes('Quantitative')) return 'market';
  if (role.includes('Financial')) return 'research';
  return 'industrial';
}

const trajectory = [...timeline].reverse();

export default function CelestialPortfolio() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [descentSpeed, setDescentSpeed] = useState(1);
  const [gloryIntensity, setGloryIntensity] = useState(1);
  const reveal: Variants = {
    hidden: { opacity: 1, y: reduced ? 0 : 18 },
    visible: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: reduced ? 0 : 1.1, delay, ease: [0.16, 1, 0.3, 1] as const } })
  };

  useEffect(() => {
    if (!rootRef.current || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const motionMedia = gsap.matchMedia();
    const context = gsap.context(() => {
      // Let the descending angel slip into the persistent galaxy as the reader scrolls.
      gsap.to('.angel-stage', {
        yPercent: -24, xPercent: 5, scale: 0.94, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '70% top', scrub: 1.25 }
      });
      gsap.to('.glory', {
        autoAlpha: 0, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '65% top', scrub: 1.25 }
      });
      gsap.utils.toArray<HTMLElement>('.section-head').forEach((head) => {
        const pieces = head.querySelectorAll(':scope > *');
        gsap.fromTo(pieces,
          { y: 24, opacity: .3 },
          { y: 0, opacity: 1, duration: 1.15, stagger: 0.11, ease: 'power3.out', scrollTrigger: { trigger: head, start: 'top 82%' } }
        );
      });
      gsap.utils.toArray<HTMLElement>('.project-row').forEach((row) => {
        const pieces = row.querySelectorAll('.project-index,.project-main > *,.project-side > *,.project-evidence');
        const timeline = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 83%' } });
        timeline
          .fromTo(row, { y: 32, opacity: .18 }, { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out' })
          .fromTo(pieces, { y: 28, opacity: .25 }, { y: 0, opacity: 1, duration: .72, stagger: .055, ease: 'power2.out' }, '-=.7');
        const index = row.querySelector('.project-index span');
        if (index) gsap.to(index, { y: 22, ease: 'none', scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
      });
      gsap.utils.toArray<HTMLElement>('.descent-section').forEach((section) => {
        const shaft = section.querySelector('.light-shaft');
        if (shaft) gsap.fromTo(shaft, { opacity: 0, scaleY: .22 }, { opacity: .82, scaleY: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'center 38%', scrub: 1.2 } });
      });
      gsap.fromTo('.hero-signal-path', { strokeDashoffset: 1400 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '55% center', end: 'bottom top', scrub: 1 } });
      const blueprintTimeline = gsap.timeline({ scrollTrigger: { trigger: '.signal-blueprint', start: 'top 82%', end: 'bottom 38%', scrub: 1 } });
      blueprintTimeline
        .fromTo('.blueprint-wave', { strokeDashoffset: 900 }, { strokeDashoffset: 0, ease: 'none' }, 0)
        .fromTo('.measured-features span', { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: .09, ease: 'power2.out' }, .12)
        .fromTo('.blueprint-line', { strokeDashoffset: 1000 }, { strokeDashoffset: 0, ease: 'none' }, .28)
        .fromTo('.blueprint-columns i', { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, stagger: .08, ease: 'power2.out' }, .48)
        .fromTo('.signal-blueprint p', { y: 30, opacity: .2 }, { y: 0, opacity: 1, ease: 'power2.out' }, .62);

      const dwtTimeline = gsap.timeline({ scrollTrigger: { trigger: '.project-a', start: 'top 70%' } });
      dwtTimeline.fromTo('.project-a .raw-wave', { strokeDashoffset: 700 }, { strokeDashoffset: 0, duration: .75, ease: 'power2.out' })
        .fromTo('.project-a .wavelet-stack i', { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: .48, stagger: .055, ease: 'power2.out' }, '-=.3')
        .fromTo('.project-a .neural-collapse span', { scale: .5, opacity: 0 }, { scale: 1, opacity: 1, duration: .34, stagger: .04, ease: 'back.out(1.4)' }, '-=.12')
        .fromTo('.project-a .verification-stamp', { x: 22, opacity: 0 }, { x: 0, opacity: 1, duration: .45 }, '-=.05');
      const portfolioTimeline = gsap.timeline({ scrollTrigger: { trigger: '.project-b', start: 'top 70%' } });
      portfolioTimeline.fromTo('.project-b .instrument', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, transformOrigin: 'center', duration: .32, stagger: .018 })
        .fromTo('.project-b .covariance-ellipse,.project-b .efficient-frontier,.project-b .constraint-line', { strokeDashoffset: 900 }, { strokeDashoffset: 0, duration: .85, stagger: .12, ease: 'power2.out' }, '-=.15')
        .fromTo('.project-b .selected', { scale: .4 }, { scale: 1.5, duration: .38, stagger: .04, yoyo: true, repeat: 1 }, '-=.22');
      const agriTimeline = gsap.timeline({ scrollTrigger: { trigger: '.project-c', start: 'top 70%' } });
      agriTimeline.fromTo('.project-c .agri-inputs span', { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: .4, stagger: .07 })
        .fromTo('.project-c .decision-tree i', { scaleX: 0 }, { scaleX: 1, duration: .38, stagger: .06, transformOrigin: 'left' }, '-=.08')
        .fromTo('.project-c .recommendation-card', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .48 }, '-=.05')
        .fromTo('.project-c .edge-condition', { opacity: 0 }, { opacity: 1, duration: .4 });

      motionMedia.add('(min-width: 981px)', () => {
        const stage = rootRef.current?.querySelector<HTMLElement>('.capability-stage');
        const track = stage?.querySelector<HTMLElement>('.capability-track');
        if (!stage || !track) return;
        gsap.to(track, { x: () => Math.min(0, stage.clientWidth - track.scrollWidth), ease: 'none', scrollTrigger: { trigger: stage, start: 'top 14%', end: 'bottom 86%', scrub: 1.1, invalidateOnRefresh: true } });
      });
      gsap.fromTo('.capability', { y: 24, opacity: .3 }, { y: 0, opacity: 1, duration: .85, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.capability-track', start: 'top 88%' } });
      gsap.fromTo('.building-grid .build-card', { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.building-grid', start: 'top 82%' } });
      gsap.fromTo('.method-note', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1.15, ease: 'power3.out', scrollTrigger: { trigger: '.method-note', start: 'top 84%' } });
      gsap.fromTo('.about-statement', { y: 28, opacity: .2 }, { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out', scrollTrigger: { trigger: '.trajectory-layout', start: 'top 80%' } });
      gsap.fromTo('.route-line', { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: '.trajectory-route', start: 'top 78%', end: 'bottom 62%', scrub: 1 } });
      gsap.fromTo('.route-item,.route-future', { x: 42, opacity: .2 }, { x: 0, opacity: 1, duration: .8, stagger: .11, ease: 'power3.out', scrollTrigger: { trigger: '.trajectory-route', start: 'top 78%' } });
      gsap.fromTo('.achievement-band a', { x: 34, opacity: .18 }, { x: 0, opacity: 1, duration: .72, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: '.achievement-section', start: 'top 82%' } });
      gsap.fromTo('.contact-line,.email-link,.contact-links,footer', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.contact-line', start: 'top 84%' } });
    }, rootRef);

    return () => { motionMedia.revert(); context.revert(); };
  }, [reduced]);

  return (
    <div className="portfolio-shell" ref={rootRef}>
      <GalaxyField />
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Rishabh Raj, home">RR<span>∴</span></a>
        <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#research">Research</a><a href="#building">Building</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
        <a className="header-status" href="https://github.com/aerraj" target="_blank" rel="noreferrer"><span aria-hidden="true" /> GitHub</a>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="glory" aria-hidden="true" style={{ opacity: Math.min(1, gloryIntensity) }} /><div className="angel-stage" aria-hidden="true"><CelestialParticles descentSpeed={descentSpeed} gloryIntensity={gloryIntensity} /></div>
          <QuantTelemetry />
          <div className="hero-copy">
            <motion.p custom={0.15} initial="hidden" animate="visible" variants={reveal} className="hero-kicker">Rishabh Raj <span>/</span> Engineer reaching for research</motion.p>
            <motion.h1 custom={0.3} initial="hidden" animate="visible" variants={reveal} id="hero-title">Machine learning, markets,<br />and the systems between.</motion.h1>
            <motion.div custom={0.45} initial="hidden" animate="visible" variants={reveal} className="hero-bottom">
              <p>I turn research ideas into instruments that survive contact with data, hardware, and the real world.</p>
              <div className="hero-instrument">
                <div className="hero-readout" aria-label="Ornstein-Uhlenbeck particle readout"><span><b>σ</b> {(0.184 * gloryIntensity).toFixed(3)}</span><span><b>t½</b> {(4.2 / descentSpeed).toFixed(2)}s</span><span><i /> MEAN REVERTING</span></div>
                <details className="swarm-controls"><summary>Tune signal</summary><label>Damping <input aria-label="Particle-field damping" type="range" min="0.55" max="1.6" step="0.05" value={descentSpeed} onChange={(event) => setDescentSpeed(Number(event.target.value))} /></label><label>Signal <input aria-label="Signal-to-noise intensity" type="range" min="0.45" max="1.45" step="0.05" value={gloryIntensity} onChange={(event) => setGloryIntensity(Number(event.target.value))} /></label></details>
              </div>
            </motion.div>
          </div>
          <p className="scroll-cue"><span /> Scroll to observe</p>
          <svg className="hero-signal-edge" viewBox="0 0 1440 82" preserveAspectRatio="none" aria-hidden="true"><path className="hero-signal-path" d="M0 46 C65 42 74 23 132 49 S231 61 285 37 S387 20 439 48 S536 63 591 35 S691 19 748 45 S842 66 904 38 S1005 22 1062 47 S1164 61 1218 39 S1345 30 1440 43" /></svg>
        </section>

        <section className="descent-section work-section" id="work">
          <div className="light-shaft" aria-hidden="true" />
          <div className="section-inner">
            <SectionHead number="01" title="Selected work" note="Three systems. One habit: make the idea executable." />
            <div className="project-list">
              {featuredProjects.map((project) => (
                <article className={`project-row project-${project.index.toLowerCase()}`} key={project.title}>
                  <div className="project-index"><span>{project.index}</span><em>{project.track}</em></div>
                  <div className="project-main">
                    <h3>{project.title}</h3><p className="project-summary">{project.summary}</p><p className="project-detail">{project.detail}</p>
                    <ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div className="project-evidence"><ProjectEvidence project={project.index as 'A' | 'B' | 'C'} /></div>
                  <div className="project-side"><code>{project.signal}</code><a href={project.href} target={project.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{project.cta}<ArrowUpRight size={15} /></a></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SignalBlueprintTransition />

        <section className="descent-section capability-section" id="research">
          <div className="section-inner">
            <SectionHead number="02" title="How I work" note="Research judgment with an engineer’s intolerance for hand-waving." />
            <div className="capability-stage">
              <div className="capability-track">
                {capabilities.map((item) => <article className={`capability capability-${item.id}`} key={item.id}><span>{item.id}</span><p className="cap-theorem">{item.theorem}</p><h3>{item.title}</h3><CapabilityArtifact id={item.id} /><p>{item.copy}</p><div className="cap-line" /></article>)}
              </div>
            </div>
            <div className="method-note"><span>Working principle</span><blockquote>“A model is not finished when it predicts. It is finished when its assumptions, failure modes, and route to reality are visible.”</blockquote></div>
          </div>
        </section>

        <section className="descent-section building-section" id="building">
          <div className="section-inner">
            <SectionHead number="03" title="Building" note="Proof that the range is real, not rhetorical." />
            <div className="building-grid">
              {secondaryProjects.map((project, index) => <a className={`build-card build-${index + 1}`} href={project.href} target="_blank" rel="noreferrer" key={project.title}><span>0{index + 1}</span><code>{project.lang}</code><h3>{project.title}</h3><BuildArtifact title={project.title} /><p>{project.note}</p><ArrowUpRight aria-hidden="true" /></a>)}
            </div>
          </div>
        </section>

        <section className="descent-section about-section" id="about">
          <div className="section-inner">
            <SectionHead number="04" title="Trajectory" note="From physical systems to financial ones—and toward research." />
            <div className="trajectory-layout">
              <div className="about-statement"><p>I am drawn to problems where the signal is faint, the system is consequential, and the answer has to work outside a notebook.</p><p>My route is deliberately non-linear: electrical engineering, competitive programming, production operations, quantitative development, and financial engineering. The destination is AI research or quantitative research with real technical depth.</p><a href="/resume.pdf" target="_blank">Download résumé <Download size={16} /></a></div>
              <div className="route-track">
                <span className="route-line" aria-hidden="true" />
                <ol className="trajectory-route">
                  <li className={`route-item route-${trajectoryMaterial(trajectory[0].role)}`}><time>{trajectory[0].date}</time><div><h3>{trajectory[0].role}</h3><span>{trajectory[0].place}</span><p>{trajectory[0].copy}</p></div></li>
                  {trajectory.slice(1).map((item) => <li className={`route-item route-${trajectoryMaterial(item.role)}`} key={`${item.date}-${item.role}`}><time>{item.date}</time><div><h3>{item.role}</h3><span>{item.place}</span><p>{item.copy}</p></div></li>)}
                  <li className="route-future"><span>OPEN</span><strong>AI research · Quantitative research</strong></li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="achievement-section" aria-labelledby="achievement-title">
          <div className="achievement-inner">
            <header className="achievement-heading"><span>Evidence ledger</span><h2 id="achievement-title">Competition evidence</h2><p>Five independent records. Each opens its source.</p></header>
            <div className="achievement-scroll" tabIndex={0} aria-label="Competition achievements; scroll horizontally on smaller screens">
              <div className="achievement-band">
                {proof.map((item) => <a href={item.href} target="_blank" rel="noreferrer" key={item.label}><strong>{item.value}</strong><span>{item.label}</span><ArrowUpRight aria-hidden="true" /></a>)}
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-signal" aria-hidden="true"><i /><span /></div>
          <div className="section-inner">
            <SectionHead number="05" title="Contact" note="For research, systems, and difficult questions worth staying up for." />
            <p className="contact-line">Let’s find the signal.</p>
            <a className="email-link" href="mailto:rraj09102002@gmail.com">rraj09102002@gmail.com <ArrowUpRight /></a>
            <div className="contact-links">
              <a href="https://github.com/aerraj" target="_blank" rel="noreferrer"><Github /> GitHub</a>
              <a href="https://linkedin.com/in/aerraj" target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a>
              <a href="mailto:rraj09102002@gmail.com"><Mail /> Email</a>
              <a className="return-light" href="#top"><ArrowDown className="back-arrow" /> Back to the light</a>
            </div>
            <footer><span>Rishabh Raj · 2026</span><span>New Delhi / Jamshedpur · India</span><span>Built from first principles</span></footer>
          </div>
        </section>
      </main>
    </div>
  );
}
