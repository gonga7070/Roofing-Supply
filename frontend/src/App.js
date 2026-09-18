import { useEffect, useRef, createContext, useContext, useCallback } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Link } from "react-router-dom";
import Lenis from "lenis";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import Gallery from "@/pages/Gallery";
import About from "@/pages/About";
import Contact from "@/pages/Contact";

const QuoteContext = createContext({ openQuote: () => {} });
export const useQuote = () => useContext(QuoteContext);

const ScrollManager = ({ lenisRef }) => {
  const { pathname, hash } = useLocation();
  const prevRef = useRef(null);
  useEffect(() => {
    if (prevRef.current && prevRef.current !== pathname) {
      try {
        sessionStorage.setItem(`fg-animated:${prevRef.current}`, "1");
      } catch {}
    }
    prevRef.current = pathname;
    if (hash) {
      const t = setTimeout(() => lenisRef.current?.scrollTo(hash, { offset: -72 }), 120);
      return () => clearTimeout(t);
    }
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname, hash, lenisRef]);
  return null;
};

const BackHome = () => {
  const { pathname } = useLocation();
  if (pathname === "/") return null;
  return (
    <Link
      to="/"
      data-testid="back-home-button"
      className="group fixed left-4 top-[86px] z-[70] flex items-center gap-2 border border-line bg-white/85 px-3.5 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-700 backdrop-blur transition-colors duration-200 hover:border-forge hover:text-forge sm:left-8"
    >
      <ArrowLeft size={13} strokeWidth={2} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
      Home
    </Link>
  );
};

const Shell = ({ lenisRef }) => {
  const navigate = useNavigate();
  const openQuote = useCallback(() => navigate("/contact"), [navigate]);
  return (
    <QuoteContext.Provider value={{ openQuote }}>
      <ScrollManager lenisRef={lenisRef} />
      <div className="App min-h-screen bg-ink font-body text-neutral-900">
        <div className="noise-overlay" aria-hidden="true" />
        <Navbar />
        <BackHome />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </QuoteContext.Provider>
  );
};

function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 });
    lenisRef.current = lenis;
    window.__lenis = lenis;
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <BrowserRouter>
      <Shell lenisRef={lenisRef} />
    </BrowserRouter>
  );
}

export default App;
