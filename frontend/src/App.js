import { useEffect, useRef, createContext, useContext, useCallback } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Lenis from "lenis";
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

const Shell = ({ lenisRef }) => {
  const navigate = useNavigate();
  const openQuote = useCallback(() => navigate("/contact"), [navigate]);
  return (
    <QuoteContext.Provider value={{ openQuote }}>
      <ScrollManager lenisRef={lenisRef} />
      <div className="App min-h-screen bg-ink font-body text-neutral-900">
        <div className="noise-overlay" aria-hidden="true" />
        <Navbar />
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
