'use client';

import { useEffect, useRef } from 'react';
import { ambientLoop } from '@/lib/ambient-loop';

function random(index: number) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

/** Cached galactic dust plus a sparse foreground: no particle DOM or per-frame allocation. */
export default function GalaxyField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dust = document.createElement('canvas');
    const stars = document.createElement('canvas');
    const dustCtx = dust.getContext('2d');
    const starCtx = stars.getContext('2d');
    if (!dustCtx || !starCtx) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: 0, y: 0 };
    let x = 0, y = 0, scroll = window.scrollY;
    let width = 0, height = 0, size = 0, ratio = 1;
    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      ratio = Math.min(devicePixelRatio || 1, width < 760 ? 1 : 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      // Bound the texture independently of screen density and monitor size.
      size = Math.min(1500, Math.max(width, height) * 1.25);
      dust.width = dust.height = Math.ceil(size);
      stars.width = Math.ceil(width + 80);
      stars.height = Math.ceil(height + 80);
      const count = width < 760 ? 2200 : 4600;
      for (let i = 0; i < count; i++) {
        const radius = Math.pow(random(i + 4), 0.62) * size * 0.47;
        const angle = radius / size * 11 + (i % 3) * Math.PI * 2 / 3 + (random(i + 23) - 0.5) * 0.85;
        const spread = (random(i + 89) - 0.5) * size * 0.055;
        const px = size / 2 + Math.cos(angle) * radius;
        const py = size / 2 + Math.sin(angle) * radius * 0.43 + spread;
        const bright = random(i + 161);
        dustCtx.fillStyle = i % 6 === 0 ? `rgba(239,190,128,${0.12 + bright * 0.4})` : `rgba(168,195,236,${0.08 + bright * 0.42})`;
        dustCtx.beginPath();
        dustCtx.arc(px, py, 0.3 + bright * 0.85, 0, Math.PI * 2);
        dustCtx.fill();
        if (bright > 0.985) {
          const glow = dustCtx.createRadialGradient(px, py, 0, px, py, 9);
          glow.addColorStop(0, 'rgba(222,235,255,.45)');
          glow.addColorStop(1, 'rgba(150,186,255,0)');
          dustCtx.fillStyle = glow;
          dustCtx.fillRect(px - 9, py - 9, 18, 18);
        }
      }
      const starCount = Math.min(230, Math.round(width * height / 5500));
      for (let i = 0; i < starCount; i++) {
        const px = random(i + 400) * stars.width;
        const py = random(i + 900) * stars.height;
        starCtx.fillStyle = `rgba(212,226,248,${0.2 + random(i + 620) * 0.48})`;
        starCtx.beginPath();
        starCtx.arc(px, py, 0.45 + random(i + 540) * 0.65, 0, Math.PI * 2);
        starCtx.fill();
      }
      // Sparse constellation chains stay near the margins, away from body copy.
      for (const side of [0.08, 0.85]) {
        starCtx.beginPath();
        for (let i = 0; i < 6; i++) {
          const px = stars.width * side + Math.sin(i * 2.3) * 34;
          const py = stars.height * (0.16 + i * 0.12);
          if (i === 0) starCtx.moveTo(px, py); else starCtx.lineTo(px, py);
        }
        starCtx.strokeStyle = 'rgba(139,173,228,.18)';
        starCtx.lineWidth = 0.65;
        starCtx.stroke();
      }
    };
    resize();
    const loop = ambientLoop(canvas, (time, delta) => {
      const smooth = 1 - Math.exp(-delta * 3);
      x += (pointer.x - x) * smooth;
      y += (pointer.y - y) * smooth;
      scroll += (window.scrollY - scroll) * smooth;
      const progress = Math.min(1, scroll / Math.max(height, 1));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 0.55;
      ctx.drawImage(stars, -40 + x * 5, -40 + y * 5 - Math.sin(time * 0.035) * 8);
      ctx.save();
      ctx.globalAlpha = 0.7 - progress * 0.46;
      ctx.translate(width * 0.52 + x * 10, height * 0.46 + y * 8 - progress * height * 0.12);
      ctx.rotate(-0.38 + Math.sin(time * 0.025) * 0.045);
      ctx.drawImage(dust, -size / 2, -size / 2);
      ctx.restore();
    });
    const onResize = () => { resize(); loop.invalidate(); };
    const onPointer = (event: PointerEvent) => {
      if (motion.matches || event.pointerType !== 'mouse') return;
      pointer.x = event.clientX / width - 0.5;
      pointer.y = event.clientY / height - 0.5;
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(canvas);
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => { loop.dispose(); observer.disconnect(); window.removeEventListener('pointermove', onPointer); };
  }, []);
  return <canvas ref={ref} className="galaxy-field" aria-hidden="true" />;
}
