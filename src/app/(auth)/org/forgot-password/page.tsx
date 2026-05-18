import type { Metadata } from 'next';

import { LogoIcon } from '@assets/icons/custom';
import ContainerLayout from '@components/layout/ContainerLayout';
import Link from 'next/link';
import { AuthSidebar } from './_components/auth-sidebar';
import { ForgotPasswordOrgForm } from './_components/forgot-password-org-form';

export const metadata: Metadata = {
  title: 'Forgot Password | CareerArch for Employers',
  description:
    "Reset your CareerArch employer account password. Enter your work email and we'll send a secure reset link.",
};

export default function ForgotPasswordOrgPage(): React.JSX.Element {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-background lg:bg-transparent">
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background: 'linear-gradient(135deg, #0f1f3d 0%, #0a1628 55%, #061019 100%)',
        }}
        aria-hidden="true"
      />
      <ContainerLayout>
        <div className="grid min-h-screen w-full grid-cols-2 justify-between">
          <AuthSidebar />
          <div className="relative col-span-2 flex flex-1 flex-col lg:col-span-1">
            <div className="absolute inset-y-0 right-[calc(50%-50vw)] left-0 bg-background" />
            <div className="relative z-10 flex flex-1 flex-col">
              {/* Mobile header */}
              <header className="relative flex items-center gap-2.5 px-5 py-5 lg:hidden">
                <div className="absolute bottom-0 left-1/2 h-px w-screen -translate-x-1/2 bg-border" />
                <Link href={{ pathname: '/' }} className="flex gap-x-2.5">
                  <LogoIcon className="size-8 text-brand-navy" />
                  <span className="text-lg font-bold tracking-tight text-foreground">
                    CareerArch
                  </span>
                </Link>
              </header>

              {/* Form area */}
              <div className="flex flex-1 flex-col justify-center overflow-y-auto px-5 py-8 sm:px-8 md:px-12 lg:px-14 xl:px-20">
                <div className="mx-auto w-full max-w-md">
                  <ForgotPasswordOrgForm />
                </div>
              </div>

              {/* Mobile footer */}
              <footer className="relative flex flex-col items-center gap-3 px-5 py-6 lg:hidden">
                <div className="absolute top-0 left-1/2 h-px w-screen -translate-x-1/2 bg-border" />
                <nav
                  className="flex flex-wrap items-center justify-center gap-5"
                  aria-label="Footer navigation"
                >
                  {[
                    { label: 'Privacy Policy', href: '/privacy' },
                    { label: 'Terms of Service', href: '/terms' },
                    { label: 'Help Center', href: '/help' },
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
                <p className="text-center text-xs text-muted-foreground">
                  &copy; {new Date().getFullYear()} CareerArch. All rights reserved.
                </p>
              </footer>
            </div>
          </div>
        </div>
      </ContainerLayout>

      {/* Dot grid */}
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
