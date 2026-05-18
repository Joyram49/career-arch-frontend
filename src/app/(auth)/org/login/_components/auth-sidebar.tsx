import { LogoIcon } from '@assets/icons/custom';

// ── Org Dashboard Illustration ─────────────────────────────────────────
function OrgDashboardIllustration(): React.JSX.Element {
  const bars: { x: number; y: number; h: number; grad: string; glow?: boolean }[] = [
    { x: 72, y: 185, h: 78, grad: 'lBar1' },
    { x: 126, y: 158, h: 105, grad: 'lBar1' },
    { x: 180, y: 122, h: 141, grad: 'lBar2' },
    { x: 234, y: 95, h: 168, grad: 'lBar2', glow: true },
    { x: 288, y: 140, h: 123, grad: 'lBar3' },
    { x: 342, y: 162, h: 101, grad: 'lBar4' },
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const avatars: { label: string; fill: string }[] = [
    { label: 'JD', fill: '#0ea5e9' },
    { label: 'KL', fill: '#10b981' },
    { label: 'MR', fill: '#f59e0b' },
    { label: 'AS', fill: '#8b5cf6' },
    { label: 'TW', fill: '#ef4444' },
  ];

  return (
    <svg
      viewBox="0 0 480 370"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-lg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lOrgBg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#0d2137" />
          <stop offset="1" stopColor="#071624" />
        </linearGradient>
        {(['1', '2', '3', '4'] as const).map((n) => {
          const colors: Record<string, string> = {
            '1': '#0ea5e9',
            '2': '#10b981',
            '3': '#f59e0b',
            '4': '#8b5cf6',
          };
          return (
            <linearGradient
              key={n}
              id={`lBar${n}`}
              x1="0"
              y1="1"
              x2="0"
              y2="0"
              gradientUnits="objectBoundingBox"
            >
              <stop stopColor={colors[n]} stopOpacity="0.22" />
              <stop offset="1" stopColor={colors[n]} />
            </linearGradient>
          );
        })}
        <filter id="lGlow">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#0ea5e9" floodOpacity="0.4" />
        </filter>
        <filter id="lCardShadow">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Card */}
      <rect
        x="36"
        y="24"
        width="408"
        height="306"
        rx="20"
        fill="url(#lOrgBg)"
        filter="url(#lCardShadow)"
      />
      <rect
        x="36"
        y="24"
        width="408"
        height="306"
        rx="20"
        fill="none"
        stroke="rgba(14,165,233,0.14)"
        strokeWidth="1"
      />

      {/* Grid */}
      {[90, 150, 210, 270, 330, 390].map((x) => (
        <line
          key={`x${x}`}
          x1={x}
          y1="40"
          x2={x}
          y2="300"
          stroke="rgba(14,165,233,0.04)"
          strokeWidth="1"
        />
      ))}
      {[88, 148, 208, 268].map((y) => (
        <line
          key={`y${y}`}
          x1="52"
          y1={y}
          x2="428"
          y2={y}
          stroke="rgba(14,165,233,0.04)"
          strokeWidth="1"
        />
      ))}

      {/* Dashboard header */}
      <text
        x="56"
        y="52"
        fill="rgba(148,163,184,0.85)"
        fontSize="8"
        fontFamily="system-ui"
        fontWeight="700"
        letterSpacing="0.12em"
      >
        HIRING DASHBOARD
      </text>
      <circle cx="408" cy="47" r="5" fill="#10b981" />
      <text
        x="399"
        y="51"
        fill="rgba(16,185,129,0.9)"
        fontSize="6.5"
        fontFamily="system-ui"
        fontWeight="700"
        textAnchor="end"
      >
        LIVE
      </text>

      {/* Bars */}
      {bars.map(({ x, y, h, grad, glow }) => (
        <rect
          key={x}
          x={x}
          y={y}
          width="30"
          height={h}
          rx="4"
          fill={`url(#${grad})`}
          filter={glow ? 'url(#lGlow)' : undefined}
        />
      ))}

      {/* Month labels */}
      {months.map((m, i) => (
        <text
          key={m}
          x={87 + i * 54}
          y="278"
          fill="rgba(148,163,184,0.65)"
          fontSize="7"
          fontFamily="system-ui"
          textAnchor="middle"
        >
          {m}
        </text>
      ))}

      {/* Trend line */}
      <polyline
        points="87,185 141,158 195,122 249,95 303,140 357,162"
        fill="none"
        stroke="rgba(14,165,233,0.45)"
        strokeWidth="1.8"
        strokeDasharray="4 3"
        strokeLinecap="round"
      />

      {/* Metric chips */}
      {[
        {
          x: 52,
          label: 'OPEN ROLES',
          value: '24',
          accent: '#0ea5e9',
          tag: '+3',
          tagColor: '#10b981',
        },
        {
          x: 176,
          label: 'TOTAL HIRED',
          value: '142',
          accent: '#10b981',
          tag: '↑18%',
          tagColor: '#10b981',
        },
        {
          x: 300,
          label: 'APPLICANTS',
          value: '1.2K',
          accent: '#8b5cf6',
          tag: '↑32%',
          tagColor: '#f59e0b',
        },
      ].map(({ x, label, value, accent, tag, tagColor }) => (
        <g key={label}>
          <rect x={x} y="68" width="112" height="44" rx="10" fill="rgba(7,22,36,0.88)" />
          <rect
            x={x}
            y="68"
            width="112"
            height="44"
            rx="10"
            fill="none"
            stroke={`${accent}22`}
            strokeWidth="1"
          />
          <text
            x={x + 14}
            y="85"
            fill="rgba(148,163,184,0.8)"
            fontSize="7"
            fontFamily="system-ui"
            fontWeight="700"
            letterSpacing="0.08em"
          >
            {label}
          </text>
          <text
            x={x + 14}
            y="101"
            fill="white"
            fontSize="15"
            fontFamily="system-ui"
            fontWeight="700"
          >
            {value}
          </text>
          <text
            x={x + 68}
            y="101"
            fill={tagColor}
            fontSize="8"
            fontFamily="system-ui"
            fontWeight="700"
          >
            {tag}
          </text>
        </g>
      ))}

      {/* Avatar row */}
      {avatars.map(({ label, fill }, i) => (
        <g key={label}>
          <circle cx={60 + i * 32} cy={310} r="11" fill={fill} />
          <text
            x={60 + i * 32}
            y={314}
            fill="white"
            fontSize="6.5"
            fontFamily="system-ui"
            fontWeight="700"
            textAnchor="middle"
          >
            {label}
          </text>
        </g>
      ))}
      <text x="238" y="315" fill="rgba(148,163,184,0.55)" fontSize="7.5" fontFamily="system-ui">
        +238 new applicants this week
      </text>
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
          For Employers
        </span>
      </div>

      {/* Illustration */}
      <div className="relative z-10 flex flex-1 items-center justify-center py-8">
        <OrgDashboardIllustration />
      </div>

      {/* Quote + trust pills */}
      <div className="relative z-10">
        <blockquote className="mb-4 text-xl leading-snug font-semibold tracking-tight text-slate-200 italic xl:text-2xl">
          &ldquo;Your next great hire is already on CareerArch.&rdquo;
        </blockquote>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            <span className="size-1.5 rounded-full bg-brand-emerald" />
            2.4M+ Talents
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            <span className="size-1.5 rounded-full bg-brand-sky" />
            Avg 72h to Hire
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-0.5 w-10 rounded-full bg-white/30" />
          <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
            Employer Platform V4.0
          </span>
        </div>
      </div>
    </aside>
  );
}
