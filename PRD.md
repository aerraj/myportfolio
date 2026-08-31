PRD — myportfolio
Rishabh Raj · portfolio rebuild Owner: Rishabh Raj (GitHub aerraj) · Status: Draft v1 · Target: personal site replacing the old shadcn template


1. Summary
Rebuild Rishabh's portfolio from scratch as a new, separate codebase so it reads as the site of someone headed for an AI Research Scientist or Quant Researcher seat — not a generic dev template. The old site (github.com/aerraj/Portfolio, a shadcn-portfolio Next.js template) is left completely untouched; the new site lives in a fresh repo, myportfolio, seeded as a copy of the old one and then rebuilt.

The site should feel engineered and research-grade and lean on motion as a first-class material — Framer Motion, GSAP, and anime.js — with visual direction drawn from originkit.dev, lightswind.com, and particles.casberry.in.

Two weightings for scoring/effort:

Bucket
Weight
What it covers
Core rebuild
90%
New myportfolio repo, positioning, real content, motion stack, design quality, responsiveness, deploy
Added feature
10%
particles.casberry.in "angel descending from heaven" effect over a starry dark-blue theme, threaded through the design language



2. Goals & non-goals
Goals

A distinctive, memorable single-page (or few-page) portfolio that positions Rishabh for AI-research / quant-research roles/deep tech founder engineering roles
Every project shown maps to a real GitHub repo or documented piece of work — no invented work.
Motion feels intentional and orchestrated, not the templated "fade-and-slide-up on every card" default.
Ships to production (Vercel), fully responsive, accessible, and fast.

Non-goals

Do not modify or delete aerraj/Portfolio.
No CMS, no blog engine, no auth. Content lives in typed config files.
Not a design-system project; it's one site with one strong point of view.


3. Constraints (hard requirements from the brief)
New repo named myportfolio, seeded by copying the existing aerraj/Portfolio code, then rebuilt. The original repo must remain unchanged.
Motion libraries Framer Motion, GSAP, and anime.js are all used, each where it's the right tool (see §7).
Design references to draw from: originkit.dev, lightswind.com, particles.casberry.in.
Positioning target: AI Research Scientist / Quant Researcher.
Content sourced from Rishabh's GitHub, résumé, and LinkedIn achievements.
Deliver a PRD alongside (this document).


4. Audience & positioning
Primary readers: research hiring managers, quant desks, and strong engineering teams. Secondary: recruiters skimming in 20 seconds.

Positioning line: "Machine learning, markets, and the systems between." The site should make one claim credibly — an engineer reaching for research — and back it with work that spans (a) reproducing papers into working instruments, (b) quantitative modelling, and (c) systems that actually run.


5. Information architecture
Single long page with anchored sections; a sticky minimal header.

┌ Hero            — name, positioning, live signature visual (see §8)

├ 01 Selected work — 3–4 featured projects, GSAP scroll reveals

├ 02 How I work    — Research / Quant / Systems capability triad

├ 03 Building      — secondary projects grid (rest of the repos)

├ 04 About         — timeline (education, NorthRock, HPCL, NIT Delhi) + aim

└ 05 Contact       — GitHub / LinkedIn / portfolio / email

Header nav: Work · Research · Building · About · Contact + GitHub link.


6. Content (real, sourced)
All entries below are grounded in Rishabh's actual repos/résumé. Copy is placeholder-quality and should be tightened, but the facts are real.
6.1 Featured work (Selected work — §01)
Project
Source
One-liner
Track
Motion-Amplified Condition Monitoring
aerraj/dwt-ann-mav + confirmation project
Deep-learning video motion magnification (ECCV'18) for fault diagnosis on 51 induction motors at an LPG bottling plant
Research
Regime-Aware Long/Short Framework
NorthRock Capital internship (résumé)
PC1 macro-regime classification + GMM transition detection + OU-fit spreads feeding a JPM style-factor equity L/S backtest
Quant
Agriproplus
Github


System









6.2 Secondary work (Building — §03)
MediKart — aerraj/MediKart — MERN healthcare/pharmacy delivery platform (JWT, Stripe, Context cart), on Vercel.
Pacman 4D — aerraj/pacman4d — quantum remake where ghosts hold four superposed states.
Plus a curated pull from GitHub as space allows (e.g. competitive-programming, TensorTonic solutions, MiniServe/LLM-serving experiments) — featured repos only, non-forks preferred, so the grid reads as signal not archive.
6.3 About — timeline
July 2025 → now — MSc Financial Engineering, WorldQuant University (Financial Data · Statistics · Econometrics).
Jan2025 -June 2025— Quant Research Intern, NorthRock Capital (regime-aware equity L/S).
2025 September → now — Operations Officer, HPCL Jamshedpur (safety, systems, digital-twin work).
→ 2021- 2025 — B.Tech Electrical & Electronics, NIT Delhi.
6.4 Links
GitHub github.com/aerraj · LinkedIn in/aerraj · Portfolio rrajportfolio-aerrajs-projects.vercel.app · email.
Codeforces https://codeforces.com/profile/aerraj
Codechef: https://www.codechef.com/users/ae_rraj
Leetcode: https://leetcode.com/u/aerraj/

Action for Rishabh: confirm 2–3 headline LinkedIn achievements/metrics to feature verbatim, and provide a canonical contact email.


7. Tech stack & motion allocation
Framework: Next.js (App Router) + TypeScript + Tailwind CSS. (Seeded from the old repo, then stripped.)
Deploy: Vercel.
Content: typed config files (content/*.ts) — no CMS.

Motion — each library used where it's strongest (brief requirement):

Library
Used for
Framer Motion
React-component entrances/exits, headline mask reveals, layout transitions, useReducedMotion gating
GSAP (+ ScrollTrigger)
Scroll-driven sequences: pinned/staggered project rows, the section-to-section descent choreography
anime.js
Fine-grained timeline bursts: capability-card staggers, numeric/readout counters, SVG stroke draws
Lenis (optional)
Smooth scroll to make GSAP triggers feel weighted


Reference libraries originkit.dev and lightswind.com inform component patterns and polish (buttons, marquees, reveal primitives, gradient/particle treatments) — adopt patterns, keep one coherent identity rather than a kit collage.


8. Design language
Design lead brief: give this site a point of view that is not mistaken for a template. Avoid the current generative-design tells (cream + terracotta, all-caps eyebrows, identical rounded SaaS cards, → appended to every link).

Theme — starry dark blue "night sky."

Palette: void #070B14 (deep night-sky navy base) → ink #0B1220 → panel #111A2C; hairlines #1E293F; text bone #E9E4D6, muted #8792A8; accents sodium #E4A245 (warm gold/star) and cobalt #6E8FEA (cool blue), used sparingly. A pale-gold "glory" light (#F4E4BC) glows high in the frame.
Type: display sans (tight, engineered — e.g. Archivo) + serif body (paper/research feel — e.g. Newsreader) + monospace for data readouts only. One display + one body, clearly distinct.
Structure: numbered sections (01–05) — legitimate here because it is a sequence. Hairline dividers, generous negative space, left-aligned editorial layout.
Signature element (spend boldness here, keep the rest quiet): a live hero field whose particles are driven by an Ornstein–Uhlenbeck ensemble — the same mean-reversion process from the NorthRock work — with a small live readout (dispersion σ, shock half-life, regime). The math is the visual language; not decorative particles. Everything else stays disciplined.


9. Added feature (10% weight) — "angel descending from heaven" over starry dark-blue
A distinct, higher-effort visual layer built on particles.casberry.in, threaded into the design language rather than bolted on.

What casberry actually is (verified): a Three.js/WebGL swarm simulator that runs a user-authored per-particle function over 20,000+ particles. API surface per particle: i, count, target (write-only THREE.Vector3), color (write-only THREE.Color), time (float), full THREE; helpers addControl, setInfo, annotate; strict no-GC / no-branching / finite-values rules; exportable as Vanilla JS / React / Three.js.

How we use it: author a custom formation in that exact API and export the React/Three.js build to run as the site's living background (not an iframe to the tool).

The effect — descent as the whole design grammar:

Shaft of light from above — a soft volumetric light column falls from the top of every section (backdrop gradient + godrays); content reads as lit from heaven, darkening toward the ground.
Descent as motion direction — all reveals arrive from above, drifting down and settling (ease-out, slight overshoot). One consistent direction = the "descent."
The swarm is the descent — casberry particles stream down from the top like falling light/feathers and gather into a soft luminous wing/halo silhouette that slowly breathes and re-forms — an angel continually descending. Colored in the starry-navy → warm-gold palette; slow rotation; addControl sliders for descent speed and glory intensity.
Palette shift — pale-gold glory high in the frame, deep navy below: heaven above, ground beneath.

Acceptance for the added feature:

Custom casberry formation authored to spec, exported to React/Three.js, running as background at 60fps on a modern laptop with a hard particle-count fallback for mobile/low-power.
Honors prefers-reduced-motion (renders a single calm static frame, no continuous animation).
Never competes with text legibility — the swarm sits behind a readable content layer.


10. Functional requirements
FR1 New repo myportfolio, seeded from a copy of aerraj/Portfolio; original repo unmodified.
FR2 Sections per §5, all content per §6 (real sources only).
FR3 Framer Motion + GSAP + anime.js all present and each doing real work (§7).
FR4 Starry dark-blue theme + OU signature hero (§8).
FR5 particles.casberry.in "angel descending" layer (§9).
FR6 Responsive to 360px; sticky nav; smooth in-page anchoring.
FR7 Deployed to Vercel with correct metadata/OG tags.
11. Non-functional requirements
Performance: Lighthouse ≥ 90 performance on desktop; heavy WebGL lazy-loaded and capped on mobile; fonts subset; images optimized.
Accessibility: visible keyboard focus, prefers-reduced-motion respected everywhere, sufficient contrast on the dark theme, semantic landmarks, aria-hidden on decorative canvases.
SEO: title/description/OG/Twitter cards, sensible headings, indexable.
Browser support: current Chrome/Safari/Firefox/Edge; graceful degradation of WebGL.


12. Milestones
M0 — Scaffold: copy Portfolio → myportfolio, strip template, set tokens/fonts, config content files.
M1 — Content + structure: all sections statically laid out with real content, responsive, no motion.
M2 — Core motion: Framer Motion reveals, GSAP scroll choreography, anime.js accents; OU hero.
M3 — Added feature: casberry "angel descending" swarm + descent light system integrated.
M4 — Polish & ship: accessibility pass, reduced-motion, performance budget, Vercel deploy, OG.


13. Acceptance criteria (definition of done)
aerraj/Portfolio is byte-for-byte unchanged; new work lives only in myportfolio.
Every displayed project links to a real repo or documents real work.
Framer Motion, GSAP, and anime.js each present and doing distinct work.
Site reads clearly as AI-research / quant-research positioned within 20 seconds.
Starry dark-blue theme with the OU signature hero present.
Casberry "angel descending" effect present, performant, and reduced-motion-safe (added feature).
Fully responsive, keyboard-accessible, Lighthouse perf ≥ 90 desktop, deployed on Vercel.


14. Open questions (need Rishabh's input)
Canonical contact email and the 2–3 LinkedIn achievements/metrics to feature verbatim.
Final domain (custom vs *.vercel.app).
Which secondary repos make the "Building" grid — confirm the shortlist so it reads as signal.
Any role-region tailoring (a TW/SG/IN emphasis line) you want surfaced on the hero or contact.
