import * as THREE from 'three';

export function mulberry(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Procedural fibre surface. Stroke count scales with the published density,
 * so a 1,400 kg/m³ board is drawn with 1400/750 times the fibres of a 750 one.
 */
export function drawFibreSurface(ctx: CanvasRenderingContext2D, w: number, h: number, opts: { base: string; inks: string[]; density: number; seed?: number }) {
  const r = mulberry(opts.seed ?? 7);
  ctx.fillStyle = opts.base;
  ctx.fillRect(0, 0, w, h);
  ctx.lineCap = 'round';
  const n = Math.round(w * h * 0.03 * (opts.density / 1400));
  for (let i = 0; i < n; i++) {
    const x = r() * w, y = r() * h, len = 10 + r() * 26;
    const a = (r() - 0.5) * 0.9 + (r() < 0.12 ? (r() - 0.5) * 2.4 : 0);
    const dx = Math.cos(a) * len, dy = Math.sin(a) * len, b = (r() - 0.5) * 8;
    ctx.strokeStyle = opts.inks[(r() * opts.inks.length) | 0];
    ctx.lineWidth = 0.7 + r() * 1.1;
    ctx.beginPath();
    ctx.moveTo(x - dx / 2, y - dy / 2);
    ctx.quadraticCurveTo(x - (dy / len) * b, y + (dx / len) * b, x + dx / 2, y + dy / 2);
    ctx.stroke();
  }
}

export function fibreTexture(opts: { base: string; inks: string[]; density: number; seed?: number }) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 640;
  drawFibreSurface(c.getContext('2d')!, c.width, c.height, opts);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
