import type { Metadata } from 'next';
import { CTA } from '@/components/CTA';
import { CineHero } from '@/components/CineHero';
import { IconTile } from '@/components/Icon';
import { company, milestones, principles } from '@/content/site';

export const metadata: Metadata = {
  title: 'About',
  description: 'Lignitec is a Delft-based company developing bio-based alternatives to conventional panel materials.',
  alternates: { canonical: '/about' },
};

export default function About() {
  return (
    <>
      <CineHero scene="about" kicker="About" title="Rethinking the materials we build with." lede="A Delft-based company developing bio-based alternatives to conventional panel materials." />

      <section className="section bg-white">
        <div className="wrap">
          <p className="max-w-[22ch] font-medium leading-[1.08] tracking-[-0.03em]" style={{ fontSize: 'clamp(2rem,5.4vw,4.4rem)' }}>
            Furniture and interiors are built from panels. <span className="text-grey">Most panels depend on synthetic binders.</span> <span className="text-green-ink">We think they don&apos;t have to.</span>
          </p>
        </div>
      </section>

      <section className="section bg-beige" aria-labelledby="story-title">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <h2 id="story-title" className="h2">The story so far</h2>
          <ol className="relative flex flex-col border-l-2 border-green pl-6 sm:pl-10">
            {milestones.map((m) => (
              <li key={m.title} className="relative flex flex-col gap-1 pb-10 last:pb-0">
                <span className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-2 border-green bg-beige sm:-left-[49px]" aria-hidden="true" />
                <span className="text-sm font-semibold text-green-ink">{m.when}</span>
                <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">{m.title}</h3>
                <p className="max-w-[48ch] text-grey-ink">{m.body}</p>
                {m.source && <a href={m.source} className="text-sm underline underline-offset-4">Source: YES!Delft</a>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="founders-title">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="flex flex-col gap-4">
            <h2 id="founders-title" className="h2">Founders</h2>
            <p className="text-grey-ink">Lignitec B.V. was founded in {company.founded} and is based at {company.address[0]} in Delft.</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {company.founders.map((f) => (
              <li key={f.name} className="card flex flex-col gap-5">
                {/* Portrait slot: replace with an approved photograph */}
                <span className="flex aspect-square w-24 items-center justify-center rounded-full bg-beige-tan text-2xl font-semibold" aria-hidden="true">{f.initials}</span>
                <div><h3 className="text-2xl font-medium tracking-tight">{f.name}</h3><p className="text-grey-ink">{f.role}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-beige" aria-labelledby="principles-title">
        <div className="wrap flex flex-col gap-10">
          <h2 id="principles-title" className="h2">Principles</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {principles.map((p) => (
              <li key={p.title} className="flex flex-col gap-3 rounded-3xl bg-white p-6">
                <IconTile name={p.icon} className="bg-green-soft" />
                <h3 className="h3">{p.title}</h3>
                <p className="text-[0.95rem] text-grey-ink">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="mission" className="section scroll-mt-20 bg-white" aria-labelledby="mission-title">
        <div className="wrap flex flex-col gap-6">
          <h2 id="mission-title" className="kicker">Mission</h2>
          <p className="max-w-[20ch] font-medium leading-[1.06] tracking-[-0.03em]" style={{ fontSize: 'clamp(2rem,5.4vw,4.4rem)' }}>
            Advance renewable, circular materials that can contribute to a more sustainable built environment.
          </p>
        </div>
      </section>

      <CTA title="Working on a material question of your own?" body="We're open to trials, joint development and research partnerships." label="Explore a collaboration" />
    </>
  );
}
