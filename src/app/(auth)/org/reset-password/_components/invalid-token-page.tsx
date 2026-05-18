import Link from 'next/link';

export function InvalidTokenPage(): React.JSX.Element {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        {/* Warning icon */}
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-brand-amber/10">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            className="size-8 text-brand-amber"
            aria-hidden="true"
          >
            <path
              d="M16 3L2 27h28L16 3Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M16 13v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="23" r="1.2" fill="currentColor" />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Invalid or expired link
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This employer password reset link is missing, invalid, or has expired. Links are valid for{' '}
          <span className="font-semibold text-foreground">1 hour</span> after they are sent.
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href={{ pathname: '/org/forgot-password' }}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-brand-navy text-[15px] font-bold text-white transition-all duration-150 hover:-translate-y-px hover:bg-brand-navy/90 hover:shadow-card active:translate-y-0"
          >
            Request a new link
          </Link>
          <Link
            href={{ pathname: '/org/login' }}
            className="flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-semibold text-muted-foreground transition-colors hover:border-brand-sky/40 hover:text-foreground"
          >
            Back to employer sign in
          </Link>
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          Still having trouble?{' '}
          <Link
            href={{ pathname: '/help' }}
            className="font-semibold text-brand-sky hover:underline"
          >
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
