const ITEMS = [
  "16OZ COLD-ROLLED COPPER",
  "ASTM B370",
  "24 GA STAINLESS STEEL",
  "ANSI/SPRI ES-1 CERTIFIED",
  "TIG WELDED SEAMS",
  "TPO / PVC COATED",
  "SMACNA ARCHITECTURAL",
  "14 GA STRUCTURAL STEEL",
  "HOT-DIP GALVANIZED",
  "48HR QUOTE TURNAROUND",
];

export default function Marquee({ className = "" }) {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div
      className={`relative overflow-hidden border-y border-line bg-panel/60 py-4 ${className}`}
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee items-center whitespace-nowrap">
        {row.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="font-mono text-xs tracking-[0.3em] text-slate-400">{item}</span>
            <span className="mx-8 inline-block h-1.5 w-1.5 rotate-45 bg-forge" />
          </span>
        ))}
      </div>
    </div>
  );
}
