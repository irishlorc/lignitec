import Link from 'next/link';
import { company, nav } from '@/content/site';

export function Footer() {
  return (
    <footer className="bg-beige">
      <div className="wrap grid gap-10 py-14 text-[0.95rem] md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Lignitec" width={900} height={179} className="h-9 w-auto self-start" />
          <p className="max-w-[30ch] text-grey-ink">Bio-based panel materials from natural fibres and lignin-based binders.</p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-green-ink">Site</h2>
          <ul className="flex flex-col">
            {[...nav, { href: '/contact', label: 'Contact' }].map((n) => (
              <li key={n.href}><Link href={n.href} className="inline-block py-1.5 underline-offset-4 hover:underline">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-green-ink">Contact</h2>
          <ul className="flex flex-col gap-1.5">
            <li><a className="underline underline-offset-4" href={`mailto:${company.email}`}>{company.email}</a></li>
            <li><a className="underline underline-offset-4" href={`tel:${company.phoneHref}`}>{company.phone}</a></li>
            {company.address.map((l) => <li key={l}>{l}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-green-ink">Legal</h2>
          <ul className="flex flex-col gap-1.5">
            <li>{company.legalName}</li>
            <li>KVK {company.kvk}</li>
            <li>BTW {company.vat}</li>
          </ul>
        </div>
      </div>
      <div className="wrap border-t border-line py-5 text-xs text-grey-ink">
        Redesign concept built from publicly available information. Not an approved Lignitec publication.
      </div>
    </footer>
  );
}
