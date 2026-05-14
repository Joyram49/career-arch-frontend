// ─── Dot Grid Pattern ─────────────────────────────────────────────────────────
export const DotGridBg = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      pointerEvents: 'none',
    }}
  />
);

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
