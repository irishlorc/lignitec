'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { journey } from '@/content/site';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { mulberry } from './three/fibreTexture';

type Fibre = { ax: number; ay: number; aa: number; cx: number; cy: number; ca: number; len: number; w: number; col: string; node: boolean };

const COLS = ['#C9B38F', '#C9B38F', '#B49B74', '#8A8A88', '#629A22'];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));

function makeFibres(n: number): Fibre[] {
  const r = mulberry(41);
  return Array.from({ length: n }, () => ({
    ax: r(), ay: r(), aa: (r() - 0.5) * Math.PI,
    cx: r(), cy: r(), ca: (r() - 0.5) * 0.35,
    len: 0.035 + r() * 0.05, w: 0.8 + r() * 1.4, col: COLS[(r() * COLS.length) | 0], node: r() < 0.3,
  }));
}

/** t runs 0..3 across the four stages: biomass, binder, panel, second life. */
function draw(c: HTMLCanvasElement, fibres: Fibre[], t: number) {
  const w = c.clientWidth, h = c.clientHeight;
  if (!w || !h) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
  const x = c.getContext('2d')!;
  x.setTransform(dpr, 0, 0, dpr, 0, 0);
  x.clearRect(0, 0, w, h);
  x.lineCap = 'round';

  const gather = ease(t) * 0.45 + ease(t - 1) * 0.55; // 0 loose, 1 pressed into the panel
  const bind = ease(t - 0.25) * (1 - ease(t - 1.6));
  const panel = ease(t - 1.35);
  const again = ease(t - 2.15);

  // panel rectangle
  const pw = Math.min(w * 0.72, 560), ph = Math.max(46, Math.min(h * 0.2, 96));
  const px = (w - pw) / 2, py = (h - ph) / 2;
  const s = Math.min(w, h);

  if (panel > 0) {
    x.globalAlpha = panel;
    x.fillStyle = '#E4D7BF';
    x.beginPath(); x.roundRect(px, py, pw, ph, 6); x.fill();
    x.globalAlpha = 1;
  }

  for (const f of fibres) {
    const fx = lerp(f.ax * w, px + 8 + f.cx * (pw - 16), gather);
    const fy = lerp(f.ay * h, py + 6 + f.cy * (ph - 12), gather);
    const a = lerp(f.aa, f.ca, gather);
    const len = f.len * s * lerp(1, 0.7, gather);
    const dx = Math.cos(a) * len, dy = Math.sin(a) * len;
    x.strokeStyle = f.col; x.lineWidth = f.w; x.globalAlpha = lerp(0.85, 0.7, gather);
    x.beginPath(); x.moveTo(fx - dx / 2, fy - dy / 2); x.lineTo(fx + dx / 2, fy + dy / 2); x.stroke();
    if (f.node && bind > 0.01) {
      x.globalAlpha = bind; x.fillStyle = '#629A22';
      x.beginPath(); x.arc(fx + dx / 2, fy + dy / 2, 2.6, 0, Math.PI * 2); x.fill();
    }
  }
  x.globalAlpha = 1;

  if (panel > 0) {
    x.globalAlpha = panel; x.strokeStyle = '#1F2420'; x.lineWidth = 1.5;
    x.beginPath(); x.roundRect(px, py, pw, ph, 6); x.stroke();
    x.globalAlpha = 1;
  }

  if (again > 0) {
    // an open loop around the panel: the intended second life
    const rx = pw / 2 + 34, ry = ph / 2 + Math.min(70, h * 0.2);
    x.strokeStyle = '#3F6A17'; x.lineWidth = 2; x.setLineDash([7, 7]);
    x.beginPath(); x.ellipse(w / 2, h / 2, rx, ry, 0, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 1.85 * again); x.stroke();
    x.setLineDash([]);
    const ang = -Math.PI * 0.5 + Math.PI * 1.85 * again;
    const hx = w / 2 + Math.cos(ang) * rx, hy = h / 2 + Math.sin(ang) * ry;
    const tx = -Math.sin(ang) * rx, ty = Math.cos(ang) * ry, tl = Math.hypot(tx, ty) || 1;
    const ux = tx / tl, uy = ty / tl;
    x.fillStyle = '#3F6A17'; x.beginPath();
    x.moveTo(hx + ux * 10, hy + uy * 10); x.lineTo(hx - uy * 6, hy + ux * 6); x.lineTo(hx + uy * 6, hy - ux * 6); x.closePath(); x.fill();
  }
}

function StageCanvas({ t, className = '' }: { t: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const fibres = makeFibres(220);
    const on = () => ref.current && draw(ref.current, fibres, t);
    on();
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, [t]);
  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

export function Journey() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (reduced !== false || !root.current || !canvas.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const fibres = makeFibres(window.innerWidth < 700 ? 260 : 460);
    let t = 0;
    const paint = () => canvas.current && draw(canvas.current, fibres, t);
    paint();
    const st = ScrollTrigger.create({
      trigger: root.current, start: 'top top', end: '+=320%', pin: true, scrub: true,
      onUpdate: (s) => {
        t = s.progress * 3.3 - 0.1;
        setStage(Math.min(3, Math.max(0, Math.round(s.progress * 3))));
        paint();
      },
    });
    window.addEventListener('resize', paint);
    return () => { st.kill(); window.removeEventListener('resize', paint); };
  }, [reduced]);

  // Reduced motion: the same four stages as a static, stacked sequence.
  if (reduced === true) {
    return (
      <section className="section bg-white" aria-labelledby="journey-title">
        <div className="wrap flex flex-col gap-10">
          <h2 id="journey-title" className="h2 max-w-[14ch]">From biomass to engineered panel</h2>
          <ol className="grid gap-6 md:grid-cols-2">
            {journey.map((j, i) => (
              <li key={j.key} className="card flex flex-col gap-3">
                <StageCanvas t={i} className="h-44 w-full rounded-2xl bg-white" />
                <h3 className="h3">{i + 1}. {j.title}</h3>
                <p className="text-grey-ink">{j.body}</p>
              </li>
            ))}
          </ol>
          <p className="caption">Conceptual visualisation of the material idea. It does not depict Lignitec&apos;s manufacturing process.</p>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="journey-title" className="bg-white">
      <div ref={root} className="relative flex h-[100svh] min-h-[600px] flex-col overflow-hidden">
        <div className="wrap flex flex-none items-end justify-between gap-6 pt-20 lg:pt-28">
          <h2 id="journey-title" className="h2 max-w-[14ch]">From biomass to engineered panel</h2>
          <ol className="hidden gap-2 md:flex" aria-hidden="true">
            {journey.map((j, i) => (
              <li key={j.key} className={`h-1.5 w-14 rounded-full transition-colors duration-300 ${i <= stage ? 'bg-green' : 'bg-line'}`} />
            ))}
          </ol>
        </div>
        <canvas ref={canvas} className="min-h-0 w-full flex-1" aria-hidden="true" />
        <div className="wrap relative flex-none pb-8 lg:pb-12">
          <ol className="relative min-h-[11.5rem] sm:min-h-[9rem]">
            {journey.map((j, i) => (
              <li key={j.key} className={`absolute inset-0 grid content-start gap-2 transition-all duration-500 md:grid-cols-[auto_1fr_1.2fr] md:items-baseline md:gap-8 ${i === stage ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}>
                <span className="text-sm font-semibold tabular-nums text-green-ink">{i + 1} / {journey.length}</span>
                <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">{j.title}</h3>
                <p className="max-w-[46ch] text-grey-ink">{j.body}</p>
              </li>
            ))}
          </ol>
          <p className="caption mt-3">Conceptual visualisation of the material idea. It does not depict Lignitec&apos;s manufacturing process.</p>
        </div>
      </div>
    </section>
  );
}
