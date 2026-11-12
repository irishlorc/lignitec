'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/useReducedMotion';

/** A statement whose words come into focus as it is scrolled through. Fully visible without motion. */
export function ScrubText({ parts, className = '' }: { parts: { text: string; tone?: 'grey' | 'green' }[]; className?: string }) {
  const el = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced !== false || !el.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-w]', { opacity: 0.14 }, { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: el.current, start: 'top 82%', end: 'bottom 48%', scrub: true } });
    }, el);
    return () => ctx.revert();
  }, [reduced]);
  return (
    <p ref={el} className={className}>
      {parts.map((p, i) => p.text.split(' ').map((w, j) => (
        <span key={`${i}-${j}`} data-w className={p.tone === 'grey' ? 'text-grey' : p.tone === 'green' ? 'text-green-ink' : ''}>{w} </span>
      )))}
    </p>
  );
}
