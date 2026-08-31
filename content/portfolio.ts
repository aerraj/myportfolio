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
    title: 'Portfolio Intelligence',
    track: 'Quant',
    summary: 'A research pipeline for turning market structure into reviewable decisions.',
    detail: 'At NorthRock Capital, I built resilient ingestion across 250+ instruments, a local-LLM research workflow, and a constrained, monthly-rebalanced QMI portfolio model for a $1M initial allocation.',
    stack: ['Python', 'Portfolio Optimization', 'LLM', 'Cloud Data'],
    href: '/resume.pdf',
    cta: 'Read the documented work',
    signal: '$450M+ AUM · 250+ instruments'
  },
  {
    index: 'C',
    title: 'AgriProPlus',
    track: 'Systems',
    summary: 'Agricultural intelligence engineered for the messy edges of production.',
    detail: 'A serverless React/Node platform with bounded crop inference, searchable public schemes, protected administration, Firebase routing, accessible states, and a 96-tree model embedded directly in the API runtime.',
    stack: ['React', 'Node.js', 'MongoDB', 'Firebase', 'Python'],
    href: 'https://github.com/aerraj/Agriproplus',
    cta: 'Open the system',
    signal: '96-tree inference · bounded APIs'
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
  { title: 'TensorTonic', note: 'Verified, from-scratch machine-learning implementations with an emphasis on mathematical primitives.', lang: 'Python', href: 'https://github.com/aerraj/TensorTonic-Solutions' },
  { title: 'CSES', note: 'A working archive of algorithmic problem solving in modern C++.', lang: 'C++', href: 'https://github.com/aerraj/CSES' }
];

export const timeline = [
  { date: 'Aug 2025 — now', role: 'Operations Officer', place: 'HPCL · Jamshedpur', copy: 'Own high-availability LPG operations at 300 MT/day, automate recurring workflows, and lead multidisciplinary reliability work.' },
  { date: 'In progress', role: 'MSc Financial Engineering', place: 'WorldQuant University', copy: 'Deepening the statistical, econometric, and mathematical foundation behind market research.' },
  { date: 'Jan — May 2025', role: 'Junior Quantitative Developer', place: 'NorthRock Capital', copy: 'Built investment-research infrastructure, portfolio intelligence, and constrained quantitative models for a $450M+ AUM team.' },
  { date: '2021 — Jun 2025', role: 'BTech Electrical & Electronics', place: 'National Institute of Technology Delhi', copy: 'Studied the boundary between computation and physical systems; graduated with a 7.79/10 CGPA.' }
];

export const proof = [
  { value: '869', label: 'LeetCode solved' },
  { value: '1551', label: 'Codeforces Specialist' },
  { value: '38', label: 'CodeChef global rank' },
  { value: 'R2', label: 'Meta Hacker Cup 2024' }
];
