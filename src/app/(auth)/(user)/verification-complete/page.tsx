import type { Metadata } from 'next';
import Link from 'next/link';

import { LogoIcon } from '@assets/icons/custom';
import { EmailVerifiedCard } from './_components/email-verified-card';

export const metadata: Metadata = {
  title: 'Email Verified | CareerArch',
  description: 'Your email has been verified. Welcome to CareerArch.',
};

export default function EmailVerifiedPage(): React.JSX.Element {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Ambient background — emerald tint on success */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.1) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      {/* ── Top Nav ── */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8">
        <Link href={{ pathname: '/' }} className="flex items-center gap-2.5" aria-label="Home">
          <LogoIcon className="size-7 text-brand-navy" />
          <span className="text-base font-bold tracking-tight text-foreground">CareerArch</span>
        </Link>
        <nav className="hidden items-center gap-6 sm:flex" aria-label="Header navigation">
          <Link
            href={{ pathname: '/help' }}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Help
          </Link>
          <Link
            href={{ pathname: '/login' }}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-all hover:border-brand-sky/40 hover:bg-muted"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* ── Main ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10">
        <EmailVerifiedCard />
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
