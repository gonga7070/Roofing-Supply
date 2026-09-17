import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import { useQuote } from "@/App";
import Marquee from "@/components/Marquee";
import ProductDiagram from "@/components/ProductDiagram";
import { PRODUCTS, CATEGORIES } from "@/data/products";

const SpecRow = ({ label, value }) => (
  <div className="grid grid-cols-[110px_1fr] gap-3 border-b border-white/10 py-2.5 last:border-0">
    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</span>
    <span className="text-xs leading-relaxed text-white/75">{value}</span>
  </div>
);

const ProductCard = ({ product, index, expanded, onToggle }) => {
  const { openQuote } = useQuote();
  const cardRef = useRef(null);

  const onMove = (e) => {
    const r = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    cardRef.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      ref={cardRef}
      onMouseMove={onMove}
      data-testid={`product-card-${product.id}`}
      className="spotlight-card group relative flex flex-col border border-black bg-black transition-colors duration-300"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-3">
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/40">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-forge">{product.tag}</span>
      </div>

      <div className="blueprint-grid-fine flex h-44 items-center justify-center border-b border-white/10 bg-neutral-950 text-steel/60 transition-colors duration-300 group-hover:text-steel">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className={`h-full w-full object-contain p-3 transition-transform duration-500 ease-out ${product.imageClass || "group-hover:scale-105"}`}
            data-testid={`product-image-${product.id}`}
          />
        ) : (
          <ProductDiagram
            productId={product.id}
            className="h-32 w-auto transition-transform duration-500 ease-out group-hover:scale-110"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">{product.category}</span>
        <h3 className="mt-2 font-head text-2xl font-bold uppercase leading-tight tracking-tight text-white">
          {product.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{product.shortDesc}</p>

        <div className="mt-5">
          <SpecRow label="Materials" value={product.materials.join(" / ")} />
          <SpecRow label="Gauges" value={product.gauges} />
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/10 pt-1" data-testid={`product-specs-panel-${product.id}`}>
                <SpecRow label="Sizes" value={product.sizes} />
                <SpecRow label="Finishes" value={product.finishes} />
                <SpecRow label="Standards" value={product.astm} />
                <SpecRow label="Alloys" value={product.materials.join(" · ")} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto flex gap-3 pt-6">
          <button
            type="button"
            data-testid={`product-quote-btn-${product.id}`}
            onClick={() => openQuote(product.id)}
            className="group/btn flex flex-1 items-center justify-center gap-2 border border-forge bg-forge px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors duration-200 hover:bg-transparent hover:text-forge"
          >
            Request Quote
            <ArrowUpRight size={13} className="transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </button>
          <button
            type="button"
            data-testid={`product-specs-btn-${product.id}`}
            onClick={onToggle}
            aria-expanded={expanded}
            className="flex items-center justify-center gap-1.5 border border-white/25 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 transition-colors duration-200 hover:border-white hover:text-white"
          >
            {expanded ? <Minus size={13} /> : <Plus size={13} />}
            Specs
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default function Products() {
  const [params] = useSearchParams();
  const [category, setCategory] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const item = params.get("item");
    if (item && PRODUCTS.some((p) => p.id === item)) {
      setExpandedId(item);
      const t = setTimeout(() => {
        document
          .querySelector(`[data-testid="product-card-${item}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 350);
      return () => clearTimeout(t);
    }
  }, [params]);

  const visible = useMemo(
    () => (category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)),
    [category]
  );

  return (
    <div className="pt-[72px]" data-testid="products-page">
      <Marquee />

      <div className="sticky top-[72px] z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-2 px-5 py-4 sm:px-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              data-testid={`filter-tab-${c.toLowerCase()}`}
              onClick={() => setCategory(c)}
              className={`border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-200 ${
                category === c
                  ? "border-forge bg-forge/15 text-forge"
                  : "border-white/15 text-white/60 hover:border-white/35 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
          <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.25em] text-white/40" data-testid="product-count">
            {visible.length} / {PRODUCTS.length} Lines
          </span>
        </div>
      </div>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20">
        <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={PRODUCTS.indexOf(p)}
                expanded={expandedId === p.id}
                onToggle={() => setExpandedId((cur) => (cur === p.id ? null : p.id))}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
