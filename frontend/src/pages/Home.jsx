import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, animate, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight, MapPin, Navigation } from "lucide-react";
import { useQuote } from "@/App";
import { MaskLine, Reveal, SectionHead, hasPlayedEntrance } from "@/components/Reveal";
import SparkCanvas from "@/components/SparkCanvas";
import ProductDiagram from "@/components/ProductDiagram";
import { PRODUCTS, IMAGES } from "@/data/products";

const Counter = ({ to, decimals = 0, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (hasPlayedEntrance()) {
      setVal(to);
      return;
    }
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const Hero = () => {
  const { openQuote } = useQuote();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -110]);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });

  const onTilt = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const resetTilt = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <section ref={sectionRef} className="relative flex min-h-screen flex-col overflow-hidden" data-testid="hero-section">
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110" aria-hidden="true">
        <img src={IMAGES.hero} alt="" className="h-full w-full object-cover opacity-40 saturate-[0.7]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/55 to-white" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-white/40" />
      </motion.div>
      <div className="blueprint-grid absolute inset-0" aria-hidden="true" />
      <SparkCanvas density={36} />

      <motion.div
        style={{ opacity: fade, y: titleY }}
        className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-5 pb-10 pt-24 sm:px-8 lg:pt-24"
      >
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <MaskLine delay={0.15}>
              <span className="inline-flex items-center gap-3 border border-linehi bg-white/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-steel backdrop-blur sm:text-xs">
                <span className="h-1.5 w-1.5 animate-pulse bg-forge" aria-hidden="true" />
                Commercial Roofing Fabrications — Est. 1998
              </span>
            </MaskLine>

            <h1 className="mt-5 font-head text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
              <MaskLine delay={0.3}>Built for the elements.</MaskLine>
              <MaskLine delay={0.42}>
                <span className="text-forge">Engineered for performance.</span>
              </MaskLine>
              <MaskLine delay={0.54}>Made to last.</MaskLine>
            </h1>

            <Reveal delay={0.75} className="mt-5 max-w-xl">
              <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                We manufacture the drainage and edge-metal components that keep commercial flat
                roofs watertight — roof drains, scuppers, cones, stack jacks and more, brake-formed
                and TIG-welded in Woodbridge, ON.
              </p>
            </Reveal>

            <Reveal delay={0.9} className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                data-testid="hero-cta-quote-button"
                onClick={() => openQuote()}
                className="group flex items-center gap-3 border border-forge bg-forge px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors duration-200 hover:bg-transparent hover:text-forge"
              >
                Request A Quote
                <ArrowUpRight size={15} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
              <Link
                to="/products"
                data-testid="hero-cta-catalog-button"
                className="group flex items-center gap-3 border border-linehi px-8 py-4 font-mono text-xs uppercase tracking-[0.25em] text-neutral-800 transition-colors duration-200 hover:border-steel hover:text-steel"
              >
                Browse The Catalog
                <ArrowRight size={15} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-4 lg:col-span-4 lg:mt-0">
            <Reveal delay={1.05}>
              <div style={{ perspective: 900 }}>
                <motion.div
                  onMouseMove={onTilt}
                  onMouseLeave={resetTilt}
                  style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
                  className="corner-frame spotlight-card relative border border-linehi"
                  data-testid="hero-feature-frame"
                >
                  <img
                    src={IMAGES.welding}
                    alt="TIG welding stainless roof drain flange in the ForgeLine shop"
                    className="h-60 w-full object-cover saturate-[0.75] sm:h-72 lg:h-[min(400px,44vh)]"
                  />
                  <span className="absolute -left-px -top-px h-5 w-5 border-l-2 border-t-2 border-forge" aria-hidden="true" />
                  <span className="absolute -right-px -top-px h-5 w-5 border-r-2 border-t-2 border-forge" aria-hidden="true" />
                </motion.div>
              </div>
            </Reveal>
          </div>
        </div>
      </motion.div>

      <motion.div style={{ opacity: fade }} className="relative z-10 border-t border-line/70">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 sm:px-8">
          <span className="font-mono text-[10px] tracking-[0.3em] text-neutral-500">43.7850° N / 79.6139° W</span>
          <span className="hidden h-8 w-px origin-top animate-scroll-pulse bg-forge sm:block" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">Scroll — 001</span>
        </div>
      </motion.div>
    </section>
  );
};

const ShopFloor = () => (
  <section className="relative border-b border-line bg-white" data-testid="shopfloor-section">
    <div className="blueprint-grid absolute inset-0" aria-hidden="true" />
    <div className="relative mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead index="001" eyebrow="Inside The Plant" title="Cut. Brake. Weld. Ship." />
      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        {[
          {
            img: IMAGES.laser,
            label: "Fiber Laser — 4KW",
            sub: "Nesting tolerance 0.1mm across 10ft sheets",
            caption: "Every flange, dome ring, and collector box starts as a nested laser program. Nothing is sheared by eye.",
          },
          {
            img: IMAGES.plant,
            label: "Fab Line — Bays 01–06",
            sub: "Brake forming / rolling / TIG & MIG stations",
            caption: "Six fabrication bays run copper, stainless, and galvanized simultaneously, so mixed-alloy orders ship on one truck.",
          },
        ].map((card, i) => (
          <Reveal key={card.label} delay={i * 0.15}>
            <figure className="corner-frame spotlight-card group relative overflow-hidden border border-line" data-testid={`shopfloor-card-${i}`}>
              <img
                src={card.img}
                alt={card.label}
                className="h-[380px] w-full object-cover saturate-[0.7] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent" aria-hidden="true" />
              <figcaption className="absolute inset-x-0 bottom-0 border-t border-line bg-white/90 p-6 backdrop-blur">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-forge">{card.label}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-steel">{card.sub}</p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-700">{card.caption}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Stats = () => (
  <section className="border-b border-line" data-testid="stats-section">
    <div className="mx-auto grid max-w-[1440px] grid-cols-2 lg:grid-cols-4">
      {[
        { v: 27, suffix: "", label: "Years Fabricating", d: 0 },
        { v: 2.4, suffix: "M", label: "Lbs Of Metal Shipped / Yr", d: 1 },
        { v: 48, suffix: "", label: "Hour Quote Turnaround", d: 0 },
        { v: 0, suffix: "", label: "Leak Callbacks Since 2015", d: 0 },
      ].map((s, i) => (
        <div
          key={s.label}
          className={`border-line px-6 py-12 text-center sm:py-16 ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""} ${i > 0 ? "lg:border-l" : ""}`}
          data-testid={`stat-${i}`}
        >
          <p className="font-head text-5xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl">
            <Counter to={s.v} decimals={s.d} suffix={s.suffix} />
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-steel">{s.label}</p>
        </div>
      ))}
    </div>
  </section>
);

const ProductStrip = () => {
  const featured = ["roof-drains", "scuppers", "chimney-caps", "stack-jacks"];
  return (
    <section className="border-b border-line" data-testid="product-strip-section">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead index="002" eyebrow="The Lineup" title="Six Components. One Watertight Roof." />
          <Reveal delay={0.2}>
            <Link
              to="/products"
              data-testid="product-strip-view-all"
              className="group flex items-center gap-2 border border-linehi px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-neutral-800 transition-colors hover:border-forge hover:text-forge"
            >
              Full Catalog
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-16 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((id, i) => {
            const p = PRODUCTS.find((x) => x.id === id);
            return (
              <Reveal key={id} delay={i * 0.1}>
                <Link
                  to={`/products?item=${id}`}
                  data-testid={`featured-product-${id}`}
                  className="group flex h-full flex-col border-b border-r border-line bg-panel/30 p-7 transition-colors duration-300 hover:bg-white"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-forge">{p.tag}</span>
                  <div className="my-6 flex h-28 items-center justify-center border border-line bg-white text-steel/70 transition-colors duration-300 group-hover:text-steel">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.shortName}
                        className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <ProductDiagram productId={id} className="h-full w-auto transition-transform duration-500 group-hover:scale-110" />
                    )}
                  </div>
                  <h3 className="font-head text-xl font-bold uppercase tracking-tight text-neutral-900 transition-colors group-hover:text-forge">
                    {p.shortName}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-500">{p.shortDesc}</p>
                  <span className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 transition-colors group-hover:text-steel">
                    View Specs <ArrowUpRight size={12} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const PlantMap = () => (
  <section className="relative overflow-hidden border-t border-line bg-white" data-testid="plant-map-section">
    <div className="blueprint-grid absolute inset-0" aria-hidden="true" />
    <div className="relative mx-auto grid max-w-[1440px] gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12">
      <div className="flex flex-col justify-center lg:col-span-4">
        <SectionHead index="003" eyebrow="Find The Plant" title="Come See The Metal." />
        <Reveal delay={0.15} className="mt-8 space-y-5">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-forge">
              <MapPin size={17} strokeWidth={1.5} />
            </span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-steel">Plant & HQ</p>
              <p className="mt-1.5 font-head text-xl font-bold uppercase tracking-tight text-neutral-900">
                51 Roysun Rd Unit 9
              </p>
              <p className="font-mono text-xs tracking-[0.15em] text-neutral-500">Woodbridge, ON L4L 8P9</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-neutral-600">
            Will-call pickups, shop tours by appointment, and live inventory checks — Monday to
            Friday, 06:00–18:00 EST.
          </p>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=51+Roysun+Rd+Unit+9,+Woodbridge,+ON+L4L+8P9"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="get-directions-button"
            className="group inline-flex items-center gap-3 border border-forge bg-forge px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors duration-200 hover:bg-transparent hover:text-forge"
          >
            Get Directions
            <Navigation size={14} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>

      <Reveal delay={0.25} className="lg:col-span-8">
        <div className="corner-frame relative border border-line bg-white p-2" data-testid="plant-map-frame">
          <iframe
            title="ForgeLine Metals — 51 Roysun Rd Unit 9, Woodbridge, ON"
            data-testid="plant-map"
            src="https://www.google.com/maps?q=51+Roysun+Rd+Unit+9,+Woodbridge,+ON+L4L+8P9&t=k&output=embed"
            className="h-[380px] w-full sm:h-[440px]"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <span className="absolute -left-px -top-px h-5 w-5 border-l-2 border-t-2 border-forge" aria-hidden="true" />
          <span className="absolute -right-px -top-px h-5 w-5 border-r-2 border-t-2 border-forge" aria-hidden="true" />
        </div>
      </Reveal>
    </div>
  </section>
);

const CtaBand = () => {
  const { openQuote } = useQuote();
  return (
    <section className="relative overflow-hidden border-t border-line" data-testid="cta-band-section">
      <SparkCanvas density={26} />
      <div className="blueprint-grid absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1440px] px-5 py-28 text-center sm:px-8 sm:py-36">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-steel">Specs In — Metal Out</p>
        </Reveal>
        <h2 className="mx-auto mt-6 max-w-4xl font-head text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-neutral-900 sm:text-7xl">
          <MaskLine delay={0.1}>Spec It.</MaskLine>
          <MaskLine delay={0.22}>
            <span className="text-forge">We Fabricate It.</span>
          </MaskLine>
        </h2>
        <Reveal delay={0.35} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            data-testid="cta-band-quote-button"
            onClick={() => openQuote()}
            className="group flex items-center gap-3 border border-forge bg-forge px-9 py-4 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors duration-200 hover:bg-transparent hover:text-forge"
          >
            Start A Quote
            <ArrowUpRight size={15} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
          <Link
            to="/contact"
            data-testid="cta-band-contact-button"
            className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-600 underline decoration-linehi underline-offset-8 transition-colors hover:text-steel hover:decoration-steel"
          >
            Talk To The Shop
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <>
      <Hero />
      <ShopFloor />
      <Stats />
      <ProductStrip />
      <PlantMap />
      <CtaBand />
    </>
  );
}
