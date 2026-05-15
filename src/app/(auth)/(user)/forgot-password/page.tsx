import type { Metadata } from 'next';

import { LogoIcon } from '@assets/icons/custom';
import ContainerLayout from '@components/layout/ContainerLayout';
import Link from 'next/link';
import { AuthSidebar } from './_components/auth-sidebar';
import { ForgotPasswordForm } from './_components/forgot-password-form';

// ── Metadata ────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Forgot Password | CareerArch',
  description:
    "Reset your CareerArch password. Enter your email and we'll send you a secure reset link.",
};

// ── Page (RSC) ──────────────────────────────────────────────────
export default function ForgotPasswordPage() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-background lg:bg-transparent">
      {/* Full-page dark gradient backdrop (desktop only) */}
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0d2137 55%, #091525 100%)',
        }}
        aria-hidden="true"
      />

      <ContainerLayout>
        <div className="grid min-h-screen w-full grid-cols-2 justify-between">
          {/* ── LEFT: Branding Sidebar (hidden below lg) ── */}
          <AuthSidebar />

          {/* ── RIGHT: Form Panel ── */}
          <div className="relative col-span-2 flex flex-1 flex-col lg:col-span-1">
            {/* White bg layer that extends to the right edge on desktop */}
            <div className="absolute inset-y-0 right-[calc(50%-50vw)] left-0 bg-background" />

            <div className="relative z-10 flex flex-1 flex-col">
              {/* Mobile-only top header */}
              <header className="relative flex items-center gap-2.5 px-5 py-5 lg:hidden">
                <div className="absolute bottom-0 left-1/2 h-px w-screen -translate-x-1/2 bg-border" />
                <Link href={{ pathname: '/' }} className="flex gap-x-2.5">
                  <LogoIcon className="size-8 text-brand-navy" />
                  <span className="text-lg font-bold tracking-tight text-foreground">
                    CareerArch
                  </span>
                </Link>
              </header>

              {/* Centered form area */}
              <div className="flex flex-1 flex-col justify-center overflow-y-auto px-5 py-8 sm:px-8 md:px-12 lg:px-14 xl:px-20">
                <div className="mx-auto w-full max-w-md">
                  <ForgotPasswordForm />
                </div>
              </div>

              {/* Mobile-only footer */}
              <footer className="relative flex flex-col items-center gap-3 px-5 py-6 lg:hidden">
                <div className="absolute top-0 left-1/2 h-px w-screen -translate-x-1/2 bg-border" />
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
                    Help Center
                  </Link>
                </nav>
                <p className="text-center text-xs text-muted-foreground">
                  &copy; {new Date().getFullYear()} CareerArch. All rights reserved.
                </p>
              </footer>
            </div>
          </div>
        </div>
      </ContainerLayout>

      {/* Dot grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Ambient glow spots */}
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(14,165,233,0.07) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(16,185,129,0.05) 0%, transparent 50%),
            radial-gradient(circle at 60% 55%, rgba(245,158,11,0.04) 0%, transparent 40%)
          `,
        }}
        aria-hidden="true"
      />
    </main>
  );
}
