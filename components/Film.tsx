'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { journey } from '@/content/site';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { LayerPoster } from './LayerPoster';
import type { FibreState } from './three/FibreStage';

const FibreStage = dynamic(() => import('./three/FibreStage'), { ssr: false });

const legend = [
  { color: '#D9C7A9', label: 'Natural fibres' },
  { color: '#6FA52F', label: 'Lignin-based binder' },
  { color: '#9A9A98', label: 'By-stream feedstocks' },
];

// Five chapters after the title. Chapter 4 is the three-layer reveal.
const chapters = [
  journey[0], journey[1], journey[2],
  { key: 'layers', title: 'Three inputs. One engineered panel.', body: '' },
  journey[3],
];

const START: FibreState = { assemble: 0, split: 0, bind: 0, density: 1, layered: 1, angle: -0.55, elev: 0.2, dist: 13.5 };
const STILL: FibreState = { assemble: 1, split: 0.62, bind: 0, density: 1, layered: 1, angle: 0.7, elev: 0.42, dist: 8.2 };

export function Film() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const state = useRef<FibreState>({ ...START });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);

  // Layout effect: GSAP must unwrap its pin spacer before React removes the section on navigation.
  useLayoutEffect(() => {
    if (reduced === true) Object.assign(state.current, STILL);
    if (reduced !== false || !root.current || !pin.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const s = state.current;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: pin.current, start: 'top top', end: '+=520%', pin: pin.current, scrub: 0.6,
          onUpdate: (st) => { if (bar.current) bar.current.style.transform = `scaleX(${st.progress})`; },
          onToggle: (st) => setActive(st.isActive),
        },
      });
      const show = (sel: string, at: number, out: number | null) => {
        tl.fromTo(sel, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, at);
        if (out !== null) tl.to(sel, { autoAlpha: 0, y: -30, duration: 0.35, ease: 'power2.in' }, out);
      };
      // camera and material
      tl.to(s, { dist: 10, angle: -0.15, duration: 2 }, 0)
        .to(s, { bind: 1, duration: 0.6 }, 2)
        .to(s, { dist: 8.6, duration: 1.2 }, 2.05)
        .to(s, { assemble: 0.5, angle: 0.15, duration: 1.2 }, 2.05)
        .to(s, { assemble: 1, bind: 0.15, elev: 0.5, angle: 0.55, dist: 8, duration: 1.3 }, 3.25)
        .to(s, { split: 0.72, angle: 0.95, elev: 0.36, duration: 0.75 }, 4.6)
        .to(s, { split: 0, angle: 1.3, duration: 0.65 }, 5.45)
        .to(s, { assemble: 0.76, angle: 1.7, bind: 0.5, dist: 8.8, duration: 0.65 }, 6.15)
        .to(s, { assemble: 1, angle: 2.15, elev: 0.55, bind: 0, dist: 8, duration: 0.75 }, 6.8);
      // words
      tl.to('[data-title]', { autoAlpha: 0, y: -50, duration: 0.5, ease: 'power2.in' }, 0.35);
      show('[data-ch="0"]', 0.9, 1.75);
      show('[data-ch="1"]', 2.05, 3.05);
      show('[data-ch="2"]', 3.3, 4.35);
      show('[data-ch="3"]', 4.6, 5.9);
      show('[data-ch="4"]', 6.2, null);
      tl.to({}, { duration: 0.35 }); // hold the final frame
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const still = reduced === true;

  return (
    <>
      {/* The section belongs to React; only the inner div is pinned, so the pin spacer never sits between React and its node. */}
      <section ref={root} aria-label="Introduction" className="bg-[#131813] text-white">
      <div ref={pin} className="relative h-[100svh] min-h-[640px] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_42%,#2B3828_0%,#131813_70%)]" aria-hidden="true" />
        <p className="sr-only">Visualisation: thousands of loose fibres drift, gather and press into a three-layer panel, which separates into its inputs, reassembles, then breaks apart and re-forms.</p>
        <div className="absolute inset-0">
          {!ready && <LayerPoster className="absolute left-1/2 top-[42%] w-[80%] max-w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-60" />}
          {reduced !== null && <FibreStage mode="film" state={state} animate={!still} active={active} onReady={() => setReady(true)} />}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-[#131813] via-[#131813]/85 to-transparent" aria-hidden="true" />

        {/* title card */}
        <div data-title className="wrap absolute inset-x-0 bottom-0 flex flex-col gap-5 pb-12 sm:pb-16">
          <p className="text-sm font-semibold text-green-light">Bio-based material innovation</p>
          <h1 className="font-medium leading-[0.95] tracking-[-0.04em]" style={{ fontSize: 'clamp(2.9rem, 9.6vw, 9rem)' }}>
            <span className="line-mask"><span>A new generation</span></span>
            <span className="line-mask"><span style={{ animationDelay: '.1s' }}>of materials.</span></span>
            <span className="line-mask text-green-light"><span style={{ animationDelay: '.2s' }}>Made from nature.</span></span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link href="/materials" className="btn btn-primary border-green">Explore our materials</Link>
            <Link href="/contact" className="btn border-white/40 text-white hover:bg-white hover:text-charcoal">Discuss your application</Link>
          </div>
        </div>

        {/* chapters */}
        {!still && chapters.map((c, i) => (
          <div key={c.key} data-ch={i} className="wrap invisible absolute inset-x-0 bottom-0 flex flex-col gap-3 pb-14 sm:pb-20">
            <span className="text-sm font-semibold tabular-nums text-green-light">{i + 1} / {chapters.length}</span>
            <h2 className="max-w-[14ch] font-medium leading-[0.98] tracking-[-0.035em]" style={{ fontSize: 'clamp(2.3rem, 6.4vw, 5.6rem)' }}>{c.title}</h2>
            {c.body && <p className="max-w-[40ch] text-lg text-white/75">{c.body}</p>}
            {c.key === 'layers' && (
              <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                {legend.map((l) => <li key={l.label} className="flex items-center gap-2 text-base font-medium"><span className="h-3.5 w-3.5 rounded-[4px]" style={{ background: l.color }} aria-hidden="true" />{l.label}</li>)}
              </ul>
            )}
          </div>
        ))}

        <p className="absolute right-5 top-28 max-w-[22ch] text-right text-[11px] leading-snug text-white/50 sm:right-8 lg:right-12">Conceptual visualisation. Not a product cross-section or a manufacturing process.</p>
        {!still && <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10" aria-hidden="true"><div ref={bar} className="h-full origin-left scale-x-0 bg-green" /></div>}
      </div>
      </section>

      {/* Reduced motion: the same story as a static list */}
      {still && (
        <section className="bg-[#131813] pb-16 text-white" aria-label="From biomass to engineered panel">
          <ol className="wrap grid gap-8 md:grid-cols-2">
            {journey.map((j, i) => (
              <li key={j.key} className="flex flex-col gap-2 border-t border-white/20 pt-5">
                <span className="text-sm font-semibold text-green-light">{i + 1} / {journey.length}</span>
                <h2 className="text-3xl font-medium tracking-tight">{j.title}</h2>
                <p className="max-w-[44ch] text-white/75">{j.body}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
