import type { CSSProperties } from "react";

export default function GoalIcon({
  id,
  icon,
  pct,
  a,
  b,
}: {
  id: string;
  icon: string;
  pct: number;
  a: string;
  b: string;
}) {
  const r = 24;
  const c = 2 * Math.PI * r;
  const ringStyle = {
    "--off": c * (1 - pct / 100),
    strokeDashoffset: c,
  } as CSSProperties;

  return (
    <div className="relative h-14 w-14 shrink-0">
      <svg viewBox="0 0 56 56" className="absolute inset-0 -rotate-90" aria-hidden>
        <defs>
          <linearGradient id={`rg-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        </defs>
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
        <circle
          className="ring"
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke={`url(#rg-${id})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          style={ringStyle}
        />
      </svg>
      <div
        className="icon-bubble absolute inset-[6px] flex items-center justify-center rounded-full text-xl shadow-lg"
        style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
      >
        {icon}
      </div>
    </div>
  );
}
