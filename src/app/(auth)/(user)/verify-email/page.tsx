import type { Metadata } from 'next';
import Link from 'next/link';

import { LogoIcon } from '@assets/icons/custom';
import { VerifyEmailCard } from './_components/verify-email-card';

// ── Metadata ────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Verify Your Email | CareerArch',
  description: 'Please verify your email address to activate your CareerArch account.',
};

// ── Page (RSC) ──────────────────────────────────────────────────
export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { email?: string };
}): Promise<React.JSX.Element> {
  // The email is passed via query param after register redirect
  const email = (await searchParams).email ?? 'your email address';

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Subtle ambient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(14,165,233,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      {/* ── Top Nav ── */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8">
        {/* Mobile: back arrow + logo */}
        <Link
          href={{ pathname: '/register' }}
          className="flex items-center gap-2.5 text-foreground transition-colors hover:text-brand-sky"
          aria-label="Back to register"
        >
          <svg viewBox="0 0 20 20" fill="none" className="size-5 shrink-0" aria-hidden="true">
            <path
              d="M12.5 5L7.5 10L12.5 15"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <LogoIcon className="size-7 text-brand-navy" />
          <span className="text-base font-bold tracking-tight text-foreground">CareerArch</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-6 sm:flex" aria-label="Header navigation">
          <Link
            href={{ pathname: '/help' }}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Help
          </Link>
          <Link
            href={{ pathname: '/' }}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-all hover:border-brand-sky/40 hover:bg-muted"
          >
            Back to Home
          </Link>
        </nav>
      </header>

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10">
        <VerifyEmailCard email={email} />
      </div>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-border px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <LogoIcon className="size-5 text-brand-navy" />
            <span className="text-xs font-semibold text-muted-foreground">CareerArch</span>
          </div>
          <nav
            className="flex flex-wrap items-center justify-center gap-5"
            aria-label="Footer navigation"
          >
            <Link
              href={{ pathname: '/privacy' }}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href={{ pathname: '/terms' }}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              href={{ pathname: '/help' }}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact Support
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} CareerArch Precision Systems. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
