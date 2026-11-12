'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { products, suitability, suitabilityLabel, type ProductId } from '@/content/site';
import gsap from 'gsap';
import { Icon } from './Icon';
import { useReducedMotion } from '@/lib/useReducedMotion';
import type { FibreState } from './three/FibreStage';

const FibreStage = dynamic(() => import('./three/FibreStage'), { ssr: false });

const SCALE_MAX = 1600;

export function ProductExplorer({ initial = 'md', heading = true }: { initial?: ProductId; heading?: boolean }) {
  const [id, setId] = useState<ProductId>(initial);
  const [show3d, setShow3d] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const fibre = useRef<FibreState>({ assemble: 1, split: 0, bind: 0, density: 750 / 1400, layered: 0, angle: -0.55, elev: 0.52, dist: 6.6 });
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; r: number } | null>(null);
  const p = products.find((x) => x.id === id)!;

  // Deep link: /materials#hd selects that material.
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.slice(1) as ProductId;
      if (products.some((x) => x.id === h)) setId(h);
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  // Load the 3D scene only when the explorer nears the viewport.
  useEffect(() => {
    if (!stage.current) return;
    const io = new IntersectionObserver((e) => e[0].isIntersecting && (setShow3d(true), io.disconnect()), { rootMargin: '300px' });
    const vis = new IntersectionObserver((e) => setVisible(e[0].isIntersecting));
    io.observe(stage.current); vis.observe(stage.current);
    return () => { io.disconnect(); vis.disconnect(); };
  }, []);

  // Fibres pack in or thin out to the published density of the selected material.
  useEffect(() => {
    const d = products.find((x) => x.id === id)!.density / 1400;
    if (reduced) { fibre.current.density = d; return; }
    const t = gsap.to(fibre.current, { density: d, duration: 1.1, ease: 'power2.inOut' });
    return () => { t.kill(); };
  }, [id, reduced]);

  const turn = (d: number) => { gsap.to(fibre.current, { angle: fibre.current.angle + d, duration: 0.5, ease: 'power2.out', overwrite: 'auto' }); };

  const onKeyTabs = (e: React.KeyboardEvent) => {
    const i = products.findIndex((x) => x.id === id);
    const next = e.key === 'ArrowRight' ? (i + 1) % 3 : e.key === 'ArrowLeft' ? (i + 2) % 3 : -1;
    if (next < 0) return;
    e.preventDefault();
    setId(products[next].id);
    document.getElementById(`tab-${products[next].id}`)?.focus();
  };

  return (
    <section className="section bg-beige" aria-labelledby={heading ? 'explorer-title' : undefined} id="explorer">
      <div className="wrap flex flex-col gap-10">
        {heading && (
          <div className="flex flex-col gap-4">
            <h2 id="explorer-title" className="h2 max-w-[16ch]">Three materials, two densities</h2>
            <p className="lede">Select a material to see what Lignitec has published about it.</p>
          </div>
        )}

        <div role="tablist" aria-label="Materials" onKeyDown={onKeyTabs} className="grid grid-cols-3 gap-1.5 rounded-full bg-white p-1.5 sm:self-start sm:gap-2">
          {products.map((x) => (
            <button key={x.id} id={`tab-${x.id}`} role="tab" type="button" aria-selected={x.id === id} aria-controls="explorer-panel" tabIndex={x.id === id ? 0 : -1}
              onClick={() => setId(x.id)}
              className="min-h-[46px] rounded-full px-3 text-sm font-semibold leading-tight transition-colors aria-selected:bg-charcoal aria-selected:text-white sm:px-6 sm:text-base">
              {x.short}
            </button>
          ))}
        </div>

        <div id="explorer-panel" role="tabpanel" aria-labelledby={`tab-${id}`} className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          <div className="flex flex-col gap-3">
            <div ref={stage} role="img" tabIndex={0}
              aria-label={`Illustrative 3D render of a ${p.name} panel, fibre density drawn in proportion to ${p.density} kilograms per cubic metre. Use left and right arrow keys to rotate.`}
              className="relative aspect-[4/3] cursor-grab touch-pan-y overflow-hidden rounded-panel bg-[#131813] text-white active:cursor-grabbing sm:aspect-[16/11]"
              onKeyDown={(e) => { if (e.key === 'ArrowLeft') turn(-0.35); if (e.key === 'ArrowRight') turn(0.35); }}
              onPointerDown={(e) => { drag.current = { x: e.clientX, r: fibre.current.angle }; (e.target as Element).setPointerCapture?.(e.pointerId); }}
              onPointerMove={(e) => { if (drag.current) fibre.current.angle = drag.current.r - (e.clientX - drag.current.x) * 0.008; }}
              onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,#2B3828_0%,#131813_72%)]" aria-hidden="true" />
              <div className="absolute inset-0">{show3d && reduced !== null && <FibreStage mode="explorer" state={fibre} animate={!reduced} active={visible} />}</div>
              <div className="pointer-events-none absolute left-5 top-5 flex flex-col">
                <span className="text-4xl font-medium tabular-nums tracking-tight sm:text-5xl">{p.density.toLocaleString('en-GB')}</span>
                <span className="text-sm text-white/70">kg/m³, published density</span>
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button type="button" onClick={() => turn(-0.5)} aria-label="Rotate left" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30"><Icon name="rotate" className="h-5 w-5" /></button>
                <button type="button" onClick={() => turn(0.5)} aria-label="Rotate right" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30"><Icon name="rotate" className="h-5 w-5 -scale-x-100" /></button>
              </div>
            </div>
            {/* density on a true linear scale */}
            <div className="rounded-3xl bg-white p-5">
              <div className="relative h-2.5 rounded-full bg-beige-deep">
                <div className="absolute inset-y-0 left-0 rounded-full bg-green transition-[width] duration-500" style={{ width: `${(p.density / SCALE_MAX) * 100}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs tabular-nums text-grey-ink"><span>0</span><span>400</span><span>800</span><span>1,200</span><span>1,600 kg/m³</span></div>
            </div>
            <p className="caption">Illustrative render. The number of fibres drawn follows published density. Colour, surface and thickness are not representative of the product.</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h3 className="text-3xl font-medium tracking-tight sm:text-4xl">{p.name}</h3>
              <p className="text-lg text-grey-ink">{p.line}</p>
            </div>

            <dl className="grid grid-cols-[8rem_1fr] gap-x-4 text-[0.95rem] sm:grid-cols-[10rem_1fr]">
              {[['Base fibres', p.base], ['Positioning', p.positioning], ...(p.extra ?? []).map((e) => [e.label, e.value])].map(([k, v]) => (
                <div key={k} className="col-span-2 grid grid-cols-subgrid border-t border-charcoal/10 py-3">
                  <dt className="text-grey-ink">{k}</dt><dd>{v}</dd>
                </div>
              ))}
            </dl>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-green-ink">Developed for</h4>
              <ul className="flex flex-wrap gap-2">{p.focus.map((f) => <li key={f} className="rounded-full bg-white px-3 py-1.5 text-sm font-medium">{f}</li>)}</ul>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-green-ink">Application suitability</h4>
              <ul className="flex flex-col">
                {suitability.map((s) => {
                  const v = s.by[id];
                  return (
                    <li key={s.area} className={`flex items-center gap-3 border-t border-charcoal/10 py-2.5 text-[0.95rem] ${v === 'none' ? 'text-grey-ink' : ''}`}>
                      <span className={`flex h-6 w-6 flex-none items-center justify-center rounded-full ${v === 'listed' ? 'bg-green text-charcoal' : v === 'verify' ? 'border-2 border-green text-green-ink' : 'bg-beige-deep text-grey-ink'}`}>
                        <Icon name={v === 'none' ? 'minus' : 'check'} className="h-4 w-4" />
                      </span>
                      <span className="flex-1">{s.area}</span>
                      <span className="text-right text-xs text-grey-ink">{suitabilityLabel[v]}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {p.caution && <p className="rounded-2xl bg-white p-4 text-sm leading-relaxed"><strong className="font-semibold">Note. </strong>{p.caution}</p>}

            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">Enquire about {p.short}</Link>
              {heading && <Link href={`/materials#${p.id}`} className="btn">Full material details</Link>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
