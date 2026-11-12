'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { scenes } from '@/content/site';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { Icon } from './Icon';
import { FitoutScene, FurnitureScene, KitchenScene, WetScene } from './scenes';

const art = { furniture: FurnitureScene, kitchen: KitchenScene, fitout: FitoutScene, wet: WetScene };

export function Showcase({ compact = false }: { compact?: boolean }) {
  const [sceneId, setSceneId] = useState(scenes[0].id);
  const [spot, setSpot] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const scene = scenes.find((s) => s.id === sceneId)!;
  const Art = art[scene.id];
  const active = scene.hotspots[spot];

  useEffect(() => { setSpot(0); }, [sceneId]);

  // Scene change: the drawing settles in, then the hotspots arrive one by one.
  useEffect(() => {
    if (reduced !== false || !frame.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-art]', { scale: 1.06, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo('[data-spot]', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4, stagger: 0.12, delay: 0.35, ease: 'back.out(2)' });
    }, frame);
    return () => ctx.revert();
  }, [sceneId, reduced]);

  return (
    <section className={compact ? 'section bg-white' : 'bg-white pb-16 pt-10 sm:pb-24'} aria-labelledby="showcase-title">
      <div className="wrap flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 id="showcase-title" className="h2 max-w-[16ch]">{compact ? 'Where the panels are intended to go' : 'Explore by application'}</h2>
          <p className="lede">Choose a setting, then select a marker to see which material is intended there.</p>
        </div>

        <div role="tablist" aria-label="Applications" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
          {scenes.map((s) => (
            <button key={s.id} role="tab" type="button" aria-selected={s.id === sceneId} onClick={() => setSceneId(s.id)}
              className="min-h-[46px] flex-none rounded-full border border-charcoal/15 px-5 text-[0.95rem] font-semibold transition-colors aria-selected:border-charcoal aria-selected:bg-charcoal aria-selected:text-white">
              {s.nav}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr] lg:gap-8">
          <div className="flex flex-col gap-3">
            <div ref={frame} className="relative aspect-[12/7] overflow-hidden rounded-3xl bg-beige sm:rounded-panel">
              <div data-art className="absolute inset-0"><Art /></div>
              {scene.hotspots.map((h, i) => (
                <button key={h.id} data-spot type="button" onClick={() => setSpot(i)} aria-pressed={i === spot} aria-label={`${h.label}: ${h.material}`}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  className="absolute -ml-[22px] -mt-[22px] flex h-11 w-11 items-center justify-center rounded-full">
                  <span className={`absolute inset-1.5 rounded-full ${i === spot ? 'hidden' : 'animate-pulse2 bg-green'}`} aria-hidden="true" />
                  <span className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-md transition-colors ${i === spot ? 'bg-charcoal text-white' : 'bg-green text-charcoal'}`}>
                    <span className="text-sm font-bold">{i + 1}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="caption">Illustrative drawing. Not an installed Lignitec project.</p>
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
                      <span className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-sm font-bold ${i === spot ? 'bg-charcoal text-white' : 'bg-green text-charcoal'}`}>{i + 1}</span>
                      <span className="flex-1 font-semibold">{h.label}</span>
                      <span className="chip">{h.material}</span>
                    </span>
                    {i === spot && <span className="pl-10 text-[0.95rem] text-grey-ink">{h.body}</span>}
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
