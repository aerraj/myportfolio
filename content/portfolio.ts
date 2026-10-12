export type FeaturedProject = {
  index: string;
  title: string;
  track: 'Research' | 'Quant' | 'Systems';
  summary: string;
  detail: string;
  stack: string[];
  href: string;
  cta: string;
  signal: string;
};

export const featuredProjects: FeaturedProject[] = [
  {
    index: 'A',
    title: 'DWT · ANN · MAV',
    track: 'Research',
    summary: 'A paper made executable: condition monitoring from signal to silicon.',
    detail: 'Nine-level Daubechies-44 feature extraction, ANN inference, fixed-point export, board-independent RTL, and MagNet motion amplification—held together by bit-accurate Python/Verilog verification.',
    stack: ['Python', 'PyTorch', 'SystemVerilog', 'Icarus Verilog'],
    href: 'https://github.com/aerraj/dwt-ann-mav',
    cta: 'Inspect the research system',
    signal: '9 → 32 → 64 → 128 → 64 → 32 → 1'
  },
  {
    index: 'B',
    title: 'PortOPT',
    track: 'Quant',
    summary: 'Macro regimes become a reproducible, constrained equity portfolio.',
    detail: 'A Euro-area long/short research pipeline across 36 EUR listings: delayed macro signals, walk-forward factor allocation, monthly optimization, transaction costs, tested exposure constraints, and an auditable PDF report. Historical backtests expose model limitations alongside results.',
    stack: ['Python', 'SciPy', 'Portfolio Optimization', 'FRED / ECB'],
    href: 'https://github.com/aerraj/PortOPT',
    cta: 'Inspect the research pipeline',
    signal: '36 listings · monthly rebalance'
  },
  {
    index: 'C',
    title: 'HFT Engine',
    track: 'Systems',
    summary: 'From market-data bytes to risk-checked orders in C++20.',
    detail: 'An ITCH-to-OUCH simulation engine with pooled FIFO order books, reference strategies, pending-exposure risk checks, deterministic replay, snapshot recovery, and asynchronous logging. Synthetic shared-runner benchmarks report 320 ns median tick-to-trade; this is a simulator, without live exchange connectivity.',
    stack: ['C++20', 'ITCH / OUCH', 'CMake', 'GoogleTest'],
    href: 'https://github.com/aerraj/hft-engine',
    cta: 'Inspect the engine and benchmarks',
    signal: '320 ns p50 · synthetic workload'
  }
];

export const capabilities = [
  {
    id: '01',
    title: 'Research',
    theorem: 'Paper → instrument',
    copy: 'Reproduce the claim, expose the assumptions, design the controls, and make the result falsifiable.'
  },
  {
    id: '02',
    title: 'Quant',
    theorem: 'Signal → decision',
    copy: 'Build research pipelines where provenance, constraints, regime sensitivity, and reviewability are first-class.'
  },
  {
    id: '03',
    title: 'Systems',
    theorem: 'Model → reality',
    copy: 'Carry ideas across APIs, cloud data, hardware boundaries, reliability checks, and human operations.'
  }
];

export const secondaryProjects = [
  { title: 'MediKart', note: 'Security-hardened MERN commerce with server-authoritative pricing and idempotent Stripe fulfillment.', lang: 'JavaScript', href: 'https://github.com/aerraj/MediKart' },
  { title: 'Pacman 4D', note: 'A deterministic browser experiment where spectral agents move through superposition, entanglement, and decoherence.', lang: 'TypeScript', href: 'https://github.com/aerraj/pacman4d' },
  { title: 'GeoFolio', note: 'C++ and Python portfolio analytics with live Coinbase feeds, geographic stress scenarios, persistent team workspaces, and source-backed LLM context.', lang: 'C++ / Python', href: 'https://github.com/aerraj/geofolio-context' },
  { title: 'AgriProPlus', note: 'Serverless agricultural intelligence with crop inference, searchable public schemes, and protected administration.', lang: 'React / Node.js', href: 'https://github.com/aerraj/Agriproplus' }
];

export const timeline = [
  { date: 'Aug 2025 — now', role: 'Operations Officer', place: 'HPCL · Jamshedpur', copy: 'Own high-availability LPG operations at 300 MT/day, automate recurring workflows, and lead multidisciplinary reliability work.' },
  { date: 'In progress', role: 'MSc Financial Engineering', place: 'WorldQuant University', copy: 'Deepening the statistical, econometric, and mathematical foundation behind market research.' },
  { date: 'Jan — May 2025', role: 'Junior Quantitative Developer', place: 'NorthRock Capital', copy: 'Built investment-research infrastructure, portfolio intelligence, and constrained quantitative models for a $450M+ AUM team.' },
  { date: '2021 — Jun 2025', role: 'BTech Electrical & Electronics', place: 'National Institute of Technology Delhi', copy: 'Studied the boundary between computation and physical systems; graduated with a 7.79/10 CGPA.' }
];

export const proof = [
  { value: '869', label: 'LeetCode solved', href: 'https://leetcode.com/u/aerraj/' },
  { value: '1621', label: 'Codeforces Expert', href: 'https://codeforces.com/profile/aerraj' },
  { value: '38', label: 'CodeChef global rank', href: 'https://www.codechef.com/users/ae_rraj' },
  { value: 'R2', label: 'Meta Hacker Cup 2024', href: 'https://www.facebook.com/codingcompetitions/hacker-cup/2024/certificate/1718845482222514' },
  { value: 'ICPC', label: 'Asia Kanpur Honorable', href: '/icpc-asia-kanpur-achievement.pdf' }
];
