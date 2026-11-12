import { mulberry } from './three/fibreTexture';

const INK = '#1F2420';

/** Schematic of fibres held at their crossings by binder. Generated deterministically. */
export function FibreNetwork({ dense = false }: { dense?: boolean }) {
  const r = mulberry(dense ? 5 : 9);
  const n = dense ? 56 : 30; // 1400 : 750
  const fibres = Array.from({ length: n }, () => {
    const x = 20 + r() * 560, y = 20 + r() * 260, a = (r() - 0.5) * 1.5, len = 90 + r() * 110;
    return { x1: x - Math.cos(a) * len / 2, y1: y - Math.sin(a) * len / 2, x2: x + Math.cos(a) * len / 2, y2: y + Math.sin(a) * len / 2, c: r() };
  });
  const nodes: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const a = fibres[i], b = fibres[j];
    const d = (a.x1 - a.x2) * (b.y1 - b.y2) - (a.y1 - a.y2) * (b.x1 - b.x2);
    if (Math.abs(d) < 1e-6) continue;
    const t = ((a.x1 - b.x1) * (b.y1 - b.y2) - (a.y1 - b.y1) * (b.x1 - b.x2)) / d;
    const u = -((a.x1 - a.x2) * (a.y1 - b.y1) - (a.y1 - a.y2) * (a.x1 - b.x1)) / d;
    if (t > 0.05 && t < 0.95 && u > 0.05 && u < 0.95) nodes.push({ x: a.x1 + t * (a.x2 - a.x1), y: a.y1 + t * (a.y2 - a.y1) });
  }
  return (
    <svg viewBox="0 0 600 300" className="w-full rounded-2xl bg-white" role="img" aria-label={`Schematic: ${dense ? 'densely' : 'loosely'} packed fibres, with binder shown as green points where fibres cross.`}>
      <defs><clipPath id={`clip-${dense}`}><rect width="600" height="300" rx="16" /></clipPath></defs>
      <g clipPath={`url(#clip-${dense})`}>
        {fibres.map((f, i) => <line key={i} {...{ x1: f.x1, y1: f.y1, x2: f.x2, y2: f.y2 }} stroke={f.c < 0.6 ? '#C4AE87' : f.c < 0.85 ? '#A99168' : '#8A8A88'} strokeWidth={dense ? 5 : 6} strokeLinecap="round" />)}
        {nodes.slice(0, dense ? 260 : 70).map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={dense ? 3.4 : 4.2} fill="#629A22" />)}
      </g>
    </svg>
  );
}

/** The two published densities on one linear axis. */
export function DensityScale() {
  const max = 1600, x = (v: number) => 40 + (v / max) * 720;
  return (
    <svg viewBox="0 0 800 210" className="w-full" role="img" aria-label="Density scale from 0 to 1,600 kilograms per cubic metre. Lignitec MD at 750. Lignitec HD and HD Waterproof at 1,400.">
      <line x1={x(0)} y1="130" x2={x(max)} y2="130" stroke={INK} strokeWidth="2" />
      {[0, 400, 800, 1200, 1600].map((v) => (
        <g key={v}><line x1={x(v)} y1="124" x2={x(v)} y2="136" stroke={INK} strokeWidth="2" />
          <text x={x(v)} y="160" textAnchor="middle" fontSize="15" fill="#565A56">{v.toLocaleString('en-GB')}</text></g>
      ))}
      <text x={x(max)} y="184" textAnchor="end" fontSize="13" fill="#565A56">kg/m³</text>
      <rect x={x(0)} y="118" width={x(750) - x(0)} height="12" fill="#B9DB92" />
      <rect x={x(750)} y="118" width={x(1400) - x(750)} height="12" fill="#629A22" />
      {[{ v: 750, a: 'Lignitec MD', b: '750' }, { v: 1400, a: 'HD and HD Waterproof', b: '1,400' }].map((m) => (
        <g key={m.v}>
          <line x1={x(m.v)} y1="70" x2={x(m.v)} y2="130" stroke={INK} strokeWidth="2" />
          <circle cx={x(m.v)} cy="130" r="7" fill="#fff" stroke={INK} strokeWidth="2" />
          <text x={x(m.v)} y="34" textAnchor="middle" fontSize="30" fontWeight="500" fill={INK}>{m.b}</text>
          <text x={x(m.v)} y="58" textAnchor="middle" fontSize="15" fill="#565A56">{m.a}</text>
        </g>
      ))}
    </svg>
  );
}

/** Lignin's role in wood, as a simple cell-wall schematic (general wood science). */
export function LigninDiagram() {
  return (
    <svg viewBox="0 0 600 300" className="w-full rounded-2xl bg-white" role="img" aria-label="Schematic of wood: cellulose fibres drawn as parallel strands, surrounded by lignin drawn as a green matrix that holds them together.">
      <rect x="40" y="40" width="520" height="180" rx="18" fill="#DDEBC8" />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <rect x="64" y={58 + i * 25} width="472" height="13" rx="6.5" fill="#C4AE87" />
          {Array.from({ length: 9 }, (_, j) => <line key={j} x1={100 + j * 50} y1={58 + i * 25} x2={112 + j * 50} y2={71 + i * 25} stroke="#A99168" strokeWidth="2" />)}
        </g>
      ))}
      <g fontSize="15" fill={INK}>
        <line x1="150" y1="64" x2="150" y2="252" stroke={INK} strokeWidth="1.5" /><text x="158" y="262">Cellulose fibres</text>
        <line x1="420" y1="78" x2="420" y2="252" stroke={INK} strokeWidth="1.5" /><circle cx="420" cy="78" r="4" fill="#3F6A17" /><text x="428" y="262" fill="#3F6A17" fontWeight="600">Lignin</text>
      </g>
    </svg>
  );
}
