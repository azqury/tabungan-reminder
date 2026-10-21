export default function Piggy({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 180" className={className} role="img" aria-label="Celengan babi">
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fda4af" />
          <stop offset="1" stopColor="#fb7185" />
        </linearGradient>
        <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      <ellipse cx="110" cy="170" rx="70" ry="7" fill="#000" opacity="0.25" />

      <g className="coin">
        <circle cx="112" cy="26" r="15" fill="url(#cg)" stroke="#d97706" strokeWidth="2" />
        <text x="112" y="31" textAnchor="middle" fontSize="13" fontWeight="700" fill="#92400e">Rp</text>
      </g>

      <rect x="66" y="132" width="20" height="28" rx="8" fill="#f43f5e" />
      <rect x="130" y="132" width="20" height="28" rx="8" fill="#f43f5e" />
      <path d="M46 104 q-20 -4 -14 -20 q6 -12 16 -2" fill="none" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" />

      <ellipse cx="108" cy="104" rx="66" ry="48" fill="url(#pg)" />
      <path d="M142 62 L166 40 L168 74 Z" fill="#f43f5e" />
      <ellipse cx="172" cy="108" rx="17" ry="14" fill="#fecdd3" />
      <circle cx="167" cy="108" r="2.6" fill="#be123c" />
      <circle cx="177" cy="108" r="2.6" fill="#be123c" />
      <circle className="blink" cx="148" cy="92" r="5" fill="#1f2937" />
      <circle cx="150" cy="90" r="1.6" fill="#fff" />
      <circle cx="140" cy="108" r="8" fill="#fb7185" opacity="0.6" />
      <rect x="92" y="60" width="34" height="7" rx="3.5" fill="#9f1239" opacity="0.7" />
    </svg>
  );
}
