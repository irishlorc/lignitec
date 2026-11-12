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
