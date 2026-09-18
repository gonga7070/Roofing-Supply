import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck, Ruler, Flame, FileCheck } from "lucide-react";
import { Reveal, SectionHead } from "@/components/Reveal";
import SparkCanvas from "@/components/SparkCanvas";
import { IMAGES } from "@/data/products";

const VALUES = [
  {
    n: "01",
    title: "Zero Leaks",
    body: "Every seam is TIG-welded, soldered, or continuous-locked before it leaves the floor. If water can find a path, we haven't done our job — so we build like the warranty is forever.",
    icon: ShieldCheck,
  },
  {
    n: "02",
    title: "Heavy-Gauge Metals",
    body: "16oz cold-rolled copper, 304 and 316 stainless, heavy galvanized steel. We stock the alloys architects specify and refuse to down-gauge to win a bid.",
    icon: Flame,
  },
  {
    n: "03",
    title: "CNC Precision",
    body: "Brake-formed to a half-millimeter, laser-cut to the line, checked against the shop drawing twice. Field-fit problems are solved here, not on your roof.",
    icon: Ruler,
  },
  {
    n: "04",
    title: "Architect-Specified",
    body: "SMACNA-standard profiles and ASTM traceable alloys. Our submittal packages pass review the first time.",
    icon: FileCheck,
  },
];

export default function About() {
  return (
    <div className="pt-[72px]" data-testid="about-page">
      <section className="relative overflow-hidden border-b border-line">
        <div className="blueprint-grid absolute inset-0" aria-hidden="true" />
        <SparkCanvas density={20} />
        <div className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-20 sm:px-8 sm:pt-28">
          <SectionHead index="EST — 1998" eyebrow="The Company Behind The Metal" title="About ForgeLine" />
          <Reveal delay={0.15} className="mt-6 max-w-2xl">
            <p className="text-base leading-relaxed text-neutral-600">
              A family-run fabrication shop in Woodbridge, Ontario, building the metal components
              that keep commercial flat roofs watertight.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="font-head text-3xl font-bold uppercase tracking-tight text-neutral-900 sm:text-4xl">
                Twenty-Seven Years Of Metal, Weather, And Roofs That Don't Leak
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-base leading-relaxed text-neutral-600">
                ForgeLine Metals started in 1998 as a two-man sheet metal shop spinning vent cones
                for local roofers. Word got around that our flashings didn't leak and our quotes
                came back fast — and the shop grew the way good shops do: one contractor telling
                another.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-4 text-base leading-relaxed text-neutral-600">
                Today we run laser cutting, brake forming, rolling, and TIG/MIG weld cells under
                one roof at 51 Roysun Rd in Woodbridge. Every roof drain, scupper, stack jack, and
                chimney cap in our catalog is fabricated in-house — no imports, no reselling, no
                middlemen. The person who quotes your job works thirty feet from the person who
                welds it.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-4 text-base leading-relaxed text-neutral-600">
                We supply roofing contractors, architects, and facility managers across the GTA and
                ship across Ontario. Standard sizes ship from stock; custom runs are drafted,
                approved, and cut to your shop drawings.
              </p>
            </Reveal>
            <Reveal delay={0.4} className="mt-8">
              <Link
                to="/contact"
                data-testid="about-contact-button"
                className="group inline-flex items-center gap-3 border border-forge bg-forge px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors duration-200 hover:bg-transparent hover:text-forge"
              >
                Talk To The Shop
                <ArrowUpRight size={14} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="lg:col-span-5">
            <figure className="corner-frame spotlight-card relative border border-linehi" data-testid="about-photo">
              <img
                src={IMAGES.plant}
                alt="The ForgeLine Metals fabrication plant"
                className="h-[420px] w-full object-cover saturate-[0.75]"
              />
              <span className="absolute -left-px -top-px h-5 w-5 border-l-2 border-t-2 border-forge" aria-hidden="true" />
              <span className="absolute -right-px -top-px h-5 w-5 border-r-2 border-t-2 border-forge" aria-hidden="true" />
            </figure>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24">
          <SectionHead index="001" eyebrow="How We Work" title="The ForgeLine Standard" />
          <div className="mt-14 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.n} delay={i * 0.1}>
                <div
                  className="group relative h-full border-b border-r border-line bg-panel/30 p-8 transition-colors duration-300 hover:bg-white"
                  data-testid={`about-value-${v.n}`}
                >
                  <span className="absolute left-0 top-0 h-0 w-[3px] bg-forge transition-all duration-500 ease-out group-hover:h-full" aria-hidden="true" />
                  <div className="flex items-start justify-between">
                    <span className="font-head text-6xl font-extrabold text-line transition-colors duration-300 group-hover:text-forge/25">
                      {v.n}
                    </span>
                    <v.icon size={22} strokeWidth={1.5} className="mt-2 text-neutral-500 transition-colors duration-300 group-hover:text-forge" />
                  </div>
                  <h3 className="mt-6 font-head text-2xl font-bold uppercase tracking-tight text-neutral-900">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
