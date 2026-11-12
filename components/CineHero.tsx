'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import type { FibreState } from './three/FibreStage';

const FibreStage = dynamic(() => import('./three/FibreStage'), { ssr: false });

/** One still from the fibre film per page, slowly turning. */
const SCENES: Record<string, FibreState> = {
  materials: { assemble: 1, split: 0, bind: 0, density: 1, layered: 0, angle: -0.6, elev: 0.5, dist: 8.4 },
  applications: { assemble: 0.56, split: 0, bind: 0.3, density: 1, layered: 1, angle: 0.2, elev: 0.3, dist: 9 },
  science: { assemble: 1, split: 0.7, bind: 0, density: 1, layered: 1, angle: 0.8, elev: 0.36, dist: 8.6 },
  about: { assemble: 0, split: 0, bind: 0, density: 1, layered: 1, angle: -0.4, elev: 0.2, dist: 11 },
  contact: { assemble: 1, split: 0, bind: 0, density: 1, layered: 1, angle: 1.1, elev: 0.6, dist: 9.6 },
  lost: { assemble: 0.3, split: 0, bind: 0, density: 1, layered: 1, angle: 0, elev: 0.25, dist: 10 },
};

export function CineHero({ scene, kicker, title, lede, children }: { scene: keyof typeof SCENES; kicker?: string; title: string; lede: string; children?: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const state = useRef<FibreState>({ ...SCENES[scene] });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!root.current) return;
    const io = new IntersectionObserver((e) => setActive(e[0].isIntersecting));
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced !== false) return;
    const t = gsap.to(state.current, { angle: '+=6.283', duration: 140, repeat: -1, ease: 'none' });
    return () => { t.kill(); };
  }, [reduced]);

  const words = title.split(' ');
  const cut = Math.ceil(words.length / 2);
  const lines = [words.slice(0, cut).join(' '), words.slice(cut).join(' ')].filter(Boolean);

  return (
    <section ref={root} className="relative flex min-h-[78svh] flex-col justify-end overflow-hidden bg-[#131813] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_60%_38%,#2B3828_0%,#131813_70%)]" aria-hidden="true" />
      <div className="absolute inset-0 lg:left-[24%] lg:[mask-image:linear-gradient(to_right,transparent,black_22%)]">{reduced !== null && <FibreStage mode="film" state={state} animate={!reduced} active={active} />}</div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#131813] via-[#131813]/85 to-transparent" aria-hidden="true" />
      <div className="wrap relative flex flex-col gap-5 pb-12 pt-[42svh] sm:pb-16">
        {kicker && <p className="text-sm font-semibold text-green-light">{kicker}</p>}
        <h1 className="max-w-[15ch] font-medium leading-[0.98] tracking-[-0.035em]" style={{ fontSize: 'clamp(2.5rem, 7.4vw, 6.4rem)' }}>
          {lines.map((l, i) => <span key={i} className="line-mask"><span style={{ animationDelay: `${i * 0.12}s` }}>{l}</span></span>)}
        </h1>
        <p className="max-w-[42ch] text-white/75" style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.35rem)', lineHeight: 1.45 }}>{lede}</p>
        {children}
      </div>
      <p className="absolute right-5 top-28 max-w-[20ch] text-right text-[11px] leading-snug text-white/45 sm:right-8 lg:right-12">Conceptual visualisation.</p>
    </section>
  );
}
