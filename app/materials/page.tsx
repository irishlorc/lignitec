import type { Metadata } from 'next';
import { CTA } from '@/components/CTA';
import { CineHero } from '@/components/CineHero';
import { ProductExplorer } from '@/components/ProductExplorer';
import { IconTile } from '@/components/Icon';
import { products, published } from '@/content/site';

export const metadata: Metadata = {
  title: 'Materials',
  description: 'Lignitec MD, HD and HD Waterproof: three bio-based panel materials at published densities of 750 and 1,400 kg/m³.',
  alternates: { canonical: '/materials' },
};

const steps = [
  { icon: 'mail', title: 'Tell us the application', body: 'What you make, where the panel sits and the conditions it faces.' },
  { icon: 'doc', title: 'Set the requirements', body: 'Processing, finish, moisture, loads and any standards you must meet.' },
  { icon: 'flask', title: 'Agree how to evaluate', body: 'Which material fits, and what testing or samples would be needed, where available.' },
];

export default function Materials() {
  return (
    <>
      <CineHero scene="materials" kicker="Materials" title="Engineered for performance. Designed for circularity." lede="Three bio-based panel materials for different densities, finishing requirements and environments." />
      <ProductExplorer heading={false} />

      <section className="section bg-white" aria-labelledby="compare-title">
        <div className="wrap flex flex-col gap-8">
          <h2 id="compare-title" className="h2">Compare the three</h2>
          {/* cards on phones, table from md up: no horizontal scrolling */}
          <div className="grid gap-3 md:hidden">
            {products.map((p) => (
              <div key={p.id} className="card flex flex-col gap-1">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-3xl font-medium tabular-nums tracking-tight">{p.density.toLocaleString('en-GB')} <span className="text-sm font-normal text-grey-ink">kg/m³</span></p>
                <p className="text-sm text-grey-ink">{p.base}</p>
                <p className="text-sm">{p.applications}</p>
              </div>
            ))}
          </div>
          <table className="hidden w-full text-left text-[0.95rem] md:table">
            <thead><tr className="border-b-2 border-charcoal text-sm text-grey-ink">{['Material', 'Base fibres', 'Published density', 'Intended applications', 'Design focus'].map((h) => <th key={h} scope="col" className="py-3 pr-6 font-semibold">{h}</th>)}</tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line align-top">
                  <th scope="row" className="py-4 pr-6 font-semibold">{p.short}</th>
                  <td className="py-4 pr-6">{p.base}</td>
                  <td className="whitespace-nowrap py-4 pr-6 tabular-nums">{p.density.toLocaleString('en-GB')} kg/m³</td>
                  <td className="py-4 pr-6">{p.applications}</td>
                  <td className="py-4">{p.focus.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section bg-beige" aria-labelledby="tech-title">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="flex flex-col gap-4">
            <h2 id="tech-title" className="h2">What is published, and what to ask for</h2>
            <p className="text-grey-ink">This site states only what Lignitec has published. Everything else is discussed against your requirements.</p>
          </div>
          <ul className="flex flex-col">
            {published.map((r) => (
              <li key={r.topic} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-t border-charcoal/10 py-3.5">
                <span className="font-medium">{r.topic}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${r.status === 'Published' ? 'bg-green text-charcoal' : 'bg-white text-grey-ink'}`}>{r.status}</span>
                {r.detail && <span className="col-span-2 text-sm text-grey-ink">{r.detail}</span>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="flow-title">
        <div className="wrap flex flex-col gap-10">
          <h2 id="flow-title" className="h2">From concept to application</h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="card flex flex-col gap-3">
                <div className="flex items-center justify-between"><IconTile name={s.icon} /><span className="text-sm font-semibold tabular-nums text-grey-ink">Step {i + 1}</span></div>
                <h3 className="h3">{s.title}</h3>
                <p className="text-[0.95rem] text-grey-ink">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTA title="Not sure which material fits?" body="Describe the product and the conditions. We'll be clear about what still needs verifying." label="Talk to us about suitability" />
    </>
  );
}
