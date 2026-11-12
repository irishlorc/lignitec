/**
 * Lignitec content model.
 * Everything here comes from Lignitec's published information or the YES!Delft
 * profile and news item. Do not add specifications, certifications, figures or
 * installations that Lignitec has not confirmed. Items marked NEEDS APPROVAL
 * must be signed off before the site is published.
 */

export const company = {
  name: 'Lignitec',
  legalName: 'Lignitec B.V.',
  founded: '2023', // NEEDS APPROVAL: confirm founding year
  email: 'info@lignitec.nl',
  phone: '+31 (0)15 2023628',
  phoneHref: '+31152023628',
  address: ['Molengraaffsingel 12', '2629 JD Delft', 'The Netherlands'],
  kvk: '91240212',
  vat: 'NL865591738B01',
  url: 'https://www.lignitec.nl',
  founders: [
    { name: 'Thomas Liebrand', role: 'Co-founder', initials: 'TL' }, // NEEDS APPROVAL: portrait, bio
    { name: 'Henk Rusting', role: 'Co-founder', initials: 'HR' }, // NEEDS APPROVAL: portrait, bio
  ],
};

export const nav = [
  { href: '/materials', label: 'Materials' },
  { href: '/applications', label: 'Applications' },
  { href: '/science', label: 'Science' },
  { href: '/about', label: 'About' },
];

export type ProductId = 'md' | 'hd' | 'hd-waterproof';

export type Product = {
  id: ProductId;
  name: string;
  short: string;
  density: number; // kg/m³, as published
  base: string;
  positioning: string;
  line: string;
  applications: string;
  focus: string[];
  extra?: { label: string; value: string }[];
  caution?: string;
};

export const products: Product[] = [
  {
    id: 'md',
    name: 'Lignitec MD',
    short: 'MD',
    density: 750,
    base: 'Paulownia or wood fibres',
    positioning: 'Medium-density variant',
    line: 'A medium-density panel for interiors where weight, performance and ease of machining need to balance.',
    applications: 'Interior applications, including furniture, kitchens and interior construction',
    focus: ['Balance of weight and performance', 'Machinability', 'Efficient material use', 'Broad applicability'],
    extra: [{ label: 'CO₂ storage', value: 'Described by Lignitec as high. No figure published.' }],
  },
  {
    id: 'hd',
    name: 'Lignitec HD',
    short: 'HD',
    density: 1400,
    base: 'Paulownia or wood fibres',
    positioning: 'High-density variant',
    line: 'A high-density panel for demanding interiors, where stiffness and surface quality come first.',
    applications: 'Demanding interior applications, including furniture, kitchens and interior construction',
    focus: ['Stiffness', 'Surface quality', 'Machinability', 'Substrate for finishing'],
  },
  {
    id: 'hd-waterproof',
    name: 'Lignitec HD Waterproof',
    short: 'HD Waterproof',
    density: 1400,
    base: 'Wood fibres',
    positioning: 'Moisture-resistant high-density material',
    line: 'A moisture-resistant high-density panel for wet interiors and intended exterior uses.',
    applications: 'Moist and wet interior environments and intended exterior uses, such as kitchens, bathrooms, walls and façades',
    focus: ['Dimensional stability', 'Durable performance', 'Machinability', 'Finishable substrate'],
    caution:
      'Waterproof is the product name. It is not a water-absorption rating, an exposure class or a service-life guarantee, and the panel is not presented as structural. Wet-area and exterior use is verified per project.',
  },
];

export type Suitability = 'listed' | 'verify' | 'none';

/** Application suitability as published. "verify" = listed as intended, needs project verification. */
export const suitability: { area: string; by: Record<ProductId, Suitability> }[] = [
  { area: 'Furniture', by: { md: 'listed', hd: 'listed', 'hd-waterproof': 'none' } },
  { area: 'Kitchens', by: { md: 'listed', hd: 'listed', 'hd-waterproof': 'listed' } },
  { area: 'Interior construction and walls', by: { md: 'listed', hd: 'listed', 'hd-waterproof': 'listed' } },
  { area: 'Bathrooms and wet interiors', by: { md: 'none', hd: 'none', 'hd-waterproof': 'verify' } },
  { area: 'Façades and exterior concepts', by: { md: 'none', hd: 'none', 'hd-waterproof': 'verify' } },
];

export const suitabilityLabel: Record<Suitability, string> = {
  listed: 'Published intended application',
  verify: 'Intended, verified per project',
  none: 'Not listed for this material',
};

export const journey = [
  {
    key: 'biomass',
    title: 'It starts as biomass',
    body: 'Paulownia or wood fibres, and by-streams from agriculture, horticulture and industry.',
  },
  {
    key: 'binder',
    title: 'Lignin does the binding',
    body: 'A lignin-based binder takes the place of fossil-based adhesive. Lignin is the natural polymer that gives wood its rigidity.',
  },
  {
    key: 'panel',
    title: 'Fibre and binder become a panel',
    body: 'Engineered at two published densities: 750 kg/m³ for MD, 1,400 kg/m³ for HD and HD Waterproof.',
  },
  {
    key: 'again',
    title: 'Designed for a second life',
    body: 'Lignitec describes its panels as designed to be recycled and re-formed. Ask for the evidence that applies to your product.',
  },
];

export type Hotspot = { id: string; x: number; y: number; label: string; material: string; body: string };

export type Scene = {
  id: 'furniture' | 'kitchen' | 'fitout' | 'wet';
  title: string;
  nav: string;
  intro: string;
  materials: string[];
  hotspots: Hotspot[];
  verify: string[];
};

/** Hotspot x/y are percentages of the scene drawing (1200 × 700). */
export const scenes: Scene[] = [
  {
    id: 'furniture',
    nav: 'Furniture',
    title: 'Furniture and cabinetry',
    intro: 'MD balances weight, performance and machinability. HD is denser, developed for stiffness, surface quality and finishing.',
    materials: ['MD', 'HD'],
    hotspots: [
      { id: 'doors', x: 33, y: 71, label: 'Doors and fronts', material: 'MD or HD', body: 'Visible faces. HD is developed as a substrate for finishing where surface quality leads.' },
      { id: 'shelves', x: 75, y: 45, label: 'Shelving and carcasses', material: 'MD', body: 'MD is positioned for broad interior use with efficient material use.' },
      { id: 'top', x: 20, y: 55, label: 'Worktop surface', material: 'HD', body: 'A denser panel where stiffness and surface matter. Finish compatibility is checked with your process.' },
    ],
    verify: ['Cutting, routing and edge quality on your machines', 'Fixings and fittings', 'Your lacquer, veneer or laminate', 'Sheet sizes and thicknesses'],
  },
  {
    id: 'kitchen',
    nav: 'Kitchens',
    title: 'Kitchens and fitted interiors',
    intro: 'A carcass, a front and a panel beside the sink face different conditions. All three materials list kitchens as an intended application.',
    materials: ['MD', 'HD', 'HD Waterproof'],
    hotspots: [
      { id: 'carcass', x: 22, y: 76, label: 'Carcasses', material: 'MD', body: 'The hidden structure of each unit, in a dry position.' },
      { id: 'fronts', x: 36, y: 31, label: 'Fronts', material: 'HD', body: 'Doors and drawer fronts, where surface quality and finishing lead.' },
      { id: 'sink', x: 47, y: 68, label: 'Around the sink', material: 'HD Waterproof', body: 'The moisture-exposed zone. Suitability is verified for the actual product and detailing.' },
    ],
    verify: ['Moisture and heat exposure of each part', 'Surface finish and cleaning demands', 'Hardware loads on doors and drawers', 'Standards your product must meet'],
  },
  {
    id: 'fitout',
    nav: 'Fit-out',
    title: 'Interior construction and fit-out',
    intro: 'Wall features, joinery and fitted elements in non-structural roles. The panels are not presented as structural or load-bearing.',
    materials: ['MD', 'HD'],
    hotspots: [
      { id: 'wall', x: 30, y: 38, label: 'Wall panelling', material: 'MD or HD', body: 'Non-structural lining. Fire and emissions requirements for the space are confirmed per project.' },
      { id: 'bench', x: 36, y: 81, label: 'Fitted joinery', material: 'HD', body: 'Built-in seating and joinery, where a denser panel suits heavier use.' },
      { id: 'reveal', x: 73, y: 50, label: 'Door reveal', material: 'MD or HD', body: 'Edges and returns. Fixing method and substrate are part of the evaluation.' },
    ],
    verify: ['The role of the panel in the build-up', 'Fire and emissions requirements', 'Fixing method and substrate', 'Finish and maintenance'],
  },
  {
    id: 'wet',
    nav: 'Wet and exterior',
    title: 'Bathrooms, wet areas and exterior concepts',
    intro: 'HD Waterproof is intended for wet interiors and exterior uses such as bathrooms, walls and façades. Every use is verified per project.',
    materials: ['HD Waterproof'],
    hotspots: [
      { id: 'vanity', x: 25, y: 73, label: 'Vanity unit', material: 'HD Waterproof', body: 'Furniture in a wet room. Edge sealing and detailing are part of the verification.' },
      { id: 'wetwall', x: 12, y: 35, label: 'Wet-room wall', material: 'HD Waterproof', body: 'Wall lining in a moist environment. Type and duration of water exposure decide suitability.' },
      { id: 'facade', x: 82, y: 40, label: 'Façade concept', material: 'HD Waterproof', body: 'An intended exterior use. Weathering, UV and building requirements need technical verification first.' },
    ],
    verify: ['Type and duration of water exposure', 'Edge sealing, detailing and ventilation', 'Weathering and UV for exterior concepts', 'Applicable building requirements'],
  },
];

export const principles = [
  { icon: 'loop', title: 'Sustainability', body: 'We start from renewable fibres and lignin-based binders, and design panels with their second life in mind.' },
  { icon: 'flask', title: 'Innovation', body: 'We develop materials against real application requirements, alongside the people who will use them.' },
  { icon: 'check', title: 'Quality', body: "We say what has been measured and what hasn't. A panel is recommended once its suitability has been checked." },
] as const;

/** Milestones with a public source. Dates are shown only where the source gives one. */
export const milestones = [
  { when: '2023', title: 'Lignitec founded in Delft', body: 'Started by Thomas Liebrand and Henk Rusting.', source: 'https://yesdelft.com/startups/lignitec/' },
  { when: 'Delft', title: 'Part of the YES!Delft startup community', body: 'Listed under construction and manufacturing.', source: 'https://yesdelft.com/startups/lignitec/' },
  {
    when: 'Funded project', // NEEDS APPROVAL: text and partner permissions
    title: 'KIA-CE subsidy for circular kitchens',
    body: 'A project with NOWA Kitchen, SAM Panels, Welbions, COA, The Green Village and Hegeman Bouw, as reported by YES!Delft.',
    source: 'https://yesdelft.com/news/lignitec-secures-kia-ce-subsidy-to-advance-circular-kitchen-innovations/',
  },
  { when: 'Today', title: 'Three published materials', body: 'Lignitec MD, HD and HD Waterproof.', source: '' },
];

export const published = [
  { topic: 'Base fibres', status: 'Published', detail: 'Paulownia or wood (MD, HD). Wood (HD Waterproof).' },
  { topic: 'Density', status: 'Published', detail: '750 kg/m³ (MD). 1,400 kg/m³ (HD, HD Waterproof).' },
  { topic: 'Binder type', status: 'Published', detail: 'Lignin-based, as an alternative to fossil-based adhesives.' },
  { topic: 'Intended applications', status: 'Published', detail: 'See each material.' },
  { topic: 'Dimensions, thicknesses, weights', status: 'On enquiry', detail: '' },
  { topic: 'Emissions', status: 'On enquiry', detail: '' },
  { topic: 'Fire behaviour', status: 'On enquiry', detail: '' },
  { topic: 'Moisture and water-absorption values', status: 'On enquiry', detail: '' },
  { topic: 'Mechanical properties and load class', status: 'On enquiry', detail: '' },
  { topic: 'CO₂ and lifecycle figures', status: 'On enquiry', detail: 'CO₂ storage in MD is described as high. No figure published.' },
];
