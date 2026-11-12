import type { Metadata } from 'next';
import { PageHero } from '@/components/CTA';
import { ContactForm } from '@/components/ContactForm';
import { IconTile } from '@/components/Icon';
import { company } from '@/content/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Discuss a product, project or material requirement with Lignitec in Delft.',
  alternates: { canonical: '/contact' },
};

export default function Contact() {
  const rows = [
    { icon: 'mail', k: 'Email', v: <a className="underline underline-offset-4" href={`mailto:${company.email}`}>{company.email}</a> },
    { icon: 'phone', k: 'Phone', v: <a className="underline underline-offset-4" href={`tel:${company.phoneHref}`}>{company.phone}</a> },
    { icon: 'pin', k: 'Address', v: <address className="not-italic">{company.legalName}<br />{company.address.map((l) => <span key={l}>{l}<br /></span>)}</address> },
    { icon: 'doc', k: 'Registration', v: <>KVK {company.kvk}<br />BTW {company.vat}</> },
  ];
  return (
    <>
      <PageHero kicker="Contact" title="Let's build something better." lede="Have a product, project or material requirement in mind? Tell us what you're working on." />
      <section className="section bg-white">
        <div className="wrap grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <div className="flex flex-col gap-4">
            <ContactForm />
            <p className="text-sm text-grey-ink">Every enquiry is read by the Lignitec team. Technical questions are welcome at any stage.</p>
          </div>
          <ul className="flex flex-col gap-3">
            {rows.map((r) => (
              <li key={r.k} className="card flex gap-4"><IconTile name={r.icon} /><div><h2 className="font-semibold">{r.k}</h2><div className="text-grey-ink">{r.v}</div></div></li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
