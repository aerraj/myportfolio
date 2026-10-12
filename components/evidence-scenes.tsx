const waveletWidths = [92, 76, 61, 49, 42, 34, 28, 21, 16];
const marketPoints = [
  [50, 152], [72, 139], [88, 159], [105, 124], [128, 145], [143, 111], [165, 131], [184, 96],
  [201, 119], [226, 85], [249, 104], [270, 69], [292, 90], [315, 58], [339, 73], [361, 43],
  [385, 61], [405, 31], [431, 47], [449, 23]
];

function DwtEvidence() {
  return (
    <div className="evidence-scene dwt-evidence" role="img" aria-label="A noisy vibration signal separates into nine wavelet bands, compresses through a neural network, and ends in bit-accurate verification.">
      <div className="evidence-readout"><span>VIBRATION · 4.2 kHz</span><span>DB44 / L9</span></div>
      <svg className="evidence-wave" viewBox="0 0 480 92" aria-hidden="true">
        <path className="wave-baseline" d="M0 46H480" />
        <path className="raw-wave" d="M0 48 C14 12 25 82 40 44 S66 15 78 53 S100 74 114 39 S138 6 151 53 S177 83 191 36 S218 8 229 51 S254 77 270 43 S296 22 309 49 S335 68 350 38 S377 15 392 51 S420 78 433 39 S458 18 480 47" />
      </svg>
      <div className="wavelet-stack" aria-hidden="true">
        {waveletWidths.map((width, index) => <i key={width} style={{ width: `${width}%` }}><span>D{index + 1}</span></i>)}
      </div>
      <div className="neural-collapse" aria-hidden="true">
        {['9', '32', '64', '128', '64', '32', '1'].map((node, index) => <span key={`${node}-${index}`}>{node}</span>)}
      </div>
      <div className="verification-stamp"><i /> BIT-ACCURATE · VERIFIED</div>
    </div>
  );
}

function PortfolioEvidence() {
  const selected = new Set([5, 8, 11, 13, 15, 17, 19]);
  return (
    <div className="evidence-scene portfolio-evidence" role="img" aria-label="A sparse risk-return field of instruments is constrained into a reviewable portfolio along an efficient frontier.">
      <div className="evidence-readout"><span>CONSTRAINED ALLOCATION</span><span>MONTHLY</span></div>
      <svg className="risk-field" viewBox="0 0 480 210" aria-hidden="true">
        <path className="field-axis" d="M34 12V182H468" />
        <path className="field-grid" d="M34 56H468M34 100H468M34 144H468M126 12V182M218 12V182M310 12V182M402 12V182" />
        <ellipse className="covariance-ellipse" cx="261" cy="103" rx="134" ry="47" transform="rotate(-18 261 103)" />
        <path className="efficient-frontier" d="M48 166 C104 151 134 133 170 109 C223 74 293 45 451 20" />
        <path className="constraint-line" d="M326 16V180M376 16V180" />
        {marketPoints.map(([x, y], index) => <circle key={`${x}-${y}`} className={selected.has(index) ? 'instrument selected' : 'instrument'} cx={x} cy={y} r={selected.has(index) ? 4 : 2.2} />)}
        <text x="42" y="24">E[r]</text><text x="445" y="202">σ</text>
      </svg>
      <div className="portfolio-axis-note"><span>36 EUR listings</span><span>≤ 100% gross</span><strong>≤ 5% net</strong></div>
    </div>
  );
}

function TradingEvidence() {
  return (
    <div className="evidence-scene agri-evidence" role="img" aria-label="ITCH market data travels through order books, strategy signals, risk checks, and OUCH encoding in a simulation engine.">
      <div className="topographic-field" aria-hidden="true" />
      <div className="evidence-readout"><span>TICK-TO-TRADE PIPELINE</span><span>C++20</span></div>
      <div className="agri-inputs"><span>ITCH</span><span>BOOK</span><span>SIGNAL</span><span>RISK</span></div>
      <div className="decision-tree" aria-hidden="true">
        <i /><i /><i /><i /><b>PENDING-EXPOSURE CHECK</b>
      </div>
      <div className="recommendation-card"><small>OUCH ENCODING</small><strong>Parse · check · simulate</strong><span>320 ns p50 · synthetic benchmark</span></div>
      <div className="edge-condition"><i /> SIMULATION · NO LIVE EXCHANGE</div>
    </div>
  );
}

export function ProjectEvidence({ project }: { project: 'A' | 'B' | 'C' }) {
  if (project === 'A') return <DwtEvidence />;
  if (project === 'B') return <PortfolioEvidence />;
  return <TradingEvidence />;
}

export function SignalBlueprintTransition() {
  return (
    <section className="signal-blueprint" aria-labelledby="signal-blueprint-caption">
      <div className="blueprint-stage" aria-hidden="true">
        <svg viewBox="0 0 1200 240" preserveAspectRatio="none">
          <path className="blueprint-baseline" d="M0 121H1200" />
          <path className="blueprint-wave" d="M0 124 C34 54 62 190 98 118 S164 72 198 131 S264 175 300 102 S370 57 405 128 S473 169 511 106 S574 87 610 122" />
          <path className="blueprint-line" d="M610 122H810M810 122V36M810 122V204M810 122H1030M1030 36V204" />
        </svg>
        <div className="measured-features"><span>σ 0.184</span><span>t½ 4.20s</span><span>Δ verified</span></div>
        <div className="blueprint-columns"><i /><i /><i /></div>
      </div>
      <p id="signal-blueprint-caption">A signal becomes useful when its assumptions become visible.</p>
    </section>
  );
}

export function CapabilityArtifact({ id }: { id: string }) {
  if (id === '01') return (
    <div className="capability-artifact paper-artifact" role="img" aria-label="An annotated research sheet turns a claim into a falsifiable reproduction plot.">
      <span className="margin-note">H₀ · reproduce<br />Δ · measure<br />⊘ · falsify</span>
      <svg viewBox="0 0 280 112" aria-hidden="true"><path d="M8 93H270M22 103V12" /><path className="artifact-plot" d="M22 87 C53 78 63 90 88 64 S132 72 151 45 S196 57 215 29 S249 31 270 17" /><circle cx="215" cy="29" r="4" /></svg>
      <strong>CLAIM → CONTROL → RESULT</strong>
    </div>
  );
  if (id === '02') return (
    <div className="capability-artifact decision-artifact" role="img" aria-label="A regime strip and constraint boundary resolve a quantitative signal into an auditable decision ledger.">
      <div className="regime-strip"><i /><i /><i /><i /><i /></div>
      <div className="decision-boundary"><span>unconstrained</span><b /><strong>reviewable</strong></div>
      <div className="decision-ledger"><span>PROVENANCE <b>PASS</b></span><span>CONSTRAINTS <b>BOUND</b></span><span>REGIME <b>VISIBLE</b></span></div>
    </div>
  );
  return (
    <div className="capability-artifact systems-artifact" role="img" aria-label="A model crosses an API and hardware boundary, handles a retry path, and reaches an observed result.">
      <div className="system-route"><span>MODEL</span><i /><span>API</span><i /><span>EDGE</span><i /><span>OBSERVED</span></div>
      <div className="retry-route">↳ retry / idempotent / bounded</div>
      <strong>THE ROUTE IS PART OF THE RESULT</strong>
    </div>
  );
}

export function BuildArtifact({ title }: { title: string }) {
  if (title === 'MediKart') return (
    <div className="build-artifact transaction-artifact" aria-hidden="true"><span>CLIENT ₹</span><i /><span>SERVER ₹</span><i /><b>SETTLED ONCE</b><code>idem_7f2a</code></div>
  );
  if (title === 'Pacman 4D') return (
    <div className="build-artifact maze-artifact" aria-hidden="true"><i className="maze-wall a" /><i className="maze-wall b" /><i className="maze-wall c" /><span className="pac">●</span><span className="ghost one">◇</span><span className="ghost two">◇</span><code>ψ → decohere</code></div>
  );
  if (title === 'AgriProPlus') return (
    <div className="build-artifact transaction-artifact" aria-hidden="true"><span>SOIL + WEATHER</span><i /><span>MODEL</span><i /><b>CROP INFERENCE</b></div>
  );
  if (title === 'GeoFolio') return (
    <div className="build-artifact transaction-artifact" aria-hidden="true"><span>LIVE FEEDS</span><i /><span>C++ ANALYTICS</span><i /><b>SCENARIO CONTEXT</b><code>sources + assumptions</code></div>
  );
  return (
    <div className="build-artifact graph-artifact" aria-hidden="true"><svg viewBox="0 0 300 132"><path d="M32 96L91 37L151 82L211 28L270 66M91 37L211 28M151 82L270 66" /><circle cx="32" cy="96" r="7" /><circle cx="91" cy="37" r="7" /><circle cx="151" cy="82" r="7" /><circle cx="211" cy="28" r="7" /><circle cx="270" cy="66" r="7" /></svg><code>O(E log V)</code></div>
  );
}
