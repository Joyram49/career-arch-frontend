import { LogoIcon } from '@assets/icons/custom';

function CompanyGrowthIllustration(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 480 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-lg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rCardBg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#0d1f3c" />
          <stop offset="1" stopColor="#071220" />
        </linearGradient>
        <linearGradient
          id="rLineGrad"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="objectBoundingBox"
        >
          <stop stopColor="#0ea5e9" stopOpacity="0.2" />
          <stop offset="0.5" stopColor="#0ea5e9" />
          <stop offset="1" stopColor="#10b981" stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id="rGlow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rGlow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
        <filter id="rCardShadow">
          <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Background glow */}
      <ellipse cx="240" cy="200" rx="160" ry="120" fill="url(#rGlow1)" />

      {/* Main card */}
      <rect
        x="40"
        y="40"
        width="400"
        height="280"
        rx="22"
        fill="url(#rCardBg)"
        filter="url(#rCardShadow)"
      />
      <rect
        x="40"
        y="40"
        width="400"
        height="280"
        rx="22"
        fill="none"
        stroke="rgba(14,165,233,0.14)"
        strokeWidth="1"
      />

      {/* Subtle grid inside */}
      {[110, 180, 250, 320, 390].map((x) => (
        <line
          key={x}
          x1={x}
          y1="55"
          x2={x}
          y2="300"
          stroke="rgba(14,165,233,0.04)"
          strokeWidth="1"
        />
      ))}
      {[90, 150, 210, 270].map((y) => (
        <line
          key={y}
          x1="55"
          y1={y}
          x2="425"
          y2={y}
          stroke="rgba(14,165,233,0.04)"
          strokeWidth="1"
        />
      ))}

      {/* Title */}
      <text
        x="60"
        y="70"
        fill="rgba(148,163,184,0.85)"
        fontSize="8.5"
        fontFamily="system-ui"
        fontWeight="700"
        letterSpacing="0.1em"
      >
        TALENT ACQUISITION PLATFORM
      </text>

      {/* Growth area chart */}
      <path
        d="M60 260 L100 240 L150 220 L200 195 L250 165 L300 145 L350 120 L400 100 L420 95 L420 300 L60 300 Z"
        fill="rgba(14,165,233,0.07)"
      />
      <path
        d="M60 260 L100 240 L150 220 L200 195 L250 165 L300 145 L350 120 L400 100"
        stroke="url(#rLineGrad)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Second trend line */}
      <path
        d="M60 290 L100 275 L150 260 L200 248 L250 235 L300 220 L350 205 L400 190"
        stroke="rgba(16,185,129,0.5)"
        strokeWidth="1.5"
        strokeDasharray="5 3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Glowing dots on main line */}
      {[
        [100, 240],
        [200, 195],
        [300, 145],
        [400, 100],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="6" fill="rgba(14,165,233,0.15)" />
          <circle cx={x} cy={y} r="3" fill="#0ea5e9" />
        </g>
      ))}

      {/* Tooltip on peak */}
      <rect x="310" y="100" width="90" height="36" rx="8" fill="rgba(7,22,36,0.95)" />
      <rect
        x="310"
        y="100"
        width="90"
        height="36"
        rx="8"
        fill="none"
        stroke="rgba(14,165,233,0.2)"
        strokeWidth="1"
      />
      <text
        x="320"
        y="114"
        fill="rgba(148,163,184,0.8)"
        fontSize="7.5"
        fontFamily="system-ui"
        fontWeight="600"
      >
        GROWTH RATE
      </text>
      <text x="320" y="128" fill="white" fontSize="13" fontFamily="system-ui" fontWeight="700">
        +142%
      </text>
      <circle cx="393" cy="110" r="3" fill="#10b981" />

      {/* Feature chips at bottom */}
      <g>
        <rect x="55" y="305" width="110" height="35" rx="10" fill="rgba(7,22,36,0.85)" />
        <rect
          x="55"
          y="305"
          width="110"
          height="35"
          rx="10"
          fill="none"
          stroke="rgba(14,165,233,0.1)"
          strokeWidth="1"
        />
        <circle cx="73" cy="322" r="7" fill="rgba(14,165,233,0.15)" />
        <path
          d="M70 322 L73 318 L76 322"
          stroke="#0ea5e9"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
        <text
          x="85"
          y="319"
          fill="rgba(148,163,184,0.8)"
          fontSize="7"
          fontFamily="system-ui"
          fontWeight="600"
        >
          APPLICANTS
        </text>
        <text x="85" y="331" fill="white" fontSize="11" fontFamily="system-ui" fontWeight="700">
          2.4M+
        </text>
      </g>
      <g>
        <rect x="185" y="305" width="110" height="35" rx="10" fill="rgba(7,22,36,0.85)" />
        <rect
          x="185"
          y="305"
          width="110"
          height="35"
          rx="10"
          fill="none"
          stroke="rgba(16,185,129,0.1)"
          strokeWidth="1"
        />
        <circle cx="203" cy="322" r="7" fill="rgba(16,185,129,0.15)" />
        <path
          d="M199 322 L203 318 L207 324 L210 318"
          stroke="#10b981"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <text
          x="215"
          y="319"
          fill="rgba(148,163,184,0.8)"
          fontSize="7"
          fontFamily="system-ui"
          fontWeight="600"
        >
          COMPANIES
        </text>
        <text x="215" y="331" fill="white" fontSize="11" fontFamily="system-ui" fontWeight="700">
          18K+
        </text>
      </g>
      <g>
        <rect x="315" y="305" width="110" height="35" rx="10" fill="rgba(7,22,36,0.85)" />
        <rect
          x="315"
          y="305"
          width="110"
          height="35"
          rx="10"
          fill="none"
          stroke="rgba(245,158,11,0.1)"
          strokeWidth="1"
        />
        <circle cx="333" cy="322" r="7" fill="rgba(245,158,11,0.15)" />
        <path
          d="M329 322 L333 318 L337 322"
          stroke="#f59e0b"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
        <text
          x="345"
          y="319"
          fill="rgba(148,163,184,0.8)"
          fontSize="7"
          fontFamily="system-ui"
          fontWeight="600"
        >
          AVG HIRE TIME
        </text>
        <text x="345" y="331" fill="white" fontSize="11" fontFamily="system-ui" fontWeight="700">
          72 Hours
        </text>
      </g>
    </svg>
  );
}

export function AuthSidebar(): React.JSX.Element {
  return (
    <aside className="relative hidden h-full w-full flex-col overflow-hidden px-10 py-10 lg:flex xl:px-14 xl:py-12">
      <div className="relative z-10 flex items-center gap-2.5">
        <LogoIcon className="size-9 text-brand-navy-deep" />
        <span className="text-xl font-bold tracking-tight text-white">CareerArch</span>
        <span className="ml-1 rounded-full border border-brand-emerald/30 bg-brand-emerald/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-brand-emerald uppercase">
          Employers
        </span>
      </div>
      <div className="relative z-10 flex flex-1 items-center justify-center py-6">
        <CompanyGrowthIllustration />
      </div>
      <div className="relative z-10">
        <blockquote className="mb-4 text-xl leading-snug font-semibold tracking-tight text-slate-200 italic xl:text-2xl">
          &ldquo;Build your dream team with precision hiring.&rdquo;
        </blockquote>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            <span className="size-1.5 rounded-full bg-brand-sky" />
            Free to Post
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            <span className="size-1.5 rounded-full bg-brand-emerald" />
            AI-Matched Talent
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-0.5 w-10 rounded-full bg-white/30" />
          <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Precision Employer Architecture V4.0
          </span>
        </div>
      </div>
    </aside>
  );
}
