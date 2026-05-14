import { LogoIcon } from '@assets/icons/custom';

// ── Decorative SVG Illustration ────────────────────────────────
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 420 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-md"
      aria-hidden="true"
    >
      {/* Main card */}
      <rect x="60" y="30" width="300" height="240" rx="20" fill="url(#cardGrad)" opacity="0.9" />
      <rect
        x="60"
        y="30"
        width="300"
        height="240"
        rx="20"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />

      {/* Wave shapes */}
      <path
        d="M100 160 Q140 80 180 140 Q220 200 260 120 Q300 50 340 110 L340 270 L100 270 Z"
        fill="url(#waveGrad1)"
        opacity="0.7"
      />
      <path
        d="M60 200 Q120 130 180 180 Q240 230 300 160 Q360 90 420 150 L420 340 L60 340 Z"
        fill="url(#waveGrad2)"
        opacity="0.5"
      />

      {/* Large amber sphere */}
      <circle cx="185" cy="118" r="22" fill="url(#sphereGrad1)" />
      <ellipse
        cx="178"
        cy="111"
        rx="7"
        ry="5"
        fill="rgba(255,255,255,0.28)"
        transform="rotate(-30 178 111)"
      />

      {/* Small amber sphere */}
      <circle cx="300" cy="200" r="14" fill="url(#sphereGrad2)" />
      <ellipse
        cx="295"
        cy="195"
        rx="4"
        ry="3"
        fill="rgba(255,255,255,0.28)"
        transform="rotate(-30 295 195)"
      />

      {/* Growth metric card */}
      <rect x="70" y="228" width="186" height="60" rx="14" fill="rgba(10,18,32,0.88)" />
      <rect
        x="70"
        y="228"
        width="186"
        height="60"
        rx="14"
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="1"
      />
      {/* Gear icon circle */}
      <circle cx="100" cy="258" r="15" fill="rgba(255,255,255,0.07)" />
      <path
        d="M94 260 L99 255 L104 258 L109 252"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <text
        x="122"
        y="251"
        fill="rgba(148,163,184,0.9)"
        fontSize="8.5"
        fontFamily="system-ui"
        letterSpacing="0.09em"
        fontWeight="600"
      >
        GROWTH METRIC
      </text>
      <text x="122" y="270" fill="white" fontSize="18" fontFamily="system-ui" fontWeight="700">
        +142%
      </text>

      {/* Trend arrow chip */}
      <circle cx="338" cy="55" r="20" fill="rgba(10,18,32,0.7)" />
      <circle cx="338" cy="55" r="20" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
      <path
        d="M330 62 L335 55 L340 59 L346 50"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      <defs>
        <linearGradient
          id="cardGrad"
          x1="60"
          y1="30"
          x2="360"
          y2="270"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1e3a5f" />
          <stop offset="1" stopColor="#0d2137" />
        </linearGradient>
        <linearGradient
          id="waveGrad1"
          x1="100"
          y1="80"
          x2="340"
          y2="270"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7ecac3" stopOpacity="0.6" />
          <stop offset="1" stopColor="#4a9b8e" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient
          id="waveGrad2"
          x1="60"
          y1="130"
          x2="420"
          y2="340"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#a8d5d0" stopOpacity="0.4" />
          <stop offset="1" stopColor="#5bb3aa" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="sphereGrad1" cx="40%" cy="35%" r="60%">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#d97706" />
        </radialGradient>
        <radialGradient id="sphereGrad2" cx="40%" cy="35%" r="60%">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ── Auth Sidebar ────────────────────────────────────────────────
export function AuthSidebar() {
  return (
    <aside className="relative hidden h-full w-full flex-col overflow-hidden px-10 py-10 lg:flex xl:px-14 xl:py-12">
      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2.5">
        <LogoIcon className="size-9 text-brand-navy-deep" />
        <span className="text-xl font-bold tracking-tight text-white">CareerArch</span>
      </div>

      {/* Illustration */}
      <div className="relative z-10 flex flex-1 items-center justify-center py-10">
        <HeroIllustration />
      </div>

      {/* Quote + version */}
      <div className="relative z-10">
        <blockquote className="mb-5 text-xl leading-snug font-semibold tracking-tight text-slate-200 italic xl:text-2xl">
          &ldquo;Your next opportunity is one application away&rdquo;
        </blockquote>
        <div className="flex items-center gap-3">
          <div className="h-0.5 w-10 rounded-full bg-white/30" />
          <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
            CareerArch Precision Systems V4.0
          </span>
        </div>
      </div>
    </aside>
  );
}
