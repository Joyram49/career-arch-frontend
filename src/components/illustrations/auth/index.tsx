// ─── Floating Career Illustration ─────────────────────────────────────────────
export const CareerIllustration = () => (
  <svg
    width="320"
    height="280"
    viewBox="0 0 320 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background circles */}
    <circle
      cx="160"
      cy="140"
      r="110"
      stroke="rgba(14,165,233,0.12)"
      strokeWidth="1"
      strokeDasharray="4 4"
    />
    <circle cx="160" cy="140" r="80" stroke="rgba(14,165,233,0.08)" strokeWidth="1" />

    {/* Central avatar node */}
    <circle
      cx="160"
      cy="140"
      r="32"
      fill="rgba(14,165,233,0.15)"
      stroke="rgba(14,165,233,0.5)"
      strokeWidth="1.5"
    />
    <circle cx="160" cy="132" r="10" fill="rgba(14,165,233,0.7)" />
    <path
      d="M142 158c0-9.94 8.06-18 18-18s18 8.06 18 18"
      stroke="rgba(14,165,233,0.7)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Connection lines */}
    <line
      x1="160"
      y1="60"
      x2="160"
      y2="108"
      stroke="rgba(14,165,233,0.3)"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
    <line
      x1="232"
      y1="100"
      x2="186"
      y2="122"
      stroke="rgba(16,185,129,0.3)"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
    <line
      x1="232"
      y1="180"
      x2="186"
      y2="158"
      stroke="rgba(14,165,233,0.3)"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
    <line
      x1="88"
      y1="100"
      x2="134"
      y2="122"
      stroke="rgba(245,158,11,0.3)"
      strokeWidth="1"
      strokeDasharray="3 3"
    />
    <line
      x1="88"
      y1="180"
      x2="134"
      y2="158"
      stroke="rgba(16,185,129,0.3)"
      strokeWidth="1"
      strokeDasharray="3 3"
    />

    {/* Top node — Company */}
    <rect
      x="136"
      y="34"
      width="48"
      height="28"
      rx="6"
      fill="rgba(14,165,233,0.15)"
      stroke="rgba(14,165,233,0.4)"
      strokeWidth="1"
    />
    <rect x="145" y="41" width="14" height="10" rx="2" fill="rgba(14,165,233,0.6)" />
    <rect x="163" y="41" width="14" height="4" rx="1" fill="rgba(255,255,255,0.2)" />
    <rect x="163" y="47" width="10" height="4" rx="1" fill="rgba(255,255,255,0.15)" />

    {/* Right-top node — Job offer */}
    <rect
      x="208"
      y="76"
      width="52"
      height="32"
      rx="6"
      fill="rgba(16,185,129,0.12)"
      stroke="rgba(16,185,129,0.35)"
      strokeWidth="1"
    />
    <circle cx="222" cy="92" r="7" fill="rgba(16,185,129,0.4)" />
    <rect x="234" y="85" width="20" height="4" rx="1" fill="rgba(255,255,255,0.2)" />
    <rect x="234" y="92" width="16" height="4" rx="1" fill="rgba(255,255,255,0.12)" />

    {/* Right-bottom node — Interview */}
    <rect
      x="208"
      y="156"
      width="52"
      height="32"
      rx="6"
      fill="rgba(14,165,233,0.12)"
      stroke="rgba(14,165,233,0.35)"
      strokeWidth="1"
    />
    <rect x="218" y="165" width="8" height="8" rx="2" fill="rgba(14,165,233,0.5)" />
    <rect x="231" y="165" width="20" height="3" rx="1" fill="rgba(255,255,255,0.2)" />
    <rect x="231" y="171" width="14" height="3" rx="1" fill="rgba(255,255,255,0.12)" />
    <rect x="218" y="175" width="32" height="3" rx="1" fill="rgba(14,165,233,0.2)" />

    {/* Left-top node — Resume */}
    <rect
      x="60"
      y="76"
      width="52"
      height="32"
      rx="6"
      fill="rgba(245,158,11,0.12)"
      stroke="rgba(245,158,11,0.35)"
      strokeWidth="1"
    />
    <rect x="70" y="85" width="14" height="18" rx="2" fill="rgba(245,158,11,0.3)" />
    <rect x="88" y="85" width="16" height="3" rx="1" fill="rgba(255,255,255,0.2)" />
    <rect x="88" y="91" width="12" height="3" rx="1" fill="rgba(255,255,255,0.12)" />
    <rect x="88" y="97" width="14" height="3" rx="1" fill="rgba(255,255,255,0.1)" />

    {/* Left-bottom node — Skills */}
    <rect
      x="60"
      y="156"
      width="52"
      height="32"
      rx="6"
      fill="rgba(16,185,129,0.12)"
      stroke="rgba(16,185,129,0.35)"
      strokeWidth="1"
    />
    <rect x="70" y="165" width="18" height="6" rx="3" fill="rgba(16,185,129,0.4)" />
    <rect x="92" y="165" width="12" height="6" rx="3" fill="rgba(16,185,129,0.25)" />
    <rect x="70" y="175" width="14" height="6" rx="3" fill="rgba(16,185,129,0.2)" />
    <rect x="88" y="175" width="16" height="6" rx="3" fill="rgba(16,185,129,0.3)" />

    {/* Sparkle dots */}
    <circle cx="100" cy="50" r="2" fill="rgba(14,165,233,0.4)" />
    <circle cx="220" cy="50" r="2" fill="rgba(16,185,129,0.4)" />
    <circle cx="60" cy="210" r="2" fill="rgba(245,158,11,0.4)" />
    <circle cx="260" cy="220" r="2" fill="rgba(14,165,233,0.3)" />
    <circle cx="290" cy="100" r="1.5" fill="rgba(255,255,255,0.2)" />
    <circle cx="30" cy="150" r="1.5" fill="rgba(255,255,255,0.2)" />
  </svg>
);

// ─── Abstract 3D Illustration (SVG) ──────────────────────────────
export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 420 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: 420 }}
    >
      {/* Main card */}
      <rect x="60" y="30" width="300" height="240" rx="20" fill="url(#cardGrad)" opacity="0.9" />
      {/* Inner highlight */}
      <rect
        x="60"
        y="30"
        width="300"
        height="240"
        rx="20"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />
      {/* Abstract wave shape 1 */}
      <path
        d="M100 160 Q140 80 180 140 Q220 200 260 120 Q300 50 340 110 L340 270 L100 270 Z"
        fill="url(#waveGrad1)"
        opacity="0.7"
      />
      {/* Abstract wave shape 2 */}
      <path
        d="M60 200 Q120 130 180 180 Q240 230 300 160 Q360 90 420 150 L420 340 L60 340 Z"
        fill="url(#waveGrad2)"
        opacity="0.5"
      />
      {/* Floating orange sphere 1 - large */}
      <circle cx="185" cy="118" r="22" fill="url(#sphereGrad1)" />
      <ellipse
        cx="178"
        cy="111"
        rx="7"
        ry="5"
        fill="rgba(255,255,255,0.3)"
        transform="rotate(-30 178 111)"
      />
      {/* Floating orange sphere 2 - small */}
      <circle cx="300" cy="200" r="14" fill="url(#sphereGrad2)" />
      <ellipse
        cx="295"
        cy="195"
        rx="4"
        ry="3"
        fill="rgba(255,255,255,0.3)"
        transform="rotate(-30 295 195)"
      />
      {/* Growth metric card */}
      <rect x="70" y="230" width="180" height="58" rx="14" fill="rgba(15,23,42,0.85)" />
      <rect
        x="70"
        y="230"
        width="180"
        height="58"
        rx="14"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      <circle cx="100" cy="259" r="14" fill="rgba(255,255,255,0.08)" />
      <path
        d="M94 261 L99 256 L104 259 L109 253"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <text
        x="122"
        y="252"
        fill="rgba(148,163,184,1)"
        fontSize="9"
        fontFamily="system-ui"
        letterSpacing="0.08em"
        fontWeight="600"
      >
        GROWTH METRIC
      </text>
      <text x="122" y="270" fill="white" fontSize="18" fontFamily="system-ui" fontWeight="700">
        +142%
      </text>
      {/* Trend arrow chip top-right */}
      <circle cx="338" cy="55" r="20" fill="rgba(15,23,42,0.7)" />
      <circle cx="338" cy="55" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <path
        d="M329 62 L335 54 L341 58 L347 50"
        stroke="rgba(255,255,255,0.8)"
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
