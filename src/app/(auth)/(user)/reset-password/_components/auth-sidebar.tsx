import { LogoIcon } from '@assets/icons/custom';

// ── Avatar Cluster ──────────────────────────────────────────────
interface AvatarProps {
  initials: string;
  colorClass: string;
}

function Avatar({ initials, colorClass }: AvatarProps): React.JSX.Element {
  return (
    <div
      className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-[#0d1117] text-[11px] font-bold text-white ${colorClass}`}
    >
      {initials}
    </div>
  );
}

// ── Blueprint Lines SVG overlay ─────────────────────────────────
function BlueprintLines(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 560 720"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Architectural grid lines */}
      {/* Vertical lines */}
      {[80, 190, 290, 390, 480].map((x) => (
        <line
          key={`v${x}`}
          x1={x}
          y1="0"
          x2={x}
          y2="720"
          stroke="rgba(14,165,233,0.055)"
          strokeWidth="1"
        />
      ))}
      {/* Horizontal lines */}
      {[100, 200, 320, 440, 560, 650].map((y) => (
        <line
          key={`h${y}`}
          x1="0"
          y1={y}
          x2="560"
          y2={y}
          stroke="rgba(14,165,233,0.045)"
          strokeWidth="1"
        />
      ))}
      {/* Corner bracket — top left */}
      <path
        d="M60 80 L60 40 L100 40"
        stroke="rgba(14,165,233,0.18)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Corner bracket — bottom right */}
      <path
        d="M500 640 L500 680 L460 680"
        stroke="rgba(14,165,233,0.18)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Diagonal accent */}
      <path
        d="M80 580 L180 480"
        stroke="rgba(14,165,233,0.07)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M380 120 L460 60"
        stroke="rgba(14,165,233,0.07)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Small crosshair — mid right */}
      <line x1="460" y1="310" x2="500" y2="310" stroke="rgba(14,165,233,0.14)" strokeWidth="1" />
      <line x1="480" y1="295" x2="480" y2="325" stroke="rgba(14,165,233,0.14)" strokeWidth="1" />
      <circle cx="480" cy="310" r="6" stroke="rgba(14,165,233,0.1)" strokeWidth="1" fill="none" />
      {/* Small crosshair — mid left */}
      <line x1="60" y1="380" x2="100" y2="380" stroke="rgba(14,165,233,0.12)" strokeWidth="1" />
      <line x1="80" y1="365" x2="80" y2="395" stroke="rgba(14,165,233,0.12)" strokeWidth="1" />
      {/* Label text — blueprint style */}
      <text
        x="110"
        y="44"
        fill="rgba(14,165,233,0.22)"
        fontSize="8"
        fontFamily="monospace"
        letterSpacing="0.15em"
      >
        SEC-ARCH-V4.0
      </text>
      <text
        x="310"
        y="685"
        fill="rgba(14,165,233,0.18)"
        fontSize="8"
        fontFamily="monospace"
        letterSpacing="0.15em"
      >
        PWD-RESET
      </text>
    </svg>
  );
}

// ── Auth Sidebar (Reset Password) ───────────────────────────────
export function AuthSidebar(): React.JSX.Element {
  return (
    <aside className="relative hidden h-full w-full flex-col overflow-hidden px-10 py-10 lg:flex xl:px-14 xl:py-12">
      {/* Blueprint lines overlay */}
      <BlueprintLines />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-brand-sky/90 shadow-sm">
          <LogoIcon className="size-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">CareerArch</span>
      </div>

      {/* ── Large typography headline ── */}
      <div className="relative z-10 flex flex-1 flex-col justify-center">
        <h2 className="text-5xl leading-[1.08] font-extrabold tracking-tight xl:text-[3.6rem]">
          <span className="text-white">Securing your</span>
          <br />
          <span className="text-white">professional</span>
          <br />
          {/* "architecture." in brand-sky matching Figma */}
          <span className="text-brand-sky">architecture.</span>
        </h2>

        <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-slate-400">
          Access high-stakes career opportunities with the precision of a master architect. Your
          security is our primary blueprint.
        </p>

        {/* Security badge row */}
        <div className="mt-8 flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-sky/20 bg-brand-sky/8 px-4 py-2">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="size-3.5 text-brand-sky"
              aria-hidden="true"
            >
              <path
                d="M8 1.5L2 4V8c0 3.3 2.4 6.35 6 7 3.6-.65 6-3.7 6-7V4L8 1.5Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M5.5 8.5L7.5 10.5L10.5 7"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[11px] font-semibold text-brand-sky">256-bit encrypted</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <span className="size-1.5 rounded-full bg-brand-emerald" />
            <span className="text-[11px] font-semibold text-slate-400">Secure session</span>
          </div>
        </div>
      </div>

      {/* ── Bottom: divider + avatar trust section ── */}
      <div className="relative z-10">
        <div className="mb-5 h-px w-full bg-white/10" />
        <div className="flex items-center gap-4">
          {/* Overlapping avatars */}
          <div className="flex -space-x-3">
            <Avatar initials="JK" colorClass="bg-brand-sky" />
            <Avatar initials="ML" colorClass="bg-brand-emerald" />
            <Avatar initials="RS" colorClass="bg-brand-amber" />
          </div>
          <p className="text-sm leading-snug text-slate-400">
            Trusted by <span className="font-bold text-brand-sky">12,000+</span> industry leaders
          </p>
        </div>
      </div>
    </aside>
  );
}
