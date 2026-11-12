'use client';
import { useRef, useState } from 'react';
import { company } from '@/content/site';

type Errors = Partial<Record<'name' | 'email' | 'msg', string>>;
const field = 'min-h-[50px] w-full rounded-xl border-[1.5px] border-charcoal/35 bg-white px-4 py-3 text-base focus-visible:border-charcoal focus-visible:outline-green aria-[invalid=true]:border-red-700';

/**
 * Prototype form: validates, then prepares the enquiry as text. Nothing is sent.
 * To go live, post `values` to an approved endpoint in onSubmit and add consent wording.
 */
export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [out, setOut] = useState('');
  const [copied, setCopied] = useState('');
  const result = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLTextAreaElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const v = (k: string) => String(d.get(k) ?? '').trim();
    const er: Errors = {};
    if (!v('name')) er.name = 'Enter your name.';
    if (!v('email')) er.email = 'Enter your work email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email'))) er.email = 'Enter an email address in the format name@company.com.';
    if (!v('msg')) er.msg = "Tell us briefly what you're working on.";
    setErrors(er);
    const first = Object.keys(er)[0];
    if (first) { (e.currentTarget.elements.namedItem(first) as HTMLElement)?.focus(); return; }
    setOut(`To: ${company.email}\nSubject: ${v('type')} enquiry\n\n${v('msg')}\n\n${v('name')}${v('org') ? '\n' + v('org') : ''}\n${v('email')}`);
    setCopied('');
    setTimeout(() => result.current?.focus(), 0);
  }

  async function copy() {
    try { await navigator.clipboard.writeText(out); setCopied('Copied.'); }
    catch { area.current?.select(); setCopied('Text selected. Copy it from here.'); }
  }

  const err = (k: keyof Errors) => errors[k] && <span id={`e-${k}`} role="alert" className="text-sm font-medium text-red-700">{errors[k]}</span>;

  return (
    <div className="flex flex-col gap-6">
      <p className="rounded-2xl bg-beige p-4 text-sm leading-relaxed"><strong className="font-semibold">Prototype form. </strong>This concept has no mail endpoint, so nothing is sent. It prepares your enquiry as text to email to {company.email}.</p>
      <form onSubmit={onSubmit} noValidate className="grid gap-5">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Name
          <input name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby="e-name" />{err('name')}</label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Work email
          <input name="email" type="email" inputMode="email" autoComplete="email" className={field} aria-invalid={!!errors.email} aria-describedby="e-email" />{err('email')}</label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold"><span>Organisation <span className="font-normal text-grey-ink">(optional)</span></span>
          <input name="org" autoComplete="organization" className={field} /></label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Enquiry type
          <select name="type" className={field}><option>Material evaluation</option><option>Product application</option><option>R&amp;D collaboration</option><option>General</option></select></label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">Message
          <textarea name="msg" rows={6} className={field} aria-invalid={!!errors.msg} aria-describedby="e-msg h-msg" />
          <span id="h-msg" className="font-normal text-grey-ink">Useful to include: the product, where the panel sits in it and the conditions it faces.</span>{err('msg')}</label>
        <button type="submit" className="btn btn-primary justify-self-start">Prepare enquiry</button>
      </form>
      {out && (
        <div ref={result} tabIndex={-1} className="flex flex-col gap-3 rounded-3xl border-[1.5px] border-charcoal p-5">
          <h3 className="h3">Enquiry prepared, not sent</h3>
          <p className="text-sm">Copy the text and email it to <a className="underline" href={`mailto:${company.email}`}>{company.email}</a>.</p>
          <textarea ref={area} readOnly value={out} rows={8} aria-label="Your enquiry" className={field} />
          <div className="flex items-center gap-3"><button type="button" onClick={copy} className="btn min-h-[44px] px-5 text-sm">Copy enquiry</button><span role="status" className="text-sm text-grey-ink">{copied}</span></div>
        </div>
      )}
    </div>
  );
}
