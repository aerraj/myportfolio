const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function harness(reduced = false) {
  const frames = new Map();
  let id = 0, observer, disconnected = false;
  const events = new Map();
  const changes = new Map();
  const document = {
    hidden: false,
    addEventListener: (name, fn) => events.set(name, fn),
    removeEventListener: (name) => events.delete(name)
  };
  const preference = {
    matches: reduced,
    addEventListener: (name, fn) => changes.set(name, fn),
    removeEventListener: (name) => changes.delete(name)
  };
  const sandbox = {
    exports: {}, document, matchMedia: () => preference,
    requestAnimationFrame: (fn) => { frames.set(++id, fn); return id; },
    cancelAnimationFrame: (id) => frames.delete(id),
    IntersectionObserver: class {
      constructor(fn) { observer = fn; }
      observe() {}
      disconnect() { disconnected = true; }
    }
  };
  vm.runInNewContext(ts.transpileModule(readFileSync(require.resolve('../lib/ambient-loop.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS }
  }).outputText, sandbox);
  const draws = [];
  const loop = sandbox.exports.ambientLoop({}, (time, delta) => draws.push({ time, delta }));
  return {
    loop, draws, frames, events, changes,
    step(now) { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(now)); },
    visible(value) { observer([{ isIntersecting: value }]); },
    hidden(value) { document.hidden = value; events.get('visibilitychange')(); },
    reduced(value) { preference.matches = value; changes.get('change')(); },
    get disconnected() { return disconnected; }
  };
}

test('offscreen and hidden surfaces stop; resume has no elapsed-time jump or duplicate loops', () => {
  const h = harness();
  h.step(100); h.step(116);
  assert.equal(h.draws[1].delta, 0.016);
  h.visible(false);
  assert.equal(h.frames.size, 0);
  h.visible(true); h.visible(true);
  assert.equal(h.frames.size, 1);
  h.step(90000);
  assert.equal(h.draws.at(-1).delta, 0);
  h.hidden(true);
  assert.equal(h.frames.size, 0);
  h.hidden(false);
  assert.equal(h.frames.size, 1);
  h.loop.dispose();
});

test('reduced motion renders once, redraws after resize, and responds to live preference changes', () => {
  const h = harness(true);
  h.step(100);
  assert.equal(h.frames.size, 0);
  assert.equal(h.draws[0].delta, 0);
  h.loop.invalidate(); h.step(200);
  assert.equal(h.draws.length, 2);
  assert.equal(h.frames.size, 0);
  h.reduced(false); h.step(300); h.step(316);
  assert.equal(h.frames.size, 1);
  h.reduced(true); h.step(332);
  assert.equal(h.frames.size, 0);
  h.loop.dispose();
});

test('cleanup cancels pending rendering and releases every observer and listener', () => {
  const h = harness();
  h.loop.dispose(); h.loop.invalidate();
  assert.equal(h.frames.size, 0);
  assert.equal(h.events.size, 0);
  assert.equal(h.changes.size, 0);
  assert.equal(h.disconnected, true);
});
