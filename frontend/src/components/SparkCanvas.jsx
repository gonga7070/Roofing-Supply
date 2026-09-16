import { useEffect, useRef } from "react";

export default function SparkCanvas({ density = 42, className = "", dark = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let raf;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const sparks = Array.from({ length: density }, () => ({
      x: Math.random(),
      y: Math.random(),
      s: Math.random() * 2 + 0.5,
      v: Math.random() * 0.0009 + 0.00025,
      drift: (Math.random() - 0.5) * 0.0003,
      o: Math.random() * 0.55 + 0.15,
      blue: Math.random() > 0.72,
      phase: Math.random() * Math.PI * 2,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const t = Date.now() * 0.002;
      for (const p of sparks) {
        p.y -= p.v;
        p.x += p.drift;
        if (p.y < -0.03) {
          p.y = 1.03;
          p.x = Math.random();
        }
        if (p.x < -0.03) p.x = 1.03;
        if (p.x > 1.03) p.x = -0.03;
        const flick = 0.55 + 0.45 * Math.sin(t + p.phase);
        ctx.globalAlpha = p.o * flick;
        ctx.fillStyle = p.blue ? (dark ? "#FFFFFF" : "#151515") : "#E10600";
        ctx.fillRect(p.x * w, p.y * h, p.s, p.s);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
