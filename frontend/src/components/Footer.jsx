import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useQuote } from "@/App";

export default function Footer() {
  const { openQuote } = useQuote();
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center border border-forge bg-forge/10">
              <span className="font-head text-xl font-bold text-forge">F</span>
              <span className="absolute -right-1 -top-1 h-2 w-2 bg-forge" aria-hidden="true" />
            </span>
            <span className="font-head text-2xl font-bold uppercase tracking-wide text-white">
              ForgeLine Metals
            </span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            Architectural-grade heavy metal fabrications for commercial flat roof systems.
            Manufactured, welded, and shipped from Woodbridge, ON since 1998.
          </p>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            43.7850° N / 79.6139° W — Woodbridge, Ontario
          </p>
        </div>

        <div className="md:col-span-3">
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-white/50">Catalog</h3>
          <ul className="mt-5 space-y-2.5">
            {PRODUCTS.slice(0, 6).map((p) => (
              <li key={p.id}>
                <Link
                  to={`/products?item=${p.id}`}
                  data-testid={`footer-product-link-${p.id}`}
                  className="link-underline text-sm text-neutral-600 transition-colors hover:text-forge"
                >
                  {p.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-white/50">Company</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <Link to="/" data-testid="footer-home-link" className="link-underline text-white/60 transition-colors hover:text-forge">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" data-testid="footer-products-link" className="link-underline text-white/60 transition-colors hover:text-forge">
                Products
              </Link>
            </li>
            <li>
              <Link to="/gallery" data-testid="footer-gallery-link" className="link-underline text-white/60 transition-colors hover:text-forge">
                Gallery
              </Link>
            </li>
            <li>
              <Link to="/contact" data-testid="footer-contact-link" className="link-underline text-white/60 transition-colors hover:text-forge">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-white/50">Get A Price</h3>
          <p className="mt-5 text-sm leading-relaxed text-white/60">
            Send specs, get a number back in 48 hours.
          </p>
          <button
            type="button"
            data-testid="footer-request-quote-button"
            onClick={() => openQuote()}
            className="group mt-5 inline-flex items-center gap-2 border border-white/20 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-white/85 transition-colors duration-200 hover:border-forge hover:text-forge"
          >
            Request Quote
            <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-3 px-5 py-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 sm:flex-row sm:items-center sm:px-8">
          <span>© 2026 ForgeLine Metals LLC — All rights reserved</span>
          <span className="text-white/30">Copper / Stainless / Galvanized / TPO-Coated</span>
          <span className="text-[9px] normal-case tracking-[0.15em] text-white/30" data-testid="footer-credit">
            Website by{" "}
            <a
              href="https://www.akrondigital.ca/"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-credit-link"
              className="text-white/50 underline decoration-white/20 underline-offset-4 transition-colors hover:text-forge"
            >
              Akron Digital
            </a>{" "}
            ·{" "}
            <a href="tel:+16477455082" data-testid="footer-credit-phone" className="transition-colors hover:text-forge">
              647-745-5082
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
