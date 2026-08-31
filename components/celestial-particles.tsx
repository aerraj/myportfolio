'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

const vertexShader = `
  attribute vec3 target;
  attribute float seed;
  uniform float time;
  uniform float progress;
  uniform float ouSigma;
  uniform vec2 pointer;
  varying float vGlow;
  float easeOut(float x) { return 1.0 - pow(1.0 - x, 3.0); }
  void main() {
    float p = easeOut(clamp(progress, 0.0, 1.0));
    vec3 pos = mix(position, target, p);
    float theta = 0.165;
    float ou = sin(time * 0.19 + seed * 61.0) / sqrt(theta * theta + 0.0361);
    ou += 0.52 * sin(time * 0.73 + seed * 131.0) / sqrt(theta * theta + 0.5329);
    ou += 0.24 * sin(time * 1.91 + seed * 277.0) / sqrt(theta * theta + 3.6481);
    ou *= ouSigma * 0.115;
    pos.x += ou * (0.18 + abs(target.x) * 0.08) * p;
    pos.y += ou * 0.14 * p;
    float breath = sin(time * 0.42 + seed * 18.0) * 0.025 * p;
    pos.x += breath * (0.5 + abs(target.x));
    pos.y += sin(time * 0.3 + seed * 11.0) * 0.018 * p;
    pos.x += pointer.x * (0.06 + seed * 0.04) * p;
    pos.y += pointer.y * (0.04 + seed * 0.025) * p;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (2.2 + seed * 2.4) * (8.0 / max(1.0, -mvPosition.z));
    vGlow = 0.42 + seed * 0.58;
  }
`;

const fragmentShader = `
  varying float vGlow;
  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float alpha = smoothstep(0.5, 0.03, length(uv)) * vGlow;
    vec3 cold = vec3(0.43, 0.58, 0.91);
    vec3 glory = vec3(0.96, 0.86, 0.66);
    gl_FragColor = vec4(mix(cold, glory, vGlow * 0.75), alpha * 0.82);
  }
`;

function seeded(index: number) {
  const x = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function buildSwarm(count: number) {
  const start = new Float32Array(count * 3);
  const target = new Float32Array(count * 3);
  const seed = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const r1 = seeded(i + 1);
    const r2 = seeded(i + 101);
    const r3 = seeded(i + 991);
    seed[i] = r1;
    start[i * 3] = (r1 - 0.5) * 8;
    start[i * 3 + 1] = 4.8 + r2 * 8;
    start[i * 3 + 2] = (r3 - 0.5) * 3;

    const slot = i / count;
    let x = 0;
    let y = 0;
    let z = 0;

    if (slot < 0.68) {
      const side = i % 2 === 0 ? -1 : 1;
      const t = r2;
      const feather = Math.floor(r3 * 8) / 8;
      x = side * (0.48 + t * 3.15 + feather * 0.28);
      y = 0.65 + Math.sin(t * Math.PI) * 1.48 - t * 1.15 - feather * 0.48;
      z = (r1 - 0.5) * 0.5 + Math.sin(t * 5) * 0.12;
    } else if (slot < 0.80) {
      const angle = r1 * Math.PI * 2;
      const radius = 0.52 + r2 * 0.12;
      x = Math.cos(angle) * radius;
      y = 2.05 + Math.sin(angle) * radius * 0.35;
      z = (r3 - 0.5) * 0.12;
    } else if (slot < 0.93) {
      x = (r1 - 0.5) * (0.26 + r2 * 0.35);
      y = 1.58 - r2 * 2.8;
      z = (r3 - 0.5) * 0.3;
    } else {
      x = (r1 - 0.5) * 8.5;
      y = (r2 - 0.5) * 5.7;
      z = -0.8 + r3 * 1.4;
    }

    target[i * 3] = x;
    target[i * 3 + 1] = y;
    target[i * 3 + 2] = z;
  }
  return { start, target, seed };
}

export default function CelestialParticles({ descentSpeed = 1, gloryIntensity = 1 }: { descentSpeed?: number; gloryIntensity?: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(descentSpeed);
  const gloryRef = useRef(gloryIntensity);

  useEffect(() => { speedRef.current = descentSpeed; }, [descentSpeed]);
  useEffect(() => { gloryRef.current = gloryIntensity; }, [gloryIntensity]);

  useEffect(() => {
    if (!hostRef.current) return;
    const host = hostRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 720px)').matches;
    const count = mobile ? 5800 : 18000;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.7));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(0, 0.25, 8);
    const swarm = buildSwarm(count);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(swarm.start, 3));
    geometry.setAttribute('target', new THREE.BufferAttribute(swarm.target, 3));
    geometry.setAttribute('seed', new THREE.BufferAttribute(swarm.seed, 1));
    const uniforms = {
      time: { value: 0 },
      progress: { value: reduced ? 1 : 0 },
      ouSigma: { value: 0.184 },
      pointer: { value: new THREE.Vector2(0, 0) }
    };
    const material = new THREE.ShaderMaterial({
      vertexShader, fragmentShader, uniforms, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    const entrance = reduced ? null : gsap.to(uniforms.progress, { value: 1, duration: 4.8 / speedRef.current, ease: 'power4.out', delay: 0.2 });
    const onPointerMove = (event: PointerEvent) => {
      if (reduced) return;
      gsap.to(uniforms.pointer.value, {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: -(event.clientY / window.innerHeight - 0.5) * 2,
        duration: 1.5, ease: 'power2.out', overwrite: true
      });
    };
    const clock = new THREE.Clock();
    let raf = 0;
    const render = () => {
      const elapsed = reduced ? 0.8 : clock.getElapsedTime();
      uniforms.time.value = elapsed * speedRef.current;
      uniforms.ouSigma.value = 0.184 * gloryRef.current;
      points.rotation.y = reduced ? 0 : Math.sin(uniforms.time.value * 0.13) * 0.08;
      material.opacity = Math.min(1, 0.62 + gloryRef.current * 0.28);
      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(render);
    };
    render();
    const onResize = () => {
      if (!host.clientWidth || !host.clientHeight) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      entrance?.kill();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="celestial-canvas" aria-hidden="true" />;
}
