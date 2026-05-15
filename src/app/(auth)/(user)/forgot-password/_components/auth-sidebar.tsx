import { LogoIcon } from '@assets/icons/custom';

// ── Floating Cards SVG Illustration ────────────────────────────
function FloatingCardsIllustration(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 480 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-lg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="card1Bg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#1e3a5f" />
          <stop offset="1" stopColor="#0a1e30" />
        </linearGradient>
        <linearGradient id="card2Bg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#1a6b82" stopOpacity="0.92" />
          <stop offset="1" stopColor="#0d4255" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="card3Bg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#1e2d3d" stopOpacity="0.97" />
          <stop offset="1" stopColor="#0a1520" stopOpacity="0.98" />
        </linearGradient>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4fc3d4" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#4fc3d4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rocketGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
        <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Central glow between cards */}
      <ellipse cx="248" cy="205" rx="90" ry="110" fill="url(#centerGlow)" />

      {/* ── Card 1 — Back, solid navy, tilted hard left ── */}
      <g transform="rotate(-22, 200, 210)" filter="url(#cardShadow)">
        <rect
          x="105"
          y="100"
          width="190"
          height="220"
          rx="22"
          fill="url(#card1Bg)"
          opacity="0.97"
        />
        <rect
          x="105"
          y="100"
          width="190"
          height="220"
          rx="22"
          fill="none"
          stroke="rgba(255,255,255,0.11)"
          strokeWidth="1"
        />
        {/* Grid pattern on card */}
        <rect
          x="105"
          y="100"
          width="190"
          height="220"
          rx="22"
          fill="none"
          stroke="rgba(125,211,232,0.04)"
          strokeWidth="0"
        />
        {/* Pencil / key icon */}
        <g transform="translate(200, 208)">
          {/* Key body */}
          <circle
            cx="0"
            cy="-10"
            r="12"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2.5"
            fill="none"
          />
          <circle cx="0" cy="-10" r="5" fill="rgba(255,255,255,0.25)" />
          {/* Key shaft */}
          <rect x="-2.5" y="2" width="5" height="22" rx="2" fill="rgba(255,255,255,0.45)" />
          {/* Key teeth */}
          <rect x="2.5" y="10" width="6" height="3" rx="1" fill="rgba(255,255,255,0.45)" />
          <rect x="2.5" y="17" width="4" height="3" rx="1" fill="rgba(255,255,255,0.35)" />
        </g>
      </g>

      {/* ── Card 2 — Middle, teal/glass, slight tilt ── */}
      <g transform="rotate(-7, 248, 218)" filter="url(#cardShadow)">
        <rect x="158" y="108" width="190" height="220" rx="22" fill="url(#card2Bg)" />
        <rect
          x="158"
          y="108"
          width="190"
          height="220"
          rx="22"
          fill="none"
          stroke="rgba(125,211,232,0.22)"
          strokeWidth="1"
        />
        {/* Top-edge shimmer */}
        <path
          d="M180 108 Q253 106 326 108"
          stroke="rgba(125,211,232,0.28)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
        {/* Rocket glow */}
        <ellipse cx="253" cy="210" rx="30" ry="36" fill="url(#rocketGlow)" />
        {/* Rocket icon */}
        <g transform="translate(253, 215)">
          {/* Body */}
          <path
            d="M0 -28 C11 -28 20 -18 20 -6 L20 18 L0 28 L-20 18 L-20 -6 C-20 -18 -11 -28 0 -28 Z"
            fill="rgba(16,185,129,0.82)"
          />
          {/* Nose tip highlight */}
          <path
            d="M0 -28 C4 -24 7 -18 7 -12 L-7 -12 C-7 -18 -4 -24 0 -28 Z"
            fill="rgba(255,255,255,0.22)"
          />
          {/* Porthole */}
          <circle
            cx="0"
            cy="-8"
            r="7"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="2"
          />
          <circle cx="0" cy="-8" r="3.5" fill="rgba(255,255,255,0.2)" />
          {/* Fins */}
          <path d="M-20 8 L-30 25 L-20 20 Z" fill="rgba(16,185,129,0.55)" />
          <path d="M20 8 L30 25 L20 20 Z" fill="rgba(16,185,129,0.55)" />
          {/* Exhaust */}
          <ellipse cx="0" cy="28" rx="8" ry="5" fill="rgba(245,158,11,0.55)" />
          <ellipse cx="0" cy="33" rx="5" ry="4" fill="rgba(245,158,11,0.3)" />
        </g>
      </g>

      {/* ── Card 3 — Front, dark glass, slight right tilt ── */}
      <g transform="rotate(9, 290, 222)" filter="url(#cardShadow)">
        <rect x="200" y="112" width="190" height="220" rx="22" fill="url(#card3Bg)" />
        <rect
          x="200"
          y="112"
          width="190"
          height="220"
          rx="22"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        {/* Network / molecule icon */}
        <g transform="translate(295, 218)">
          {/* Center node */}
          <circle cx="0" cy="0" r="7" fill="rgba(148,163,184,0.7)" />
          <circle cx="0" cy="0" r="3.5" fill="rgba(255,255,255,0.3)" />
          {/* Satellite nodes */}
          <circle cx="-34" cy="-26" r="5" fill="rgba(148,163,184,0.52)" />
          <circle cx="34" cy="-26" r="5" fill="rgba(148,163,184,0.52)" />
          <circle cx="-32" cy="30" r="5" fill="rgba(148,163,184,0.45)" />
          <circle cx="32" cy="30" r="5" fill="rgba(148,163,184,0.45)" />
          <circle cx="0" cy="-40" r="4" fill="rgba(125,211,232,0.45)" />
          {/* Connection lines */}
          <line x1="0" y1="0" x2="-34" y2="-26" stroke="rgba(148,163,184,0.28)" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="34" y2="-26" stroke="rgba(148,163,184,0.28)" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="-32" y2="30" stroke="rgba(148,163,184,0.22)" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="32" y2="30" stroke="rgba(148,163,184,0.22)" strokeWidth="1.5" />
          <line x1="0" y1="0" x2="0" y2="-40" stroke="rgba(125,211,232,0.3)" strokeWidth="1.5" />
          {/* Cross connections */}
          <line
            x1="-34"
            y1="-26"
            x2="34"
            y2="-26"
            stroke="rgba(148,163,184,0.12)"
            strokeWidth="1"
          />
          <line x1="-34" y1="-26" x2="0" y2="-40" stroke="rgba(125,211,232,0.15)" strokeWidth="1" />
        </g>
      </g>

      {/* ── Floating ambient dots ── */}
      <circle cx="108" cy="118" r="3" fill="rgba(125,211,232,0.35)" />
      <circle cx="375" cy="310" r="4" fill="rgba(245,158,11,0.3)" />
      <circle cx="390" cy="130" r="2.5" fill="rgba(16,185,129,0.3)" />
      <circle cx="95" cy="305" r="2" fill="rgba(148,163,184,0.25)" />
    </svg>
  );
}

// ── Auth Sidebar (Forgot Password) ──────────────────────────────
export function AuthSidebar(): React.JSX.Element {
  return (
    <aside className="relative hidden h-full w-full flex-col overflow-hidden px-10 py-10 lg:flex xl:px-14 xl:py-12">
      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2.5">
        <LogoIcon className="size-9 text-brand-navy-deep" />
        <span className="text-xl font-bold tracking-tight text-white">CareerArch</span>
      </div>

      {/* Illustration */}
      <div className="relative z-10 flex flex-1 items-center justify-center py-8">
        <FloatingCardsIllustration />
      </div>

      {/* Quote + tagline */}
      <div className="relative z-10">
        <blockquote className="mb-5 text-xl leading-snug font-semibold tracking-tight text-slate-200 italic xl:text-2xl">
          &ldquo;Your next opportunity is one application away&rdquo;
        </blockquote>
        <div className="mb-4 flex items-center gap-2">
          {/* Trust pill */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            <span className="size-1.5 rounded-full bg-brand-emerald" />
            Encrypted
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            <span className="size-1.5 rounded-full bg-brand-sky" />
            Secure Access
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-0.5 w-10 rounded-full bg-white/30" />
          <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Precision Career Architecture
          </span>
        </div>
      </div>
    </aside>
  );
}
