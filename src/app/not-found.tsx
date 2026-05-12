import Link from 'next/link';

export default function NotFound(): React.JSX.Element {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="text-center">
        <p
          className="text-8xl font-bold"
          style={{
            background: 'linear-gradient(135deg, var(--brand-sky), var(--brand-emerald))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
          Page not found
        </h1>
        <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--brand-navy)' }}
          >
            Go back home
          </Link>
          <Link
            href={{ pathname: '/jobs' }}
            className="inline-flex items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
            }}
          >
            Search jobs
          </Link>
        </div>
      </div>
    </main>
  );
}
