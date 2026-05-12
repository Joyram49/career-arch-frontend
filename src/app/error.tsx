'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps): React.JSX.Element {
  useEffect(() => {
    // Log to error tracking (Sentry in production)
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="text-center">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ backgroundColor: 'var(--brand-red-light)' }}
        >
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
          Something went wrong
        </h1>
        <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
          We&apos;re working to fix it. Please try again.
        </p>
        {error.digest !== undefined && (
          <p className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--brand-navy)' }}
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            Go home
          </a>
        </div>
      </div>
    </main>
  );
}
