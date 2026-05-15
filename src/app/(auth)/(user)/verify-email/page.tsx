import type { Metadata } from 'next';
import Link from 'next/link';

import { LogoIcon } from '@assets/icons/custom';
import { EmailVerifyStatus } from './_components/email-verify-status';

export const metadata: Metadata = {
  title: 'Email Verified | CareerArch',
  description: 'Your email has been verified. Welcome to CareerArch.',
};
interface PageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function EmailVerifiedPage({
  searchParams,
}: PageProps): Promise<React.JSX.Element> {
  const params = await searchParams;
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Ambient background */}
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

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Home">
          <LogoIcon className="size-7 text-brand-navy" />
          <span className="text-base font-bold tracking-tight text-foreground">CareerArch</span>
        </Link>
      </header>

      {/* Main */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        <EmailVerifyStatus token={params.token} />
      </div>
    </main>
  );
}
