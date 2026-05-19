'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

import { resendVerificationEmail } from '@services/org/auth.service';
import { Button } from '@ui/button';
import { Separator } from '@ui/separator';
import { toast } from 'sonner';

// ── Types ────────────────────────────────────────────────────────
interface VerifyEmailOrgCardProps {
  email: string;
}

// ── Animation Variants ────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const RESEND_COOLDOWN = 60;

// ── Animated Mail Icon ────────────────────────────────────────────
function BuildingMailIcon(): React.JSX.Element {
  return (
    <div className="relative mx-auto mb-6 flex size-20 items-center justify-center sm:size-24">
      {/* Desktop: dark square box */}
      <div className="absolute inset-0 hidden rounded-[28px] bg-brand-navy sm:block" />
      {/* Mobile: circle with ring */}
      <div className="relative flex size-20 items-center justify-center sm:hidden">
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
            stroke="var(--brand-sky)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
        <div className="relative flex size-14 items-center justify-center rounded-full bg-accent">
          <svg viewBox="0 0 28 22" fill="none" className="size-7 text-brand-sky" aria-hidden="true">
            <rect
              x="1"
              y="1"
              width="26"
              height="20"
              rx="4"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M1 6L14 13.5L27 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {/* Desktop icon */}
      <svg
        viewBox="0 0 28 22"
        fill="none"
        className="relative hidden size-9 text-white sm:block"
        aria-hidden="true"
      >
        <rect x="1" y="1" width="26" height="20" rx="4" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M1 6L14 13.5L27 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ── Countdown Badge ───────────────────────────────────────────────
function CountdownBadge({ seconds }: { seconds: number }): React.JSX.Element {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-muted px-2.5 py-0.5 font-mono text-xs font-semibold text-muted-foreground tabular-nums">
      {mm}:{ss}
    </span>
  );
}

// ── Main Component ────────────────────────────────────────────────
export function VerifyEmailOrgCard({ email }: VerifyEmailOrgCardProps): React.JSX.Element {
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [resendCount, setResendCount] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isPending, startTransition] = useTransition();

  const startCountdown = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCountdown(RESEND_COOLDOWN);
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startCountdown();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startCountdown]);

  async function handleResend(): Promise<void> {
    if (countdown > 0 || isPending) return;
    setResendSuccess(false);
    startTransition(async () => {
      const result = await resendVerificationEmail({ email });
      if (result.success) {
        setResendSuccess(true);
        setResendCount((c) => c + 1);
        startCountdown();
        toast.success('Verification email resent. Please check your inbox.');
      } else {
        toast.error(result.message);
      }
    });

    // Auto-clear success message after 4s
    setTimeout(() => setResendSuccess(false), 4000);
  }

  return (
    <motion.div
      className="w-full max-w-sm sm:max-w-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="shadow-modal relative overflow-hidden rounded-3xl border border-border bg-card p-7 sm:p-10"
      >
        {/* Top shimmer */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] rounded-t-3xl"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--brand-sky), transparent)',
          }}
          aria-hidden="true"
        />

        <BuildingMailIcon />

        {/* Heading */}
        <div className="mb-6 space-y-3 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Verify your work email
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            We sent a verification link to{' '}
            <span className="font-bold text-foreground">{email}</span>. Click it to activate your
            employer account.
          </p>
        </div>

        {/* Mobile CTA */}
        <Button
          type="button"
          onClick={() => {
            window.location.href = 'mailto:';
          }}
          className="mb-5 h-12 w-full cursor-pointer rounded-xl bg-brand-navy text-[15px] font-bold text-white transition-all duration-150 hover:-translate-y-px hover:bg-brand-navy/90 hover:shadow-card active:translate-y-0 sm:hidden"
        >
          Open Mail App
        </Button>

        {/* Resend */}
        <div className="space-y-3">
          {resendSuccess && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-brand-emerald/10 px-3 py-2 text-center text-xs font-semibold text-brand-emerald"
              role="status"
            >
              ✓ Verification email resent successfully
            </motion.p>
          )}

          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || isPending}
            className="hidden w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-muted/50 px-5 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 sm:flex"
            aria-label="Resend verification email"
          >
            <span className="flex items-center gap-2.5">
              {isPending ? (
                <span className="size-4 animate-spin rounded-full border-2 border-border border-t-brand-sky" />
              ) : (
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                >
                  <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.4" />
                  <path
                    d="M10 6v4l2.5 2.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {isPending ? 'Sending...' : 'Resend verification email'}
            </span>
            {countdown > 0 && <CountdownBadge seconds={countdown} />}
          </button>

          <div className="flex flex-col items-center gap-2 sm:hidden">
            <p className="text-sm text-muted-foreground">Didn't receive the email?</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || isPending}
                className="text-sm font-bold text-brand-sky underline-offset-2 transition-all hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? 'Sending...' : 'Resend email'}
              </button>
              {countdown > 0 && <CountdownBadge seconds={countdown} />}
            </div>
          </div>

          <p className="hidden text-center text-xs text-muted-foreground sm:block">
            Didn't receive an email? Check your spam folder.
          </p>
        </div>

        <Separator className="my-5" />

        <div className="flex justify-center">
          <Link
            href={{ pathname: '/org/register' }}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg viewBox="0 0 20 20" fill="none" className="size-4 shrink-0" aria-hidden="true">
              <path
                d="M13.5 4.5L16 7M4 16l2-6 9-9 3 3-9 9-6 2z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {resendCount > 0 ? 'Wrong email? Change email address' : 'Wrong email? Change address'}
          </Link>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[9px] font-bold tracking-[0.18em] text-muted-foreground/50 uppercase">
            Security Protocol V2.4
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </motion.div>
      {/* ── Help Card (mobile only, matches Figma) ── */}
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
            <p className="text-sm font-bold text-foreground">Need help?</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              If you&apos;re having trouble, check your spam folder or visit our{' '}
              <Link
                href={{ pathname: '/help' }}
                className="font-semibold text-brand-sky underline-offset-2 hover:underline"
              >
                Help Center
              </Link>{' '}
              for more info.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
