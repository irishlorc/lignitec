/** Static SVG of the three layers. Shown while the 3D scene loads and as its no-WebGL fallback. */
export function LayerPoster({ className = '' }: { className?: string }) {
  const layer = (y: number, top: string, side: string) => (
    <g transform={`translate(0 ${y})`}>
      <path d="M200 60 L420 0 L640 60 L420 120 Z" fill={top} />
      <path d="M200 60 L420 120 L420 138 L200 78 Z" fill={side} />
      <path d="M640 60 L420 120 L420 138 L640 78 Z" fill={side} opacity=".8" />
    </g>
  );
  return (
    <svg viewBox="0 0 840 420" className={className} aria-hidden="true">
      {layer(230, '#8A8A88', '#6E6E6C')}
      {layer(140, '#6FA52F', '#557F22')}
      {layer(50, '#D9C7A9', '#C4B08E')}
    </svg>
  );
}
