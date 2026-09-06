'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from 'framer-motion';
import { ambientLoop } from '@/lib/ambient-loop';
import * as THREE from 'three';

const vertexShader = `
  attribute vec3 target;
  attribute float seed;
  uniform float time;
  uniform float progress;
  uniform float ouSigma;
  uniform float pointScale;
  uniform vec2 pointer;
  uniform float pointerStrength;
  uniform float aspect;
  uniform float scatter;
  uniform float contentEdge;
  uniform vec4 wakes[8];
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

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    // The rising content boundary releases each particle into the surrounding sky.
    vec4 projected = projectionMatrix * mvPosition;
    float screenY = projected.y / projected.w;
    float swept = smoothstep(screenY - 0.24, screenY + 0.35, contentEdge);
    float release = scatter * (0.25 + swept * 0.75);
    float angle = seed * 239.0;
    vec2 dispersed = vec2(sin(angle) * aspect, cos(seed * 173.0)) * (1.0 + seed * 2.6);
    // Push away from the central reading column, leaving readable space for text.
    dispersed.x += (dispersed.x < 0.0 ? -1.0 : 1.0) * 1.15;
    mvPosition.xy = mix(mvPosition.xy, dispersed, release);
    mvPosition.z -= release * (0.4 + seed * 1.4);
    projected = projectionMatrix * mvPosition;
    vec2 screen = projected.xy / projected.w;
    vec2 displacement = vec2(0.0);
    for (int i = 0; i < 8; i++) {
      vec2 offset = (screen - wakes[i].xy) * vec2(aspect, 1.0);
      float distanceToWake = length(offset);
      float age = wakes[i].z;
      float radius = 0.17 + age * 0.13;
      float envelope = (1.0 - smoothstep(0.0, radius, distanceToWake)) * exp(-age * 2.8) * wakes[i].w;
      vec2 direction = offset / max(distanceToWake, 0.015);
      vec2 tangent = vec2(-direction.y, direction.x);
      displacement += (direction + tangent * sin(seed * 43.0 + age * 3.0) * 0.65) * envelope * 0.18;
    }
    vec2 offset = (screen - pointer) * vec2(aspect, 1.0);
    float distanceToPointer = length(offset);
    displacement += offset / max(distanceToPointer, 0.015)
      * (1.0 - smoothstep(0.0, 0.19, distanceToPointer)) * pointerStrength * 0.22;
    mvPosition.xy += displacement * (1.0 + seed * 0.65) * p;
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
    float aura = (1.0 - smoothstep(0.06, 0.5, distanceFromCore));
    float core = (1.0 - smoothstep(0.0, 0.16, distanceFromCore));
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
  const reducedMotion = useReducedMotion();
  const invalidateRef = useRef<(() => void) | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(descentSpeed);
  const gloryRef = useRef(gloryIntensity);

  useEffect(() => { speedRef.current = descentSpeed; }, [descentSpeed]);
  useEffect(() => { gloryRef.current = gloryIntensity; invalidateRef.current?.(); }, [gloryIntensity]);

  useEffect(() => {
    if (!hostRef.current) return;
    const host = hostRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 720px)').matches;
    const count = mobile ? 4200 : 12000;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch {
      // The independent 2D galaxy remains visible when WebGL is unavailable.
      return;
    }
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
      pointer: { value: new THREE.Vector2(-10, -10) },
      pointerStrength: { value: 0 },
      aspect: { value: camera.aspect },
      scatter: { value: 0 },
      contentEdge: { value: -2 },
      wakes: { value: Array.from({ length: 8 }, () => new THREE.Vector4(-10, -10, 10, 0)) }
    };
    const haloUniforms = {
      time: uniforms.time,
      progress: uniforms.progress,
      ouSigma: uniforms.ouSigma,
      pointer: uniforms.pointer,
      pointerStrength: uniforms.pointerStrength,
      aspect: uniforms.aspect,
      scatter: uniforms.scatter,
      contentEdge: uniforms.contentEdge,
      wakes: uniforms.wakes,
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
    // Shader targets extend beyond the CPU-side entrance bounding sphere.
    points.frustumCulled = false;
    haloPoints.frustumCulled = false;
    const angel = new THREE.Group();
    angel.add(haloPoints, points);
    angel.scale.setScalar(reduced ? 1.08 : 0.82);
    scene.add(angel);
    const entrance = reduced ? null : gsap.to(uniforms.progress, { value: 1, duration: 5.6 / speedRef.current, ease: 'power4.out', delay: 0.15 });
    const scaleEntrance = reduced ? null : gsap.to(angel.scale, { x: 1.08, y: 1.08, z: 1.08, duration: 5.8, ease: 'power3.out', delay: 0.15 });
    let pointerActive = false;
    let pointerMoved = false;
    let wakeIndex = 0;
    let sinceWake = 0;
    const targetPointer = new THREE.Vector2(-10, -10);
    const onPointerMove = (event: PointerEvent) => {
      if (reduced || event.pointerType !== 'mouse') return;
      const rect = host.getBoundingClientRect();
      pointerActive = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      targetPointer.set((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
      pointerMoved = true;
    };
    const leave = () => { pointerActive = false; pointerMoved = false; };
    const copy = document.querySelector('.hero-copy');
    let edge = -2;
    let scrollTarget = 0;
    const measureScroll = () => {
      const rect = host.getBoundingClientRect();
      const top = copy?.getBoundingClientRect().top ?? window.innerHeight;
      edge = 1 - (top - rect.top) / Math.max(rect.height, 1) * 2;
      scrollTarget = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.85)));
    };
    measureScroll();
    const loop = ambientLoop(host, (_elapsed, delta) => {
      const easing = 1 - Math.exp(-delta * 5);
      uniforms.pointer.value.lerp(targetPointer, 1 - Math.exp(-delta * 24));
      uniforms.pointerStrength.value += ((pointerActive ? 1 : 0) - uniforms.pointerStrength.value) * easing;
      uniforms.scatter.value += ((reduced ? 0 : scrollTarget) - uniforms.scatter.value) * easing;
      uniforms.contentEdge.value += (edge - uniforms.contentEdge.value) * easing;
      sinceWake += delta;
      for (const wake of uniforms.wakes.value) wake.z += delta;
      if (pointerActive && pointerMoved && sinceWake > 0.035) {
        uniforms.wakes.value[wakeIndex].set(targetPointer.x, targetPointer.y, 0, 1);
        wakeIndex = (wakeIndex + 1) % 8;
        sinceWake = 0;
        pointerMoved = false;
      }
      // Integrate speed so moving the slider cannot jump the animation's phase.
      uniforms.time.value += delta * speedRef.current;
      uniforms.ouSigma.value = 0.184 * gloryRef.current;
      uniforms.intensity.value = Math.min(1.32, 0.78 + gloryRef.current * 0.34) * (1 - uniforms.scatter.value * 0.65);
      haloUniforms.intensity.value = Math.min(0.3, 0.11 + gloryRef.current * 0.08) * (1 - uniforms.scatter.value * 0.8);
      angel.rotation.y = reduced ? 0 : Math.sin(uniforms.time.value * 0.12) * 0.065;
      angel.position.y = reduced ? 0 : Math.sin(uniforms.time.value * 0.16) * 0.035;
      renderer.render(scene, camera);
    });
    invalidateRef.current = loop.invalidate;
    const onResize = () => {
      if (!host.clientWidth || !host.clientHeight) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      uniforms.aspect.value = camera.aspect;
      measureScroll();
      renderer.setSize(host.clientWidth, host.clientHeight);
      loop.invalidate();
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(host);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', measureScroll, { passive: true });
    window.addEventListener('blur', leave);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      entrance?.kill();
      scaleEntrance?.kill();
      loop.dispose();
      invalidateRef.current = null;
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', measureScroll);
      window.removeEventListener('blur', leave);
      document.documentElement.removeEventListener('pointerleave', leave);
      geometry.dispose();
      material.dispose();
      haloMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion]);

  return <div ref={hostRef} className="celestial-canvas" aria-hidden="true" />;
}
