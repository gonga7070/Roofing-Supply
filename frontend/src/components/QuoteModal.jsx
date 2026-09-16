import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import QuoteForm from "@/components/QuoteForm";
import { PRODUCTS } from "@/data/products";

export default function QuoteModal({ open, product, onClose }) {
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const productName = product ? PRODUCTS.find((p) => p.id === product)?.shortName : null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[95] flex items-end justify-center sm:items-center" data-testid="quote-modal">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/70 backdrop-blur-[16px]"
            aria-hidden="true"
          />
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-linehi bg-panel shadow-[0_0_80px_rgba(255,85,0,0.08)]"
            role="dialog"
            aria-modal="true"
            aria-label="Request a quote"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-panel/95 px-6 py-4 backdrop-blur">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-forge">
                  RFQ — {productName || "General Inquiry"}
                </p>
                <h3 className="font-head text-2xl font-bold uppercase tracking-tight text-slate-100">
                  Request A Quote
                </h3>
              </div>
              <button
                type="button"
                data-testid="quote-modal-close-button"
                onClick={onClose}
                aria-label="Close quote form"
                className="flex h-10 w-10 items-center justify-center border border-line text-slate-300 transition-colors hover:border-forge hover:text-forge"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <QuoteForm preselected={product ? [product] : []} compact />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
