import type { Metadata } from 'next';
import Link from 'next/link';
import { CTA } from '@/components/CTA';
import { CineHero } from '@/components/CineHero';
import { Showcase } from '@/components/Showcase';

export const metadata: Metadata = {
  title: 'Applications',
  description: 'Where Lignitec panels are intended to be used: furniture, kitchens, interior fit-out and moisture-exposed applications.',
  alternates: { canonical: '/applications' },
};

const finder = [
  { href: '/materials#md', need: 'Dry interiors, general use', pick: 'Lignitec MD', spec: '750 kg/m³' },
  { href: '/materials#hd', need: 'Higher demands on stiffness and surface', pick: 'Lignitec HD', spec: '1,400 kg/m³' },
  { href: '/materials#hd-waterproof', need: 'Moisture is part of the brief', pick: 'Lignitec HD Waterproof', spec: '1,400 kg/m³, verified per project' },
];

export default function Applications() {
  return (
    <>
      <CineHero scene="applications" kicker="Applications" title="New materials for the things we build." lede="Bio-based panels developed around practical application requirements, from cabinetry to moisture-exposed environments." />
      <Showcase />
      <section className="section bg-beige" aria-labelledby="finder-title">
        <div className="wrap flex flex-col gap-8">
          <h2 id="finder-title" className="h2">Find the right material</h2>
          <ul className="grid gap-3 md:grid-cols-3">
            {finder.map((f) => (
              <li key={f.href}>
                <Link href={f.href} className="group flex h-full flex-col gap-2 rounded-3xl bg-white p-6 transition-colors hover:bg-green-soft">
                  <span className="text-sm text-grey-ink">{f.need}</span>
                  <span className="text-2xl font-medium tracking-tight">{f.pick}</span>
                  <span className="mt-auto pt-4 text-sm tabular-nums text-grey-ink">{f.spec}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CTA title="Have a particular application in mind?" body="If it isn't shown here, that doesn't rule it out. Tell us what you're building." />
    </>
  );
}
