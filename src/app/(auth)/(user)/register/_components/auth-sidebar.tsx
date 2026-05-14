import { LogoIcon } from '@assets/icons/custom';

// ── Wave / Fluid SVG Illustration ──────────────────────────────
function WaveIllustration(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 480 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-lg"
      aria-hidden="true"
    >
      <defs>
        {/* Main card gradient — deep steel blue */}
        <linearGradient id="cardBg" x1="0" y1="0" x2="480" y2="380" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0d2137" />
          <stop offset="0.5" stopColor="#0a1e30" />
          <stop offset="1" stopColor="#071624" />
        </linearGradient>

        {/* Upper wave — teal/cyan */}
        <linearGradient id="wave1" x1="0" y1="60" x2="480" y2="240" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4fc3d4" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#2a8fa8" stopOpacity="0.7" />
          <stop offset="1" stopColor="#1a6b82" stopOpacity="0.5" />
        </linearGradient>

        {/* Lower wave — darker steel */}
        <linearGradient id="wave2" x1="0" y1="160" x2="480" y2="380" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e4a6e" stopOpacity="0.9" />
          <stop offset="1" stopColor="#0d2d47" stopOpacity="0.6" />
        </linearGradient>

        {/* Middle accent wave */}
        <linearGradient id="wave3" x1="0" y1="120" x2="480" y2="300" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7dd3e8" stopOpacity="0.4" />
          <stop offset="1" stopColor="#3a9db8" stopOpacity="0.15" />
        </linearGradient>

        {/* Glowing dot radial */}
        <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
          <stop stopColor="#7dd3e8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#3a9db8" stopOpacity="0" />
        </radialGradient>

        {/* Clip to card */}
        <clipPath id="cardClip">
          <rect x="30" y="20" width="420" height="320" rx="24" />
        </clipPath>

        {/* Grid pattern */}
        <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="rgba(125,211,232,0.12)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>

      {/* Card background */}
      <rect x="30" y="20" width="420" height="320" rx="24" fill="url(#cardBg)" />
      <rect
        x="30"
        y="20"
        width="420"
        height="320"
        rx="24"
        fill="none"
        stroke="rgba(125,211,232,0.12)"
        strokeWidth="1"
      />

      {/* Grid overlay inside card */}
      <rect
        x="30"
        y="20"
        width="420"
        height="320"
        rx="24"
        fill="url(#grid)"
        clipPath="url(#cardClip)"
      />

      {/* ── Lower dark wave (background) ── */}
      <path
        d="M30 200 C120 160 200 240 280 200 C360 160 420 220 450 195 L450 340 L30 340 Z"
        fill="url(#wave2)"
        clipPath="url(#cardClip)"
      />

      {/* ── Upper teal wave (main hero wave) ── */}
      <path
        d="M30 110 C80 60 140 130 210 90 C280 50 330 130 390 80 C420 60 445 75 450 80 L450 210 C420 230 380 180 330 210 C270 248 200 175 140 210 C90 240 50 210 30 225 Z"
        fill="url(#wave1)"
        clipPath="url(#cardClip)"
      />

      {/* ── Mid accent wave ── */}
      <path
        d="M30 155 C90 125 160 170 230 145 C300 120 360 165 450 140 L450 175 C370 200 295 155 225 180 C155 205 85 160 30 185 Z"
        fill="url(#wave3)"
        clipPath="url(#cardClip)"
      />

      {/* ── Glowing network dots on upper wave ── */}
      {/* Dot cluster 1 */}
      <circle cx="160" cy="105" r="2.5" fill="url(#dotGlow)" />
      <circle cx="210" cy="88" r="2" fill="rgba(125,211,232,0.7)" />
      <circle cx="260" cy="110" r="1.5" fill="rgba(125,211,232,0.5)" />
      {/* Connecting lines */}
      <line x1="160" y1="105" x2="210" y2="88" stroke="rgba(125,211,232,0.25)" strokeWidth="0.8" />
      <line x1="210" y1="88" x2="260" y2="110" stroke="rgba(125,211,232,0.2)" strokeWidth="0.8" />

      {/* Dot cluster 2 */}
      <circle cx="310" cy="95" r="2.5" fill="url(#dotGlow)" />
      <circle cx="355" cy="115" r="1.8" fill="rgba(125,211,232,0.6)" />
      <circle cx="390" cy="88" r="2" fill="rgba(125,211,232,0.55)" />
      <line x1="310" y1="95" x2="355" y2="115" stroke="rgba(125,211,232,0.2)" strokeWidth="0.8" />
      <line x1="355" y1="115" x2="390" y2="88" stroke="rgba(125,211,232,0.2)" strokeWidth="0.8" />
      <line x1="310" y1="95" x2="390" y2="88" stroke="rgba(125,211,232,0.12)" strokeWidth="0.5" />

      {/* Dot cluster 3 — lower wave */}
      <circle cx="100" cy="215" r="2" fill="rgba(125,211,232,0.4)" />
      <circle cx="145" cy="205" r="1.5" fill="rgba(125,211,232,0.35)" />
      <line x1="100" y1="215" x2="145" y2="205" stroke="rgba(125,211,232,0.18)" strokeWidth="0.7" />

      {/* ── Card border highlight (top edge shimmer) ── */}
      <path
        d="M54 20 Q240 18 426 20"
        stroke="rgba(125,211,232,0.3)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Floating metric chip — bottom left ── */}
      <g>
        <rect x="48" y="278" width="150" height="46" rx="12" fill="rgba(7,22,36,0.92)" />
        <rect
          x="48"
          y="278"
          width="150"
          height="46"
          rx="12"
          fill="none"
          stroke="rgba(125,211,232,0.12)"
          strokeWidth="1"
        />
        {/* Icon circle */}
        <circle cx="72" cy="301" r="12" fill="rgba(125,211,232,0.1)" />
        {/* Arrow up icon */}
        <path
          d="M68 304 L72 297 L76 304"
          stroke="rgba(125,211,232,0.75)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <line
          x1="72"
          y1="297"
          x2="72"
          y2="305"
          stroke="rgba(125,211,232,0.75)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Text */}
        <text
          x="90"
          y="296"
          fill="rgba(148,163,184,0.85)"
          fontSize="7.5"
          fontFamily="system-ui"
          letterSpacing="0.08em"
          fontWeight="600"
        >
          PROFILES HIRED
        </text>
        <text x="90" y="311" fill="white" fontSize="14" fontFamily="system-ui" fontWeight="700">
          142K+
        </text>
      </g>

      {/* ── Floating metric chip — top right ── */}
      <g>
        <rect x="298" y="38" width="136" height="42" rx="12" fill="rgba(7,22,36,0.85)" />
        <rect
          x="298"
          y="38"
          width="136"
          height="42"
          rx="12"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
        <circle cx="316" cy="59" r="10" fill="rgba(16,185,129,0.15)" />
        {/* Check icon */}
        <path
          d="M311 59 L315 63 L321 55"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <text
          x="330"
          y="54"
          fill="rgba(148,163,184,0.85)"
          fontSize="7.5"
          fontFamily="system-ui"
          letterSpacing="0.08em"
          fontWeight="600"
        >
          JOB MATCHES
        </text>
        <text x="330" y="68" fill="white" fontSize="13" fontFamily="system-ui" fontWeight="700">
          2.4M+
        </text>
      </g>

      {/* ── Small decorative circles ── */}
      <circle cx="420" cy="310" r="18" fill="rgba(245,158,11,0.12)" />
      <circle cx="420" cy="310" r="10" fill="rgba(245,158,11,0.18)" />
      <circle cx="420" cy="310" r="4" fill="rgba(245,158,11,0.5)" />
    </svg>
  );
}

// ── Auth Sidebar (Register) ─────────────────────────────────────
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
        <WaveIllustration />
      </div>

      {/* Quote + tagline */}
      <div className="relative z-10">
        <blockquote className="mb-5 text-xl leading-snug font-semibold tracking-tight text-slate-200 italic xl:text-2xl">
          &ldquo;Build your professional narrative with precision.&rdquo;
        </blockquote>
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          &quot;Your next opportunity is one application away&quot;
        </p>
        <div className="flex items-center gap-3">
          <div className="h-0.5 w-10 rounded-full bg-white/30" />
          <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Precision Architect System V4.0
          </span>
        </div>
      </div>
    </aside>
  );
}
