import type { Metadata } from 'next';

import { LogoIcon } from '@assets/icons/custom';
import ContainerLayout from '@components/layout/ContainerLayout';
import Link from 'next/link';
import { AuthSidebar } from './_components/auth-sidebar';
import { InvalidTokenPage } from './_components/invalid-token-page';
import { ResetPasswordForm } from './_components/reset-password-form';

// ── Metadata ────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Create New Password | CareerArch',
  description:
    'Create a strong new password for your CareerArch account and get back to building your career.',
};

// ── Page props ──────────────────────────────────────────────────
interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

// ── Page (RSC) ──────────────────────────────────────────────────
export default async function ResetPasswordPage({
  searchParams,
}: PageProps): Promise<React.JSX.Element> {
  const { token } = await searchParams;
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-background lg:bg-transparent">
      {/* Full-page dark gradient backdrop (desktop only) */}
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background: 'linear-gradient(135deg, #0d1117 0%, #0a1929 55%, #071525 100%)',
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
              <header className="relative flex items-center justify-between gap-2.5 px-5 py-5 lg:hidden">
                <div className="absolute bottom-0 left-1/2 h-px w-screen -translate-x-1/2 bg-border" />
                <Link
                  href={{ pathname: '/forgot-password' }}
                  aria-label="Go back"
                  className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="size-5" aria-hidden="true">
                    <path
                      d="M10 3L5 8L10 13"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <Link
                  href={{ pathname: '/' }}
                  className="flex items-center gap-2"
                  aria-label="CareerArch home"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-brand-navy">
                    <LogoIcon className="size-4 text-white" />
                  </div>
                  <span className="text-base font-bold tracking-tight text-foreground">
                    CareerArch
                  </span>
                </Link>
                {/* Spacer to keep logo centred */}
                <div className="size-9" aria-hidden="true" />
              </header>

              {/* ── Main content area ── */}
              {token !== undefined && token.trim() !== '' ? (
                /* Valid token — show the form */
                <div className="flex flex-1 flex-col justify-center overflow-y-auto px-5 py-8 sm:px-8 md:px-12 lg:px-14 xl:px-20">
                  <div className="mx-auto w-full max-w-md">
                    <ResetPasswordForm token={token} />
                  </div>
                </div>
              ) : (
                /* Missing / empty token — show friendly error */
                <InvalidTokenPage />
              )}

              {/* Desktop-only footer */}
              <footer className="relative hidden px-14 py-6 lg:flex xl:px-20">
                <nav className="flex flex-wrap items-center gap-6" aria-label="Footer navigation">
                  {[
                    { label: 'Help', href: '/help' },
                    { label: 'Security Architecture', href: '/security' },
                    { label: 'Privacy Policy', href: '/privacy' },
                  ].map(({ label, href }) => (
                    <Link
                      key={label}
                      href={{ pathname: href }}
                      className="text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase transition-colors hover:text-muted-foreground"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </footer>

              {/* Mobile-only footer */}
              <footer className="relative flex flex-col items-center gap-4 px-5 py-8 lg:hidden">
                <div className="absolute top-0 left-1/2 h-px w-screen -translate-x-1/2 bg-border" />
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-brand-navy">
                    <LogoIcon className="size-3.5 text-white" />
                  </div>
                  <span className="text-sm font-bold tracking-tight text-foreground">
                    CareerArch
                  </span>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  &copy; {new Date().getFullYear()} CareerArch. Precision in Professional Growth.
                </p>
                <nav
                  className="flex flex-wrap items-center justify-center gap-4"
                  aria-label="Footer navigation"
                >
                  {['Privacy Policy', 'Terms of Service', 'Security', 'Help Center'].map((item) => (
                    <Link
                      key={item}
                      href={{ pathname: `/${item.toLowerCase().replace(/\s+/g, '-')}` }}
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item}
                    </Link>
                  ))}
                </nav>
              </footer>
            </div>
          </div>
        </div>
      </ContainerLayout>

      {/* Blueprint dot grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />
    </main>
  );
}
