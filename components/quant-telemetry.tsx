'use client';

import { useEffect, useRef } from 'react';

export default function QuantTelemetry() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
      width = box.width;
      height = box.height;
      canvas.width = Math.max(1, Math.floor(width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (timestamp = 0) => {
      if (!reduced && timestamp - last < 32) {
        frame = requestAnimationFrame(draw);
        return;
      }
      last = timestamp;
      const time = reduced ? 2.4 : timestamp / 1000;
      context.clearRect(0, 0, width, height);

      const gold = 'rgba(239, 178, 87, 0.58)';
      const pale = 'rgba(255, 240, 201, 0.28)';
      const blue = 'rgba(110, 143, 234, 0.22)';

      context.lineWidth = 0.7;
      context.strokeStyle = pale;
      context.setLineDash([2, 9]);
      context.beginPath();
      context.moveTo(width * 0.04, height * 0.42);
      context.lineTo(width * 0.42, height * 0.42);
      context.moveTo(width * 0.70, height * 0.30);
      context.lineTo(width * 0.96, height * 0.30);
      context.stroke();

      context.setLineDash([]);
      context.strokeStyle = gold;
      context.lineWidth = 1.15;
      context.beginPath();
      for (let point = 0; point <= 150; point += 1) {
        const ratio = point / 150;
        const x = width * (0.04 + ratio * 0.38);
        const spectralOu = Math.sin(ratio * 23 + time * 0.55) * 0.52 + Math.sin(ratio * 49 - time * 0.22) * 0.22 + Math.sin(ratio * 9 + 1.4) * 0.18;
        const envelope = 0.58 + Math.sin(time * 0.17) * 0.08;
        const y = height * (0.42 + spectralOu * envelope * 0.065);
        if (point === 0) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.stroke();

      context.strokeStyle = blue;
      context.lineWidth = 0.9;
      context.beginPath();
      for (let point = 0; point <= 90; point += 1) {
        const ratio = point / 90;
        const x = width * (0.70 + ratio * 0.26);
        const y = height * (0.55 - (0.18 * Math.sqrt(ratio)) - Math.sin(time * 0.25) * 0.004);
        if (point === 0) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.stroke();

      context.fillStyle = 'rgba(255, 240, 201, 0.78)';
      for (let point = 0; point < 7; point += 1) {
        const ratio = point / 6;
        const x = width * (0.70 + ratio * 0.26);
        const y = height * (0.55 - 0.18 * Math.sqrt(ratio));
        context.beginPath();
        context.arc(x, y, point === 4 ? 2.3 : 1.2, 0, Math.PI * 2);
        context.fill();
      }

      if (!reduced) frame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="quant-telemetry" aria-hidden="true">
      <canvas ref={canvasRef} />
      <code className="quant-formula formula-ou">dXₜ = θ(μ − Xₜ)dt + σdWₜ</code>
      <code className="quant-formula formula-frontier">arg max μᵀw − λwᵀΣw</code>
      <code className="quant-formula formula-cov">Σ = (XᵀX)/(n − 1)</code>
      <span className="quant-axis axis-return">E[rₚ]</span>
      <span className="quant-axis axis-risk">σₚ</span>
    </div>
  );
}
