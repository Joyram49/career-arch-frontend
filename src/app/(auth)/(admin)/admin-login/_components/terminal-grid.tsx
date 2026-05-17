export function TerminalGrid() {
  return (
    <>
      {/* Deep background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(14,165,233,0.08) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Fine dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.18) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      {/* Horizontal scan lines — subtle */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.5) 3px, rgba(255,255,255,0.5) 4px)',
        }}
        aria-hidden="true"
      />

      {/* Top edge glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: '60%',
          height: '1px',
          background:
            'linear-gradient(90deg, transparent, rgba(14,165,233,0.6), rgba(14,165,233,0.9), rgba(14,165,233,0.6), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Corner brackets — top-left */}
      <svg
        className="pointer-events-none absolute top-6 left-6 opacity-20"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path d="M0 16 L0 0 L16 0" stroke="#0ea5e9" strokeWidth="1.5" />
      </svg>

      {/* Corner brackets — top-right */}
      <svg
        className="pointer-events-none absolute top-6 right-6 opacity-20"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path d="M40 16 L40 0 L24 0" stroke="#0ea5e9" strokeWidth="1.5" />
      </svg>

      {/* Corner brackets — bottom-left */}
      <svg
        className="pointer-events-none absolute bottom-6 left-6 opacity-20"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path d="M0 24 L0 40 L16 40" stroke="#0ea5e9" strokeWidth="1.5" />
      </svg>

      {/* Corner brackets — bottom-right */}
      <svg
        className="pointer-events-none absolute right-6 bottom-6 opacity-20"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <path d="M40 24 L40 40 L24 40" stroke="#0ea5e9" strokeWidth="1.5" />
      </svg>

      {/* Floating status badge — top right */}
      <div
        className="pointer-events-none absolute top-8 right-8 hidden items-center gap-2 opacity-50 sm:flex"
        aria-hidden="true"
      >
        <span
          className="inline-block size-1.5 rounded-full bg-brand-emerald"
          style={{ boxShadow: '0 0 6px rgba(16,185,129,0.8)' }}
        />
        <span
          className="font-mono text-[10px] font-semibold tracking-[0.2em] uppercase"
          style={{ color: 'rgba(148,163,184,0.7)' }}
        >
          SYSTEM SECURE
        </span>
      </div>
    </>
  );
}
