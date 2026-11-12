import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { company } from '@/content/site';

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: { default: 'Lignitec | Bio-based panel materials', template: '%s | Lignitec' },
  description: 'Lignitec develops bio-based panel materials using natural fibres and lignin-based binders, as alternatives to conventional fossil-bonded boards for furniture and construction.',
  openGraph: { type: 'website', siteName: 'Lignitec', locale: 'en_GB', images: ['/logo.png'] },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = { themeColor: '#F4EFE6' };

// Organisation data: verified properties only.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.legalName,
  url: company.url,
  email: company.email,
  telephone: company.phone,
  address: { '@type': 'PostalAddress', streetAddress: company.address[0], postalCode: '2629 JD', addressLocality: 'Delft', addressCountry: 'NL' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-charcoal focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
