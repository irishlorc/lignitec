import Link from 'next/link';

export function CTA({ title, body, label = 'Discuss your application' }: { title: string; body: string; label?: string }) {
  return (
    <section className="wrap pb-16 sm:pb-24">
      <div className="grid items-end gap-8 rounded-panel bg-green px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-4">
          <h2 className="h2 max-w-[18ch]">{title}</h2>
          <p className="max-w-[48ch] text-lg">{body}</p>
        </div>
        <Link href="/contact" className="btn btn-dark border-charcoal">{label}</Link>
      </div>
    </section>
  );
}

export function PageHero({ kicker, title, lede }: { kicker?: string; title: string; lede: string }) {
  const words = title.split(' ');
  // split the headline into two masked lines for the load reveal
  const cut = Math.ceil(words.length / 2);
  const lines = [words.slice(0, cut).join(' '), words.slice(cut).join(' ')].filter(Boolean);
  return (
    <section className="bg-beige pb-14 pt-32 sm:pb-20 lg:pt-44">
      <div className="wrap flex flex-col gap-6">
        {kicker && <p className="kicker">{kicker}</p>}
        <h1 className="display max-w-[14ch]">
          {lines.map((l, i) => (
            <span key={i} className="line-mask"><span style={{ animationDelay: `${i * 0.12}s` }}>{l}</span></span>
          ))}
        </h1>
        <p className="lede">{lede}</p>
      </div>
    </section>
  );
}
