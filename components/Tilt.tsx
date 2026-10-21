"use client";
import { useRef, type ReactNode, type PointerEvent } from "react";

export default function Tilt({ children, max = 6 }: { children: ReactNode; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transform =
        `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) ` +
        `rotateY(${(px * max).toFixed(2)}deg) translate3d(0,-4px,0)`;
    });
  };

  const leave = () => {
    cancelAnimationFrame(raf.current);
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className="tilt">
      {children}
    </div>
  );
}
