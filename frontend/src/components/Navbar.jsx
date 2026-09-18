import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useQuote } from "@/App";

const Logo = () => (
  <Link to="/" data-testid="nav-logo" className="group flex items-center gap-3">
    <span className="relative flex h-9 w-9 items-center justify-center border border-forge bg-forge/10 transition-colors duration-300 group-hover:bg-forge">
      <span className="font-head text-lg font-bold text-forge transition-colors duration-300 group-hover:text-ink">
        F
      </span>
      <span className="absolute -right-1 -top-1 h-2 w-2 bg-forge" aria-hidden="true" />
    </span>
    <span className="leading-none">
      <span className="block font-head text-xl font-bold uppercase tracking-wide text-neutral-900">
        ForgeLine
      </span>
      <span className="block font-mono text-[9px] uppercase tracking-[0.35em] text-steel">
        Metals
      </span>
    </span>
  </Link>
);

export default function Navbar() {
  const { openQuote } = useQuote();
  const [open, setOpen] = useState(false);

  const navLink = ({ isActive }) =>
    `link-underline font-mono text-xs uppercase tracking-[0.22em] transition-colors duration-200 ${
      isActive ? "text-forge active" : "text-neutral-700 hover:text-forge"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-[80] border-b border-line bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          <NavLink to="/" end data-testid="nav-home-link" className={navLink}>
            Home
          </NavLink>
          <NavLink to="/products" data-testid="nav-products-link" className={navLink}>
            Products
          </NavLink>
          <NavLink to="/gallery" data-testid="nav-gallery-link" className={navLink}>
            Gallery
          </NavLink>
          <NavLink to="/about" data-testid="nav-about-link" className={navLink}>
            About
          </NavLink>
          <NavLink to="/contact" data-testid="nav-contact-link" className={navLink}>
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            data-testid="nav-request-quote-button"
            onClick={() => openQuote()}
            className="group hidden items-center gap-2 border border-forge bg-forge px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors duration-200 hover:bg-transparent hover:text-forge sm:flex"
          >
            Request Quote
            <ArrowUpRight size={14} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <button
            type="button"
            data-testid="nav-mobile-menu-button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center border border-line text-neutral-800 transition-colors hover:border-forge hover:text-forge md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-white md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {[
                { to: "/", label: "Home", id: "mobile-home-link" },
                { to: "/products", label: "Products", id: "mobile-products-link" },
                { to: "/gallery", label: "Gallery", id: "mobile-gallery-link" },
                { to: "/about", label: "About", id: "mobile-about-link" },
                { to: "/contact", label: "Contact", id: "mobile-contact-link" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  data-testid={l.id}
                  onClick={() => setOpen(false)}
                  className="border-b border-line/60 py-3 font-head text-2xl font-semibold uppercase tracking-wide text-neutral-800 transition-colors hover:text-forge"
                >
                  {l.label}
                </Link>
              ))}
              <button
                type="button"
                data-testid="mobile-request-quote-button"
                onClick={() => {
                  setOpen(false);
                  openQuote();
                }}
                className="mt-4 border border-forge bg-forge px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink"
              >
                Request Quote
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
