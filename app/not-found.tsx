import Link from 'next/link';
import { CineHero } from '@/components/CineHero';

export default function NotFound() {
  return (
    <CineHero scene="lost" kicker="404" title="This page hasn't come together." lede="The address may have changed with the new site. These will get you back on track.">
      <div className="flex flex-wrap gap-3 pt-1">
        <Link href="/" className="btn btn-primary border-green">Go to the home page</Link>
        <Link href="/materials" className="btn border-white/40 text-white hover:bg-white hover:text-charcoal">Explore our materials</Link>
      </div>
    </CineHero>
  );
}
