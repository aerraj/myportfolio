/** One animation loop per surface, with no work in hidden tabs or offscreen.
 * Reduced motion draws a still frame; resize/control changes can invalidate it.
 */
export function ambientLoop(host: Element, draw: (time: number, delta: number) => void) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let last = 0;
  let elapsed = 0;
  let visible = true;
  let disposed = false;
  const tick = (now: number) => {
    frame = 0;
    const delta = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    if (!preference.matches) elapsed += delta;
    draw(elapsed, preference.matches ? 0 : delta);
    if (visible && !document.hidden && !preference.matches) frame = requestAnimationFrame(tick);
  };
  const invalidate = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    if (!disposed && visible && !document.hidden) frame = requestAnimationFrame(tick);
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    invalidate();
  });
  observer.observe(host);
  document.addEventListener('visibilitychange', invalidate);
  preference.addEventListener('change', invalidate);
  invalidate();
  return {
    invalidate,
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', invalidate);
      preference.removeEventListener('change', invalidate);
    }
  };
}
