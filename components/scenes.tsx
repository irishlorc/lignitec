/**
 * Architectural elevation drawings used in the application showcase.
 * These are illustrative concepts, not installed Lignitec projects. Each
 * scene component can be replaced with approved photography: keep the
 * 12:7 ratio and the hotspot coordinates in content/site.ts.
 */
const INK = '#1F2420', G = '#C9DDAF', T = '#E4D7BF', W = '#FFFFFF', F = '#D3C2A4';
const s = { stroke: INK, strokeWidth: 2, strokeLinejoin: 'round' as const };

function Room({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 1200 700" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <rect width="1200" height="700" fill="#F4EFE6" />
      <rect y="600" width="1200" height="100" fill={F} opacity=".55" />
      <line x1="0" y1="600" x2="1200" y2="600" {...s} />
      {children}
    </svg>
  );
}

export function FurnitureScene() {
  return (
    <Room>
      {/* sideboard */}
      <rect x="120" y="400" width="560" height="170" fill={G} {...s} />
      <rect x="110" y="386" width="580" height="16" fill={T} {...s} />
      {[260, 400, 540].map((x) => <line key={x} x1={x} y1="402" x2={x} y2="570" {...s} />)}
      {[240, 280, 520, 560].map((x) => <line key={x} x1={x} y1="470" x2={x} y2="500" {...s} strokeWidth={3} />)}
      {[150, 650].map((x) => <rect key={x} x={x - 6} y="570" width="12" height="30" fill={INK} />)}
      <circle cx="210" cy="356" r="30" fill={W} {...s} /><rect x="300" y="340" width="90" height="46" fill={W} {...s} />
      {/* shelving */}
      <rect x="780" y="130" width="300" height="470" fill={W} {...s} />
      {[224, 318, 412, 506].map((y) => <rect key={y} x="780" y={y} width="300" height="12" fill={G} {...s} />)}
      <line x1="930" y1="130" x2="930" y2="600" {...s} />
      {[[800, 170, 30, 54], [836, 184, 22, 40], [960, 262, 70, 56], [806, 366, 96, 46], [950, 440, 24, 66], [980, 452, 24, 54]].map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill={T} {...s} />)}
      {/* frame */}
      <rect x="430" y="150" width="190" height="150" fill={W} {...s} /><rect x="452" y="172" width="146" height="106" fill="none" {...s} strokeWidth={1.2} />
    </Room>
  );
}

export function KitchenScene() {
  return (
    <Room>
      {/* wall units */}
      <rect x="110" y="130" width="640" height="170" fill={G} {...s} />
      {[270, 430, 590].map((x) => <line key={x} x1={x} y1="130" x2={x} y2="300" {...s} />)}
      {/* splashback */}
      <rect x="110" y="300" width="760" height="110" fill={W} {...s} />
      {/* worktop */}
      <rect x="100" y="410" width="780" height="20" fill={T} {...s} />
      {/* base units */}
      <rect x="110" y="430" width="760" height="150" fill={W} {...s} />
      {[300, 490, 680].map((x) => <line key={x} x1={x} y1="430" x2={x} y2="580" {...s} />)}
      <rect x="490" y="430" width="190" height="150" fill={G} {...s} />
      {[480, 530].map((y) => <line key={y} x1="110" y1={y} x2="300" y2={y} {...s} />)}
      <rect x="110" y="580" width="760" height="20" fill={INK} opacity=".8" />
      {/* sink and tap */}
      <rect x="520" y="398" width="130" height="14" fill={W} {...s} />
      <path d="M585 398 V340 a22 22 0 0 1 44 0 v10" fill="none" {...s} strokeWidth={5} />
      {/* hob */}
      <rect x="170" y="402" width="90" height="8" fill={INK} />
      {/* tall unit */}
      <rect x="900" y="130" width="190" height="470" fill={G} {...s} />
      <line x1="900" y1="330" x2="1090" y2="330" {...s} /><rect x="930" y="170" width="130" height="120" fill={W} {...s} />
      <line x1="920" y1="350" x2="920" y2="410" {...s} strokeWidth={3} />
    </Room>
  );
}

export function FitoutScene() {
  return (
    <Room>
      {/* wall panelling */}
      {[0, 1, 2, 3].map((i) => <rect key={i} x={80 + i * 180} y="110" width="180" height="490" fill={i % 2 ? T : G} {...s} />)}
      <line x1="80" y1="350" x2="800" y2="350" {...s} strokeWidth={1.2} />
      {/* bench */}
      <rect x="200" y="520" width="480" height="80" fill={W} {...s} />
      <rect x="190" y="506" width="500" height="16" fill={T} {...s} />
      {[360, 520].map((x) => <line key={x} x1={x} y1="522" x2={x} y2="600" {...s} />)}
      {/* door opening */}
      <rect x="830" y="110" width="250" height="490" fill={W} {...s} />
      <rect x="860" y="140" width="190" height="460" fill="#F4EFE6" {...s} />
      <path d="M860 140 L1010 170 V600 H860 Z" fill={T} {...s} /><circle cx="990" cy="390" r="6" fill={INK} />
      {/* light */}
      <line x1="440" y1="0" x2="440" y2="60" {...s} /><path d="M400 60 h80 l20 34 h-120 z" fill={W} {...s} />
    </Room>
  );
}

export function WetScene() {
  return (
    <Room>
      {/* bathroom wall panels */}
      {[0, 1, 2].map((i) => <rect key={i} x={70 + i * 170} y="110" width="170" height="490" fill={i === 1 ? W : G} {...s} />)}
      {/* mirror */}
      <rect x="250" y="170" width="150" height="190" rx="75" fill={W} {...s} />
      {/* vanity */}
      <rect x="170" y="440" width="310" height="120" fill={T} {...s} />
      <line x1="325" y1="440" x2="325" y2="560" {...s} />
      <rect x="160" y="426" width="330" height="16" fill={W} {...s} />
      <path d="M270 426 a55 22 0 0 1 110 0" fill={W} {...s} />
      <path d="M325 404 V376 h26" fill="none" {...s} strokeWidth={5} />
      {/* divider */}
      <line x1="610" y1="60" x2="610" y2="640" stroke={INK} strokeWidth="1.2" strokeDasharray="6 8" />
      <text x="325" y="668" textAnchor="middle" fontSize="20" fontFamily="DM Sans Variable, sans-serif" fill={INK}>Bathroom concept</text>
      <text x="900" y="668" textAnchor="middle" fontSize="20" fontFamily="DM Sans Variable, sans-serif" fill={INK}>Façade concept</text>
      {/* facade */}
      <rect x="680" y="90" width="440" height="510" fill={W} {...s} />
      {[0, 1, 2, 3].map((c) => [0, 1, 2, 3, 4].map((r) => <rect key={`${c}-${r}`} x={680 + c * 110} y={90 + r * 102} width="110" height="102" fill={(c + r) % 3 === 0 ? T : G} {...s} strokeWidth={1.4} />))}
      <rect x="790" y="192" width="220" height="204" fill="#F4EFE6" {...s} /><line x1="900" y1="192" x2="900" y2="396" {...s} />
      <rect x="900" y="498" width="110" height="102" fill="#F4EFE6" {...s} />
    </Room>
  );
}
