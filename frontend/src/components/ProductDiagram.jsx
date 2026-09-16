const COMMON = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "square",
};

const DASH = { ...COMMON, strokeDasharray: "4 4", opacity: 0.45 };

const DRAWINGS = {
  "roof-drains": (
    <g>
      <ellipse cx="100" cy="98" rx="62" ry="10" {...COMMON} />
      <rect x="86" y="56" width="28" height="42" {...COMMON} />
      <path d="M62 56 a38 30 0 0 1 76 0" {...COMMON} />
      <path d="M74 56 a26 22 0 0 1 52 0" {...DASH} />
      <path d="M86 56 a12 12 0 0 1 28 0" {...COMMON} />
      <line x1="38" y1="98" x2="162" y2="98" {...DASH} />
      <line x1="100" y1="14" x2="100" y2="26" {...COMMON} />
      <line x1="94" y1="20" x2="106" y2="20" {...COMMON} />
    </g>
  ),
  "drain-cones": (
    <g>
      <polygon points="46,42 154,42 118,104 82,104" {...COMMON} />
      <line x1="46" y1="42" x2="46" y2="34" {...COMMON} />
      <line x1="154" y1="42" x2="154" y2="34" {...COMMON} />
      <line x1="46" y1="34" x2="154" y2="34" {...COMMON} />
      <rect x="82" y="104" width="36" height="14" {...COMMON} />
      <line x1="100" y1="42" x2="100" y2="104" {...DASH} />
      <line x1="60" y1="66" x2="140" y2="66" {...DASH} />
    </g>
  ),
  "pitch-pockets": (
    <g>
      <rect x="62" y="46" width="76" height="52" {...COMMON} />
      <rect x="44" y="98" width="112" height="12" {...COMMON} />
      <line x1="62" y1="58" x2="138" y2="58" {...DASH} />
      <line x1="80" y1="46" x2="80" y2="26" {...COMMON} />
      <line x1="98" y1="46" x2="98" y2="20" {...COMMON} />
      <line x1="116" y1="46" x2="116" y2="30" {...COMMON} />
      <circle cx="52" cy="104" r="2.5" {...COMMON} />
      <circle cx="148" cy="104" r="2.5" {...COMMON} />
    </g>
  ),
  "roof-sumps": (
    <g>
      <rect x="36" y="52" width="128" height="56" {...COMMON} />
      <rect x="62" y="66" width="76" height="30" {...COMMON} />
      <circle cx="100" cy="81" r="10" {...COMMON} />
      <circle cx="100" cy="81" r="4" {...DASH} />
      <line x1="36" y1="52" x2="36" y2="40" {...COMMON} />
      <line x1="164" y1="52" x2="164" y2="40" {...COMMON} />
      <line x1="36" y1="40" x2="164" y2="40" {...DASH} />
    </g>
  ),
  scuppers: (
    <g>
      <rect x="48" y="50" width="70" height="46" {...COMMON} />
      <polygon points="118,58 158,64 158,84 118,88" {...COMMON} />
      <line x1="48" y1="50" x2="40" y2="42" {...COMMON} />
      <line x1="118" y1="50" x2="126" y2="42" {...COMMON} />
      <line x1="40" y1="42" x2="126" y2="42" {...DASH} />
      <line x1="158" y1="84" x2="150" y2="94" {...COMMON} />
      <line x1="60" y1="62" x2="106" y2="62" {...DASH} />
    </g>
  ),
  "custom-flashing": (
    <g>
      <polyline points="34,96 34,60 66,60 66,42 118,42 118,60 150,60 150,96" {...COMMON} />
      <polyline points="34,74 66,74 66,56 118,56 118,74 150,74" {...DASH} />
      <line x1="34" y1="104" x2="150" y2="104" {...COMMON} />
      <line x1="28" y1="60" x2="34" y2="60" {...COMMON} />
      <line x1="150" y1="60" x2="156" y2="60" {...COMMON} />
    </g>
  ),
  "roof-curbs": (
    <g>
      <rect x="50" y="34" width="100" height="76" {...COMMON} />
      <rect x="42" y="26" width="116" height="8" {...COMMON} />
      <line x1="50" y1="110" x2="150" y2="34" {...DASH} />
      <line x1="50" y1="34" x2="150" y2="110" {...DASH} />
      <line x1="50" y1="72" x2="150" y2="72" {...COMMON} />
      <line x1="58" y1="118" x2="142" y2="118" {...DASH} />
    </g>
  ),
  "metal-sleeves": (
    <g>
      <rect x="78" y="30" width="44" height="66" {...COMMON} />
      <ellipse cx="100" cy="30" rx="22" ry="7" {...COMMON} />
      <polygon points="66,96 134,96 146,112 54,112" {...COMMON} />
      <line x1="66" y1="96" x2="134" y2="96" {...COMMON} />
      <line x1="100" y1="37" x2="100" y2="96" {...DASH} />
      <line x1="46" y1="112" x2="154" y2="112" {...DASH} />
    </g>
  ),
};

export default function ProductDiagram({ productId, className = "" }) {
  return (
    <svg viewBox="0 0 200 130" className={className} role="img" aria-label={`${productId} technical diagram`}>
      {DRAWINGS[productId] || null}
    </svg>
  );
}
