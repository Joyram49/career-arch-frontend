'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@ui/button';

// ── Animation Variants ────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ── Animated checkmark icon ───────────────────────────────────────
function SuccessIconAnimated(): React.JSX.Element {
  return (
    <div className="relative mx-auto mb-6 flex size-20 items-center justify-center sm:size-24">
      {/* Desktop: dark square rounded box (matches mail icon desktop style) */}
      <div className="absolute inset-0 hidden rounded-[28px] bg-brand-emerald sm:block" />

      {/* Mobile: circle with animated ring */}
      <div className="relative flex size-20 items-center justify-center sm:hidden">
        {/* Rotating ring */}
        <svg
          viewBox="0 0 80 80"
          className="absolute inset-0 size-full animate-[spin_8s_linear_infinite]"
          aria-hidden="true"
        >
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="var(--brand-emerald)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
        {/* Inner circle */}
        <div className="bg-brand-emerald-light relative flex size-14 items-center justify-center rounded-full">
          {/* Checkmark — mobile */}
          <svg
            viewBox="0 0 28 28"
            fill="none"
            className="size-7 text-brand-emerald"
            aria-hidden="true"
          >
            <motion.path
              d="M6 14.5L11.5 20L22 8"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            />
          </svg>
        </div>
      </div>

      {/* Desktop: checkmark in emerald box */}
      <svg
        viewBox="0 0 28 28"
        fill="none"
        className="relative hidden size-10 text-white sm:block"
        aria-hidden="true"
      >
        <motion.path
          d="M5 14.5L11.5 21L23 7"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.65, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        />
      </svg>
    </div>
  );
}

// ── Auto-redirect countdown ───────────────────────────────────────
function AutoRedirectBar(): React.JSX.Element {
  const router = useRouter();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  const progress = ((5 - seconds) / 5) * 100;

  return (
    <div className="space-y-2">
      <p className="text-center text-xs text-muted-foreground">
        Redirecting to sign in{' '}
        <span className="font-bold text-foreground tabular-nums">{seconds}s</span>
      </p>
      {/* Progress bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-brand-emerald"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.9, ease: 'linear' }}
        />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export function EmailVerifiedCard(): React.JSX.Element {
  return (
    <motion.div
      className="w-full max-w-sm sm:max-w-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Main Card ── */}
      <motion.div
        variants={itemVariants}
        className="shadow-modal relative overflow-hidden rounded-3xl border border-border bg-card p-7 sm:p-10"
      >
        {/* Top shimmer — emerald tint (same pattern as verify card, different color) */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] rounded-t-3xl"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--brand-emerald), transparent)',
          }}
          aria-hidden="true"
        />

        {/* Success Icon */}
        <SuccessIconAnimated />

        {/* Heading */}
        <motion.div variants={itemVariants} className="mb-6 space-y-3 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Email verified!
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            Your account is now active. You&apos;re all set to start your career journey with{' '}
            <span className="font-bold text-brand-sky">CareerArch</span>.
          </p>
        </motion.div>

        {/* What's next card — 3 micro-steps */}
        <motion.div
          variants={itemVariants}
          className="bg-brand-emerald-light/30 mb-6 rounded-xl border border-brand-emerald/20 p-4"
        >
          <p className="mb-3 text-[11px] font-bold tracking-widest text-brand-emerald uppercase">
            What&apos;s next
          </p>
          <ul className="space-y-2.5">
            {[
              'Signin to your account',
              'Complete your profile to get noticed by employers',
              'Browse thousands of jobs matching your skills',
              'Track your applications from one dashboard',
            ].map((step, i) => (
              <li key={step} className="flex items-start gap-2.5">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-emerald text-[9px] font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">{step}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="space-y-3">
          <Link href={{ pathname: '/login' }} className="block">
            <Button
              type="button"
              className="h-12 w-full cursor-pointer rounded-xl bg-brand-navy text-[15px] font-bold text-white transition-all duration-150 hover:-translate-y-px hover:bg-brand-navy/90 hover:shadow-card active:translate-y-0"
            >
              Sign in
            </Button>
          </Link>
        </motion.div>

        {/* Auto redirect countdown */}
        {/* <motion.div variants={itemVariants} className="mt-5">
          <AutoRedirectBar />
        </motion.div> */}

        {/* Security footer — exact same as verify card */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[9px] font-bold tracking-[0.18em] text-muted-foreground/50 uppercase">
            Security Protocol V2.4
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </motion.div>

      {/* ── Help Card (mobile only — same as verify page) ── */}
      <motion.div
        variants={itemVariants}
        className="mt-4 rounded-2xl border border-border bg-card p-4 sm:hidden"
      >
        <div className="flex items-start gap-3">
          <div className="bg-brand-emerald-light flex size-8 shrink-0 items-center justify-center rounded-full">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="size-4 text-brand-emerald"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.4" />
              <path
                d="M10 9v5M10 7v.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">You&apos;re verified!</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              Your account is fully active. Visit our{' '}
              <Link
                href={{ pathname: '/help' }}
                className="font-semibold text-brand-sky underline-offset-2 hover:underline"
              >
                Help Center
              </Link>{' '}
              if you have any questions getting started.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
