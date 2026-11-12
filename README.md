# Lignitec website concept

A redesign concept for Lignitec (Delft), built from publicly available information.
It is not an approved Lignitec publication. The strip in the header says so; remove it
in `components/Header.tsx` once the company signs the site off.

## Run

```
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Stack: Next.js (App Router), TypeScript, Tailwind CSS, GSAP ScrollTrigger, React Three Fiber.

## Where things are

| What | File |
| --- | --- |
| All copy, product data, scenes, milestones | `content/site.ts` |
| Colours, type, radii | `tailwind.config.ts`, `app/globals.css` |
| Scroll-driven fibre film (hero and biomass-to-panel story) | `components/Film.tsx`, `components/three/FibreStage.tsx` |
| Scroll-scrubbed statement text | `components/ScrubText.tsx` |
| Product explorer | `components/ProductExplorer.tsx` |
| Application showcase and 3D architectural model | `components/Showcase.tsx`, `components/three/Maquette.tsx` |
| Science diagrams | `components/diagrams.tsx` |
| Redirects from the current site | `next.config.mjs` |

## Honesty rules built into the content

- Product data is limited to what Lignitec publishes: base fibre, density, positioning, intended applications.
- The fibre film is labelled conceptual. It does not show a product cross-section or a manufacturing process.
- 3D renders and fibre graphics scale fibre count to published density (750 : 1,400). Colour and surface are not representative.
- The application model is labelled illustrative, not an installed project.
- "Waterproof" is treated as a product name, never as a rating.
- The contact form is a prototype. It prepares text and sends nothing.

## Needed from Lignitec before launch

- Official logo files and exact brand colours (current values are sampled from a PNG)
- Product, process and project photography (slots: explorer, application showcase, founder portraits)
- Founder roles, bios and approval; confirmation of the founding year
- Datasheets, test results, standards, certification status
- Lifecycle data and CO2 accounting method
- Approval of the KIA-CE project text and partner permissions
- Approved wording for waterproof, exterior, circularity and recyclability claims
- Privacy and cookie policy, consent wording and a form endpoint

## Accessibility and performance

- Reduced motion: no pinning or scrubbing; the film renders one static exploded frame followed by the four stages as text.
- The 3D scenes load on demand, render only when visible, and have text alternatives.
- Tabs, hotspots and the 3D rotate controls work from the keyboard.
