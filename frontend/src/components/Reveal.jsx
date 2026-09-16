import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export const Reveal = ({ children, delay = 0, y = 32, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-70px" }}
    transition={{ duration: 0.75, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

export const MaskLine = ({ children, delay = 0, className = "" }) => (
  <span className={`block overflow-hidden ${className}`}>
    <motion.span
      className="block will-change-transform"
      initial={{ y: "112%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 0.95, delay, ease: EASE }}
    >
      {children}
    </motion.span>
  </span>
);

export const SectionHead = ({ index, eyebrow, title, className = "", dark = false }) => (
  <Reveal className={className}>
    <div className="flex items-center gap-4">
      <span className="font-mono text-xs tracking-[0.25em] text-forge">{index}</span>
      <span className="h-px w-10 bg-forge/60" aria-hidden="true" />
      <span className={`font-mono text-xs uppercase tracking-[0.25em] ${dark ? "text-white/60" : "text-steel"}`}>{eyebrow}</span>
    </div>
    <h2 className={`mt-5 font-head text-3xl font-bold uppercase tracking-tight sm:text-4xl lg:text-5xl ${dark ? "text-white" : "text-neutral-900"}`}>
      {title}
    </h2>
  </Reveal>
);
