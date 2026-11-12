'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nav } from '@/content/site';

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    const on = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', on);
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { window.removeEventListener('keydown', on); document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Remove this strip once Lignitec approves the site */}
      <p className="bg-charcoal py-1 text-center text-[11px] font-medium text-white">Redesign concept. Not Lignitec&apos;s official website.</p>
      <div className={`mx-3 mt-2 flex h-14 max-w-site items-center gap-8 rounded-full bg-white/90 pl-5 pr-2 shadow-[0_2px_20px_rgba(0,0,0,.08)] backdrop-blur-md transition-shadow sm:mx-6 lg:mx-auto lg:h-16 lg:w-[calc(100%-6rem)] lg:pl-7 ${scrolled ? 'shadow-[0_4px_28px_rgba(0,0,0,.14)]' : ''}`}>
        <Link href="/" className="flex-none" aria-label="Lignitec home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Lignitec" width={900} height={179} className="h-7 w-auto lg:h-8" />
        </Link>
        <nav aria-label="Main" className="ml-auto hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} aria-current={path.startsWith(n.href) ? 'page' : undefined}
              className="border-b-2 border-transparent py-2 text-[0.95rem] font-medium hover:border-line aria-[current=page]:border-green aria-[current=page]:text-green-ink">
              {n.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-primary min-h-[44px] px-5 text-sm">Discuss your application</Link>
        </nav>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav"
          className="ml-auto inline-flex h-10 items-center rounded-full bg-charcoal px-5 text-sm font-semibold text-white lg:hidden">
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Main" className="mx-3 mt-2 max-h-[calc(100svh-7rem)] overflow-y-auto rounded-3xl bg-white shadow-xl sm:mx-6 lg:hidden">
          <div className="flex flex-col px-6 pb-6 pt-2">
            {[{ href: '/', label: 'Home' }, ...nav, { href: '/contact', label: 'Contact' }].map((n) => (
              <Link key={n.href} href={n.href} className="border-b border-line py-4 text-3xl font-medium tracking-tight">{n.label}</Link>
            ))}
            <Link href="/contact" className="btn btn-primary mt-8">Discuss your application</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
