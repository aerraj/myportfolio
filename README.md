# myportfolio

Rishabh Raj's research-led portfolio: machine learning, markets, and the systems between.

The experience is built as a single editorial narrative with a live WebGL particle field. The hero uses a GPU-side spectral approximation of an Ornstein-Uhlenbeck ensemble to form a descending halo and wings. Framer Motion handles the opening narrative, GSAP choreographs scroll, and anime.js drives fine-grained section bursts.

## Run locally

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run start
```

Content lives in `content/portfolio.ts`. The full product brief is preserved in `PRD.md`.
