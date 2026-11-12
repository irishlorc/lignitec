import type { Metadata } from 'next';
import { CTA } from '@/components/CTA';
import { CineHero } from '@/components/CineHero';
import { DensityScale, FibreNetwork, LigninDiagram } from '@/components/diagrams';
import { LayerPoster } from '@/components/LayerPoster';
import { published } from '@/content/site';

export const metadata: Metadata = {
  title: 'Science',
  description: 'How Lignitec panels work: natural fibres, lignin-based binders, density as an engineering variable, and what has been published.',
  alternates: { canonical: '/science' },
};

function Block({ n, title, children, figure, flip = false }: { n: string; title: string; children: React.ReactNode; figure: React.ReactNode; flip?: boolean }) {
  return (
    <section className="section border-t border-line bg-white" aria-labelledby={`sci-${n}`}>
      <div className="wrap grid items-center gap-8 lg:grid-cols-2 lg:gap-20">
        <div className={`flex flex-col gap-5 ${flip ? 'lg:order-2' : ''}`}>
          <h2 id={`sci-${n}`} className="h2 max-w-[14ch]">{title}</h2>
          <div className="flex max-w-[52ch] flex-col gap-4 text-lg text-grey-ink">{children}</div>
        </div>
        <figure className="flex flex-col gap-3 rounded-panel bg-beige p-4 sm:p-8">{figure}</figure>
      </div>
    </section>
  );
}

export default function Science() {
  return (
    <>
      <CineHero scene="science" kicker="The science" title="A panel is fibre plus whatever holds it together." lede="Lignitec changes the second part. Here is the reasoning, and exactly what has been published so far." />

      <Block n="1" title="Lignin already binds wood" figure={<><LigninDiagram /><figcaption className="caption">Schematic of wood structure. General wood science, not a Lignitec measurement.</figcaption></>}>
        <p>In a tree, cellulose fibres are held in a matrix of lignin, the natural polymer that gives wood its rigidity.</p>
        <p>Lignitec uses lignin-based binders to do the same job in a panel, as its alternative to fossil-based adhesives.</p>
      </Block>

      <Block n="2" flip title="Three inputs, one panel" figure={<><LayerPoster className="w-full" /><ul className="grid gap-2 text-sm sm:grid-cols-3">{[['#D9C7A9', 'Natural fibres'], ['#6FA52F', 'Lignin-based binder'], ['#8A8A88', 'By-stream feedstocks']].map(([c, l]) => <li key={l} className="flex items-center gap-2 font-medium"><span className="h-3.5 w-3.5 rounded" style={{ background: c }} aria-hidden="true" />{l}</li>)}</ul><figcaption className="caption">Conceptual diagram of the inputs. Not a cross-section of the product.</figcaption></>}>
        <p>Paulownia or wood fibres give the panel its body. A lignin-based binder holds them. By-streams from agriculture, horticulture and industry are put to use as feedstock.</p>
        <p>Lignitec has not published proportions, and none are shown here.</p>
      </Block>

      <Block n="3" title="Density is the engineering variable" figure={<><div className="grid gap-3 sm:grid-cols-2"><div className="flex flex-col gap-2"><FibreNetwork /><span className="text-sm font-medium">750 kg/m³</span></div><div className="flex flex-col gap-2"><FibreNetwork dense /><span className="text-sm font-medium">1,400 kg/m³</span></div></div><figcaption className="caption">Schematic. Fibre count is drawn in proportion to published density, with binder shown where fibres cross. Not a micrograph.</figcaption></>}>
        <p>The same idea is made at two densities. Pack more fibre into the same volume and the panel becomes heavier and, by design intent, stiffer with a closer surface.</p>
        <p>MD is the balanced option. HD and HD Waterproof are developed for more demanding uses.</p>
      </Block>

      <section className="section bg-beige" aria-labelledby="sci-scale">
        <div className="wrap flex flex-col gap-8">
          <h2 id="sci-scale" className="h2">The published densities</h2>
          <div className="rounded-panel bg-white p-4 sm:p-10"><DensityScale /></div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="sci-verified">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="flex flex-col gap-4">
            <h2 id="sci-verified" className="h2">What has been published</h2>
            <p className="text-grey-ink">No test results, certifications or environmental figures are stated on this site. Where a value has not been published, it is marked as available on enquiry.</p>
          </div>
          <ul className="flex flex-col">
            {published.map((r) => (
              <li key={r.topic} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-t border-charcoal/10 py-3.5">
                <span className="font-medium">{r.topic}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${r.status === 'Published' ? 'bg-green text-charcoal' : 'bg-beige text-grey-ink'}`}>{r.status}</span>
                {r.detail && <span className="col-span-2 text-sm text-grey-ink">{r.detail}</span>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTA title="Need data for a specific requirement?" body="Tell us the property and the standard. We'll tell you what exists and what would need testing." label="Ask a technical question" />
    </>
  );
}
