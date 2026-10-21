"use client";
import { useEffect, useRef, useState } from "react";

export default function CountUp({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const first = useRef(true);
  const [n, setN] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !first.current) {
      setN(value);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        first.current = false;
        const t0 = performance.now();
        const dur = 1100;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} suppressHydrationWarning>
      {prefix}
      {n.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}
