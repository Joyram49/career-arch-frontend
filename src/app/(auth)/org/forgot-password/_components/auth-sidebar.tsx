import { LogoIcon } from '@assets/icons/custom';

// ── Security Network Illustration ─────────────────────────────────────
function SecurityNetworkIllustration(): React.JSX.Element {
  const nodes: { cx: number; cy: number; r: number; fill: string; label: string }[] = [
    { cx: 96, cy: 116, r: 16, fill: '#0ea5e9', label: 'HR' },
    { cx: 384, cy: 108, r: 14, fill: '#10b981', label: 'CEO' },
    { cx: 76, cy: 292, r: 14, fill: '#f59e0b', label: 'IT' },
    { cx: 404, cy: 298, r: 16, fill: '#8b5cf6', label: 'OPS' },
    { cx: 240, cy: 56, r: 13, fill: '#0ea5e9', label: 'DEV' },
    { cx: 240, cy: 356, r: 12, fill: '#10b981', label: 'MKT' },
  ];

  const lines: [number, number, number, number][] = [
    [96, 116, 154, 162],
    [384, 108, 326, 162],
    [76, 292, 154, 256],
    [404, 298, 326, 256],
    [240, 56, 240, 130],
    [240, 356, 240, 280],
  ];

  return (
    <svg
      viewBox="0 0 480 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-lg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="fpOrgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </radialGradient>
        <filter id="fpOrgShadow">
          <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#000" floodOpacity="0.38" />
        </filter>
      </defs>

      {/* Central glow */}
      <ellipse cx="240" cy="200" rx="130" ry="108" fill="url(#fpOrgGlow)" />

      {/* Central lock card */}
      <rect
        x="154"
        y="128"
        width="172"
        height="154"
        rx="20"
        fill="rgba(13,33,55,0.97)"
        filter="url(#fpOrgShadow)"
      />
      <rect
        x="154"
        y="128"
        width="172"
        height="154"
        rx="20"
        fill="none"
        stroke="rgba(14,165,233,0.22)"
        strokeWidth="1"
      />

      {/* Lock body */}
      <rect
        x="215"
        y="184"
        width="50"
        height="42"
        rx="7"
        stroke="rgba(14,165,233,0.9)"
        strokeWidth="2"
        fill="rgba(14,165,233,0.08)"
      />
      {/* Lock shackle */}
      <path
        d="M225 184 V173 A15 15 0 0 1 255 173 V184"
        stroke="rgba(14,165,233,0.9)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Keyhole */}
      <circle cx="240" cy="207" r="5" fill="rgba(14,165,233,0.9)" />
      <line
        x1="240"
        y1="212"
        x2="240"
        y2="218"
        stroke="rgba(14,165,233,0.9)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Card label */}
      <text
        x="240"
        y="258"
        fill="rgba(148,163,184,0.8)"
        fontSize="8.5"
        fontFamily="system-ui"
        fontWeight="700"
        letterSpacing="0.1em"
        textAnchor="middle"
      >
        SECURE RESET
      </text>

      {/* Connector lines */}
      {lines.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="rgba(14,165,233,0.16)"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
      ))}

      {/* Orbiting role nodes */}
      {nodes.map(({ cx, cy, r, fill, label }) => (
        <g key={label}>
          <circle cx={cx} cy={cy} r={r + 7} fill={`${fill}18`} />
          <circle cx={cx} cy={cy} r={r} fill={fill} />
          <text
            x={cx}
            y={cy + 4}
            fill="white"
            fontSize="7"
            fontFamily="system-ui"
            fontWeight="700"
            textAnchor="middle"
          >
            {label}
          </text>
        </g>
      ))}

      {/* Info chips */}
      <g>
        <rect x="48" y="188" width="92" height="34" rx="10" fill="rgba(7,22,36,0.88)" />
        <rect
          x="48"
          y="188"
          width="92"
          height="34"
          rx="10"
          fill="none"
          stroke="rgba(14,165,233,0.12)"
          strokeWidth="1"
        />
        <circle cx="64" cy="205" r="6" fill="rgba(14,165,233,0.18)" />
        <text
          x="75"
          y="201"
          fill="rgba(148,163,184,0.75)"
          fontSize="7"
          fontFamily="system-ui"
          fontWeight="600"
        >
          ENCRYPTED
        </text>
        <text x="75" y="214" fill="white" fontSize="9" fontFamily="system-ui" fontWeight="700">
          256-bit
        </text>
      </g>
      <g>
        <rect x="340" y="186" width="92" height="34" rx="10" fill="rgba(7,22,36,0.88)" />
        <rect
          x="340"
          y="186"
          width="92"
          height="34"
          rx="10"
          fill="none"
          stroke="rgba(16,185,129,0.12)"
          strokeWidth="1"
        />
        <circle cx="356" cy="203" r="6" fill="rgba(16,185,129,0.18)" />
        <text
          x="367"
          y="199"
          fill="rgba(148,163,184,0.75)"
          fontSize="7"
          fontFamily="system-ui"
          fontWeight="600"
        >
          EXPIRY
        </text>
        <text x="367" y="212" fill="white" fontSize="9" fontFamily="system-ui" fontWeight="700">
          1 Hour
        </text>
      </g>
    </svg>
  );
}

// ── Auth Sidebar ───────────────────────────────────────────────────────
export function AuthSidebar(): React.JSX.Element {
  return (
    <aside className="relative hidden h-full w-full flex-col overflow-hidden px-10 py-10 lg:flex xl:px-14 xl:py-12">
      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2.5">
        <LogoIcon className="size-9 text-brand-navy-deep" />
        <span className="text-xl font-bold tracking-tight text-white">CareerArch</span>
        <span className="ml-1 rounded-full border border-brand-sky/30 bg-brand-sky/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-brand-sky uppercase">
          Employer Portal
        </span>
      </div>

      {/* Illustration */}
      <div className="relative z-10 flex flex-1 items-center justify-center py-8">
        <SecurityNetworkIllustration />
      </div>

      {/* Quote + trust pills */}
      <div className="relative z-10">
        <blockquote className="mb-4 text-xl leading-snug font-semibold tracking-tight text-slate-200 italic xl:text-2xl">
          &ldquo;Secure access for precision hiring.&rdquo;
        </blockquote>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            <span className="size-1.5 rounded-full bg-brand-emerald" />
            Encrypted
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            <span className="size-1.5 rounded-full bg-brand-sky" />
            Single-Use Link
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-0.5 w-10 rounded-full bg-white/30" />
          <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Security Architecture V4.0
          </span>
        </div>
      </div>
    </aside>
  );
}
