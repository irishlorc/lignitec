'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { LayerPoster } from './LayerPoster';

const PanelCanvas = dynamic(() => import('./three/PanelCanvas'), { ssr: false });

const legend = [
  { color: '#D9C7A9', label: 'Natural fibres', note: 'Paulownia or wood' },
  { color: '#6FA52F', label: 'Lignin-based binder', note: 'In place of fossil-based adhesive' },
  { color: '#8A8A88', label: 'By-stream feedstocks', note: 'Agriculture, horticulture, industry' },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduced !== false || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: '+=170%', pin: true, scrub: 0.4,
          onUpdate: (s) => { progress.current = s.progress; },
          onToggle: (s) => setInView(s.isActive || s.progress < 1),
        },
      });
      tl.to('[data-hero-copy]', { autoAlpha: 0, y: -40, duration: 0.25 }, 0.08)
        .fromTo('[data-hero-legend] li', { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, stagger: 0.06, duration: 0.2 }, 0.28)
        .to('[data-hero-legend] li', { autoAlpha: 0, x: -20, stagger: 0.03, duration: 0.15 }, 0.72)
        .fromTo('[data-hero-close]', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.18 }, 0.82);
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const staticMode = reduced === true;

  return (
    <section ref={root} className="relative h-[100svh] min-h-[620px] overflow-hidden bg-gradient-to-b from-beige via-beige to-white" aria-label="Introduction">
      <p className="sr-only">Visualisation: a panel separates into three layers representing natural fibres, a lignin-based binder and by-stream feedstocks, then reassembles into one panel.</p>
      <div className="absolute inset-x-0 top-[10%] h-[44%] sm:top-[8%] sm:h-[56%] lg:inset-y-0 lg:left-[40%] lg:top-0 lg:h-full">
        {!ready && <LayerPoster className="absolute left-1/2 top-1/2 w-[86%] max-w-[760px] -translate-x-1/2 -translate-y-1/2" />}
        {reduced !== null && <PanelCanvas mode="hero" progress={progress} animate={!staticMode && inView} onReady={() => setReady(true)} />}
      </div>

      <div data-hero-copy className="wrap relative flex h-full flex-col justify-end gap-4 pb-8 sm:gap-5 sm:pb-14 lg:justify-center lg:pb-0 lg:pt-20">
        <p className="kicker">Bio-based material innovation</p>
        <h1 className="whitespace-nowrap font-medium leading-[1.02] tracking-[-0.035em]" style={{ fontSize: 'clamp(2.1rem, 5.2vw, 5.4rem)' }}>
          <span className="line-mask"><span>A new generation</span></span>
          <span className="line-mask"><span style={{ animationDelay: '.12s' }}>of materials.</span></span>
          <span className="line-mask text-green-ink"><span style={{ animationDelay: '.24s' }}>Made from nature.</span></span>
        </h1>
        <p className="lede max-w-[34ch]">Bio-based panels from natural fibres and lignin-based binders, for furniture and construction.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/materials" className="btn btn-primary">Explore our materials</Link>
          <Link href="/contact" className="btn bg-white/70">Discuss your application</Link>
        </div>
      </div>

      <ul data-hero-legend className={`absolute bottom-6 left-5 right-5 flex flex-col gap-2 sm:left-8 lg:bottom-auto lg:left-12 lg:right-auto lg:top-1/2 lg:w-[300px] lg:-translate-y-1/2 lg:gap-3 ${staticMode ? 'hidden' : ''}`}>
        {legend.map((l) => (
          <li key={l.label} className="invisible flex items-center gap-3 rounded-2xl bg-white/85 px-4 py-3 backdrop-blur">
            <span className="h-4 w-4 flex-none rounded-[5px]" style={{ background: l.color }} aria-hidden="true" />
            <span className="flex flex-col leading-tight"><b className="font-semibold">{l.label}</b><span className="text-sm text-grey-ink">{l.note}</span></span>
          </li>
        ))}
      </ul>

      <div data-hero-close className={`wrap invisible absolute inset-x-0 bottom-10 flex flex-col gap-2 lg:bottom-16 ${staticMode ? 'hidden' : ''}`}>
        <p className="h2 max-w-[14ch]">Three inputs. One engineered panel.</p>
      </div>

      <p className="caption absolute right-5 top-[5.5rem] max-w-[24ch] text-right sm:right-8 lg:bottom-6 lg:right-12 lg:top-auto">Conceptual visualisation. Not a cross-section of the product.</p>
      {reduced === false && <span className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 text-xs font-medium text-grey-ink lg:block" aria-hidden="true">Scroll to take it apart</span>}
    </section>
  );
}
