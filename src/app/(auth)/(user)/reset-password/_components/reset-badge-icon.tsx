export function ResetBadge(): React.JSX.Element {
  return (
    <div className="flex size-14 items-center justify-center rounded-2xl bg-muted shadow-sm">
      <svg viewBox="0 0 32 32" fill="none" className="size-7 text-foreground" aria-hidden="true">
        <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M16 10 A6 6 0 1 1 10.5 19"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M8 17 L10.5 19.5 L13 17"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
