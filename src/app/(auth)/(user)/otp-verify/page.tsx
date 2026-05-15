import type { Metadata } from 'next';

import { LogoIcon } from '@assets/icons/custom';
import Link from 'next/link';
import { OtpVerifyForm } from './_components/otp-verify-form';

// ── Metadata ────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Two-Factor Authentication | CareerArch',
  description: 'Verify your identity with a 6-digit code to access your CareerArch account.',
};

// ── Page (RSC) ──────────────────────────────────────────────────
export default function TwoFactorVerifyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      {/* ── Top nav ── */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          {/* Logo */}
          <Link
            href={{ pathname: '/' }}
            className="flex items-center gap-2.5"
            aria-label="CareerArch home"
          >
            <LogoIcon className="size-7 text-brand-navy" />
            <span className="text-base font-bold tracking-tight text-foreground">CareerArch</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Secondary navigation">
            {(['Help', 'Security', 'Support'] as const).map((item) => (
              <Link
                key={item}
                href={{ pathname: `/${item.toLowerCase()}` }}
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  item === 'Security'
                    ? 'border-b-2 border-brand-navy pb-0.5 font-semibold text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Sign in CTA */}
          <Link
            href={{ pathname: '/login' }}
            className="inline-flex h-9 items-center rounded-lg bg-brand-navy px-4 text-sm font-semibold text-white transition-all hover:bg-brand-navy/90"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6">
        {/* OTP card */}
        <div className="w-full max-w-md">
          <OtpVerifyForm />
        </div>

        {/* Security info chips */}
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          {/* Secure session */}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-sm">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-sky/10">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="size-5 text-brand-sky"
                aria-hidden="true"
              >
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="M7 10.5L9.5 13L13 7.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Secure Session</p>
              <p className="text-[11px] text-muted-foreground">256-bit encryption active</p>
            </div>
          </div>

          {/* Known device */}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-sm">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-emerald/10">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="size-5 text-brand-emerald"
                aria-hidden="true"
              >
                <rect
                  x="2"
                  y="4"
                  width="16"
                  height="11"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 18h6M10 15v3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Known Device</p>
              <p className="text-[11px] text-muted-foreground">Verified on this browser</p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-background/60 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} CareerArch Precision Systems. All rights reserved.
          </p>
          <nav
            className="flex flex-wrap items-center justify-center gap-4"
            aria-label="Footer links"
          >
            {[
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
              { label: 'Security Architecture', href: '/security' },
              { label: 'Trust Center', href: '/trust' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={{ pathname: href }}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
