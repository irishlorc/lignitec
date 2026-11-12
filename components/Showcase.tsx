'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { scenes } from '@/content/site';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { Icon } from './Icon';

const Maquette = dynamic(() => import('./three/Maquette'), { ssr: false });

export function Showcase({ compact = false }: { compact?: boolean }) {
  const [sceneId, setSceneId] = useState(scenes[0].id);
  const [spot, setSpot] = useState(0);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const scene = scenes.find((s) => s.id === sceneId)!;
  const active = scene.hotspots[spot] ?? scene.hotspots[0];

  const pickScene = (id: typeof sceneId) => { setSceneId(id); setSpot(0); };

  useEffect(() => {
    if (!frame.current) return;
    const load = new IntersectionObserver((e) => e[0].isIntersecting && (setNear(true), load.disconnect()), { rootMargin: '500px' });
    const vis = new IntersectionObserver((e) => setVisible(e[0].isIntersecting));
    load.observe(frame.current); vis.observe(frame.current);
    return () => { load.disconnect(); vis.disconnect(); };
  }, []);

  return (
    <section className={compact ? 'section bg-white' : 'bg-white pb-16 pt-12 sm:pb-24'} aria-labelledby="showcase-title">
      <div className="wrap flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 id="showcase-title" className="h2 max-w-[16ch]">{compact ? 'Walk through where it goes' : 'Explore by application'}</h2>
          <p className="lede">Choose a setting. The model moves there and shows which material is intended for each part.</p>
        </div>

        <div role="tablist" aria-label="Applications" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
          {scenes.map((s) => (
            <button key={s.id} role="tab" type="button" aria-selected={s.id === sceneId} onClick={() => pickScene(s.id)}
              className="min-h-[46px] flex-none rounded-full border border-charcoal/15 px-5 text-[0.95rem] font-semibold transition-colors aria-selected:border-charcoal aria-selected:bg-charcoal aria-selected:text-white">
              {s.nav}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr] lg:gap-8">
          <div className="flex flex-col gap-3">
            <div ref={frame} role="img" aria-label={`Architectural model showing ${scene.title.toLowerCase()}. The highlighted part is ${active.label.toLowerCase()}, intended material ${active.material}.`}
              className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#EFE8DB] sm:aspect-[16/10] sm:rounded-panel">
              {near && reduced !== null && <Maquette scene={scene.id} part={active.id} hotspots={scene.hotspots.map((h) => h.id)} onPick={setSpot} animate={!reduced} active={visible} />}
              <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1.5 text-sm font-semibold backdrop-blur">{active.label}: {active.material}</div>
            </div>
            <p className="caption">Illustrative architectural model. Not an installed Lignitec project.</p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">{scene.title}</h3>
              <ul className="flex flex-wrap gap-1.5">{scene.materials.map((m) => <li key={m} className="chip">{m}</li>)}</ul>
              <p className="text-grey-ink">{scene.intro}</p>
            </div>

            <ol className="flex flex-col gap-2">
              {scene.hotspots.map((h, i) => (
                <li key={h.id}>
                  <button type="button" onClick={() => setSpot(i)} aria-expanded={i === spot}
                    className={`flex w-full flex-col gap-1 rounded-2xl p-4 text-left transition-colors ${i === spot ? 'bg-beige' : 'hover:bg-beige/60'}`}>
                    <span className="flex items-center gap-3">
                      <span className={`h-4 w-4 flex-none rounded-full border-2 border-white shadow ${i === spot ? 'bg-charcoal' : 'bg-green'}`} aria-hidden="true" />
                      <span className="flex-1 font-semibold">{h.label}</span>
                      <span className="chip">{h.material}</span>
                    </span>
                    {i === spot && <span className="pl-7 text-[0.95rem] text-grey-ink">{h.body}</span>}
                  </button>
                </li>
              ))}
            </ol>
            <span className="sr-only" aria-live="polite">{active.label}: {active.material}. {active.body}</span>

            {!compact && (
              <div className="rounded-2xl border border-line p-5">
                <h4 className="mb-2 text-sm font-semibold text-green-ink">What we&apos;d verify together</h4>
                <ul className="flex flex-col gap-1.5 text-[0.95rem]">
                  {scene.verify.map((v) => <li key={v} className="flex gap-2"><Icon name="check" className="mt-1 h-4 w-4 flex-none text-green-ink" />{v}</li>)}
                </ul>
              </div>
            )}
            <Link href={compact ? '/applications' : '/contact'} className="btn self-start">{compact ? 'See all applications' : 'Discuss this application'}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
