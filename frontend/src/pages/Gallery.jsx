import { Reveal, SectionHead } from "@/components/Reveal";
import SparkCanvas from "@/components/SparkCanvas";
import { IMAGES } from "@/data/products";

const PHOTOS = [
  { src: IMAGES.welding, label: "TIG Weld Cell 04", sub: "304 Stainless flange pass", big: true },
  { src: IMAGES.laser, label: "Fiber Laser — 4KW", sub: "0.1mm nesting tolerance", big: false },
  { src: IMAGES.roof, label: "Commercial Flat Roof", sub: "Drainage points installed", big: false },
  { src: IMAGES.plant, label: "Fab Line — Bay Row", sub: "Brake / roll / weld stations", big: true },
  { src: IMAGES.sheet, label: "Sheet Stock", sub: "Copper · Stainless · Galvanized", big: false },
];

export default function Gallery() {
  return (
    <div className="pt-[72px]" data-testid="gallery-page">
      <section className="relative overflow-hidden border-b border-line">
        <div className="blueprint-grid absolute inset-0" aria-hidden="true" />
        <SparkCanvas density={20} />
        <div className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-20 sm:px-8 sm:pt-28">
          <SectionHead index="GAL" eyebrow="From The Shop Floor" title="The Gallery" />
          <Reveal delay={0.15} className="mt-6 max-w-2xl">
            <p className="text-base leading-relaxed text-neutral-600">
              Weld cells, laser beds, sheet stock, and finished installs — a look inside the
              Woodbridge plant and the roofs our metal ends up on.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PHOTOS.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.08} className={p.big ? "lg:col-span-2" : ""}>
              <figure
                className="corner-frame spotlight-card group relative h-full overflow-hidden border border-line bg-white"
                data-testid={`gallery-photo-${i + 1}`}
              >
                <img
                  src={p.src}
                  alt={p.label}
                  className="h-72 w-full object-cover saturate-[0.75] transition-transform duration-700 ease-out group-hover:scale-[1.05] sm:h-80"
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-line bg-white/90 px-5 py-3 backdrop-blur">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-forge">{p.label}</p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">{p.sub}</p>
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
