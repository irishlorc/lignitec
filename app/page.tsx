import Link from 'next/link';
import { Film } from '@/components/Film';
import { ScrubText } from '@/components/ScrubText';
import { ProductExplorer } from '@/components/ProductExplorer';
import { Showcase } from '@/components/Showcase';
import { CTA } from '@/components/CTA';
import { IconTile } from '@/components/Icon';
import { company } from '@/content/site';

const why = [
  { icon: 'fibre', title: 'Renewable feedstocks', body: 'Paulownia and wood fibres, lignin-based binders and by-streams.' },
  { icon: 'gauge', title: 'Performance ambitions', body: 'Developed for machinability, stiffness and finishable surfaces.' },
  { icon: 'loop', title: 'Circular by design', body: 'Developed to be recycled and re-formed. Ask us for the evidence.' },
  { icon: 'people', title: 'Built in collaboration', body: 'Suitability is tested with you, one application at a time.' },
];

export default function Home() {
  return (
    <>
      <Film />

      <section className="bg-white py-24 sm:py-36 lg:py-48">
        <div className="wrap flex flex-col gap-10">
          <ScrubText className="max-w-[20ch] font-medium leading-[1.04] tracking-[-0.035em] [font-size:clamp(2.2rem,6.6vw,6rem)]"
            parts={[{ text: "Most boards can't be taken apart again." }, { text: 'Synthetic adhesives bind fibre and resin for good.', tone: 'grey' }, { text: 'We bind with lignin instead.', tone: 'green' }]} />
          <Link href="/science" className="btn self-start">See the science</Link>
        </div>
      </section>

      <ProductExplorer />
      <Showcase compact />

      <section className="section bg-beige">
        <div className="wrap flex flex-col gap-10">
          <h2 className="h2 max-w-[14ch]">Why the material matters</h2>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
            {why.map((w) => (
              <li key={w.title} className="flex flex-col gap-3 rounded-3xl bg-white p-5 sm:p-6">
                <IconTile name={w.icon} className="bg-green-soft" />
                <h3 className="text-lg font-semibold leading-tight">{w.title}</h3>
                <p className="text-[0.95rem] text-grey-ink">{w.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-white">
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-5">
            <h2 className="h2 max-w-[12ch]">Material development in Delft</h2>
            <p className="lede">Founded in {company.founded} by {company.founders[0].name} and {company.founders[1].name}.</p>
            <Link href="/about" className="btn self-start">Read the story</Link>
          </div>
          <dl className="grid grid-cols-2 gap-x-6">
            {[['Based in', 'Delft, the Netherlands'], ['Founded', company.founded], ['Community', 'YES!Delft'], ['Materials', 'MD, HD, HD Waterproof']].map(([k, v]) => (
              <div key={k} className="border-t border-charcoal/15 py-5"><dt className="text-sm text-grey-ink">{k}</dt><dd className="text-xl font-medium tracking-tight sm:text-2xl">{v}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <CTA title="Exploring a new material for your product?" body="Tell us the application. We'll point you to a material and what would need testing." />
    </>
  );
}
