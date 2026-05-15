'use client';

import Link from 'next/link';

import { Button } from '@ui/button';

interface Props {
  message: string;
}

export function EmailVerificationErrorCard({ message }: Props): React.JSX.Element {
  return (
    <div className="shadow-modal w-full max-w-sm rounded-3xl border border-border bg-card p-7 text-center sm:max-w-md sm:p-10">
      {/* Error Icon */}
      <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-red-500/10">
        <svg viewBox="0 0 24 24" fill="none" className="size-10 text-red-500" aria-hidden="true">
          <path
            d="M12 8V12M12 16H12.01M10.29 3.86L1.82 18A2 2 0 0 0 3.53 21H20.47A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
        Verification failed
      </h1>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{message}</p>

      <div className="mt-6 space-y-3">
        <Link href="/register" className="block">
          <Button className="h-12 w-full rounded-xl">Create account again</Button>
        </Link>

        <Link href={{ pathname: '/contact' }} className="block">
          <Button variant="outline" className="h-12 w-full rounded-xl">
            Contact support
          </Button>
        </Link>
      </div>
    </div>
  );
}
