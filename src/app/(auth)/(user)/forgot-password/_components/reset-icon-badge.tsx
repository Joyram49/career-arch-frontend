export function ResetIconBadge(): React.JSX.Element {
  return (
    <div className="flex size-16 items-center justify-center rounded-2xl bg-muted shadow-sm">
      <svg viewBox="0 0 32 32" fill="none" className="size-8 text-foreground" aria-hidden="true">
        {/* Lock body */}
        <rect x="7" y="14" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.8" />
        {/* Lock shackle */}
        <path
          d="M11 14V10a5 5 0 0 1 10 0v4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Reset arrow */}
        <path
          d="M19.5 20 A3.5 3.5 0 1 1 16 16.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M16 14 L18 16.5 L13.5 16.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
