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
  uniform float pointScale;
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
    gl_PointSize = (2.9 + seed * 3.2) * pointScale * (8.2 / max(1.0, -mvPosition.z));
    vGlow = 0.52 + seed * 0.48;
  }
`;

const fragmentShader = `
  uniform float intensity;
  varying float vGlow;
  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float distanceFromCore = length(uv);
    float aura = smoothstep(0.5, 0.06, distanceFromCore);
    float core = smoothstep(0.16, 0.0, distanceFromCore);
    float alpha = (aura * 0.46 + core * 0.72) * vGlow * intensity;
    vec3 cold = vec3(0.46, 0.61, 0.94);
    vec3 glory = vec3(1.0, 0.88, 0.58);
    gl_FragColor = vec4(mix(cold, glory, 0.48 + vGlow * 0.48), alpha);
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

    if (slot < 0.58) {
      const side = i % 2 === 0 ? -1 : 1;
      const sweep = Math.pow(r2, 0.78);
      const feather = Math.floor(r3 * 10) / 10;
      x = side * (0.44 + sweep * 3.38 + feather * 0.2);
      y = 0.78 + Math.sin(sweep * Math.PI) * 1.72 - sweep * 1.18 - feather * 0.54;
      z = (r1 - 0.5) * 0.58 + Math.sin(sweep * 5) * 0.13;
    } else if (slot < 0.68) {
      const angle = r1 * Math.PI * 2;
      const radius = 0.56 + r2 * 0.14;
      x = Math.cos(angle) * radius;
      y = 2.17 + Math.sin(angle) * radius * 0.34;
      z = (r3 - 0.5) * 0.12;
    } else if (slot < 0.74) {
      const angle = r1 * Math.PI * 2;
      const radius = Math.sqrt(r2) * 0.2;
      x = Math.cos(angle) * radius;
      y = 1.44 + Math.sin(angle) * radius;
      z = (r3 - 0.5) * 0.16;
    } else if (slot < 0.91) {
      const angle = r1 * Math.PI * 2;
      const t = r2;
      const robe = 0.08 + Math.pow(t, 1.55) * 0.4;
      x = Math.cos(angle) * robe;
      y = 1.25 - t * 2.82;
      z = Math.sin(angle) * robe * 0.45;
    } else {
      const angle = r1 * Math.PI * 2;
      const radius = 1.1 + Math.pow(r2, 0.72) * 3.4;
      x = Math.cos(angle) * radius;
      y = 0.35 + Math.sin(angle) * radius * 0.72;
      z = -1.1 + r3 * 1.25;
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
    const count = mobile ? 7600 : 24000;
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
      pointScale: { value: 1 },
      intensity: { value: 1 },
      pointer: { value: new THREE.Vector2(0, 0) }
    };
    const haloUniforms = {
      time: uniforms.time,
      progress: uniforms.progress,
      ouSigma: uniforms.ouSigma,
      pointer: uniforms.pointer,
      pointScale: { value: 2.55 },
      intensity: { value: 0.16 }
    };
    const material = new THREE.ShaderMaterial({
      vertexShader, fragmentShader, uniforms, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending
    });
    const haloMaterial = new THREE.ShaderMaterial({
      vertexShader, fragmentShader, uniforms: haloUniforms, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(geometry, material);
    const haloPoints = new THREE.Points(geometry, haloMaterial);
    const angel = new THREE.Group();
    angel.add(haloPoints, points);
    angel.scale.setScalar(reduced ? 1.08 : 0.82);
    scene.add(angel);
    const entrance = reduced ? null : gsap.to(uniforms.progress, { value: 1, duration: 5.6 / speedRef.current, ease: 'power4.out', delay: 0.15 });
    const scaleEntrance = reduced ? null : gsap.to(angel.scale, { x: 1.08, y: 1.08, z: 1.08, duration: 5.8, ease: 'power3.out', delay: 0.15 });
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
    let visible = true;
    const render = () => {
      if (!visible) return;
      const elapsed = reduced ? 0.8 : clock.getElapsedTime();
      uniforms.time.value = elapsed * speedRef.current;
      uniforms.ouSigma.value = 0.184 * gloryRef.current;
      uniforms.intensity.value = Math.min(1.32, 0.78 + gloryRef.current * 0.34);
      haloUniforms.intensity.value = Math.min(0.3, 0.11 + gloryRef.current * 0.08);
      angel.rotation.y = reduced ? 0 : Math.sin(uniforms.time.value * 0.12) * 0.065;
      angel.position.y = reduced ? 0 : Math.sin(uniforms.time.value * 0.16) * 0.035;
      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(render);
    };
    render();
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!reduced && !raf) {
        render();
      }
    }, { threshold: 0.01 });
    visibilityObserver.observe(host);
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
      scaleEntrance?.kill();
      cancelAnimationFrame(raf);
      visibilityObserver.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      geometry.dispose();
      material.dispose();
      haloMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="celestial-canvas" aria-hidden="true" />;
}
