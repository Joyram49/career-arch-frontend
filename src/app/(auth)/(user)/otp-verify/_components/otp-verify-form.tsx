'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@ui/button';

// ── Constants ───────────────────────────────────────────────────
const OTP_LENGTH = 6;
const RESEND_COUNTDOWN_SECONDS = 60;

// ── Animation Variants ──────────────────────────────────────────
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const contentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.065 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ── Shield Icon Badge ───────────────────────────────────────────
function ShieldBadge(): React.JSX.Element {
  return (
    <div className="flex size-16 items-center justify-center rounded-2xl bg-muted shadow-sm">
      <svg viewBox="0 0 32 32" fill="none" className="size-8 text-foreground" aria-hidden="true">
        <path
          d="M16 3L5 7.5V15c0 6.6 4.8 12.7 11 14 6.2-1.3 11-7.4 11-14V7.5L16 3Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M11 16.5L14.5 20L21 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ── OTP Digit Input ─────────────────────────────────────────────
interface OtpBoxProps {
  index: number;
  value: string;
  inputRef: (el: HTMLInputElement | null) => void;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  hasError: boolean;
}

function OtpBox({
  index,
  value,
  inputRef,
  onChange,
  onKeyDown,
  onPaste,
  hasError,
}: OtpBoxProps): React.JSX.Element {
  return (
    <motion.input
      ref={inputRef}
      id={`otp-${index}`}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      autoComplete="one-time-code"
      aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
      onChange={(e) => onChange(index, e.target.value)}
      onKeyDown={(e) => onKeyDown(index, e)}
      onPaste={onPaste}
      className={`h-14 w-12 rounded-xl border-2 bg-muted text-center text-xl font-bold text-foreground caret-transparent transition-all duration-150 outline-none sm:h-16 sm:w-14 ${
        hasError
          ? 'border-brand-red bg-brand-red/5 text-brand-red'
          : value
            ? 'border-brand-navy bg-background shadow-sm'
            : 'border-transparent focus:border-ring focus:bg-background focus:shadow-sm'
      }`}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
    />
  );
}

// ── Countdown Timer ─────────────────────────────────────────────
function CountdownTimer({
  seconds,
  onResend,
  canResend,
}: {
  seconds: number;
  onResend: () => void;
  canResend: boolean;
}): React.JSX.Element {
  const pad = (n: number): string => String(n).padStart(2, '0');
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm text-muted-foreground">
        Didn&apos;t receive a code?{' '}
        <button
          type="button"
          disabled={!canResend}
          onClick={onResend}
          className={`font-semibold transition-colors ${
            canResend
              ? 'cursor-pointer text-foreground hover:text-brand-sky'
              : 'cursor-not-allowed text-muted-foreground/50'
          }`}
        >
          Resend Code
        </button>
      </p>

      {!canResend && (
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5">
          <span className="size-2 animate-pulse rounded-full bg-brand-emerald" />
          <span className="text-xs font-bold tracking-widest text-foreground uppercase">
            {pad(mins)}:{pad(secs)} Seconds
          </span>
        </div>
      )}
    </div>
  );
}

// ── Component ───────────────────────────────────────────────────
export function OtpVerifyForm(): React.JSX.Element {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_COUNTDOWN_SECONDS);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Countdown timer ──
  useEffect(() => {
    if (seconds === 0) {
      setCanResend(true);
      return;
    }
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  // ── Focus first input on mount ──
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const focusAt = useCallback((index: number): void => {
    if (index >= 0 && index < OTP_LENGTH) {
      inputRefs.current[index]?.focus();
    }
  }, []);

  const handleChange = useCallback(
    (index: number, raw: string): void => {
      // Accept only digits
      const digit = raw.replace(/\D/g, '').slice(-1);
      setHasError(false);
      setDigits((prev) => {
        const next = [...prev];
        next[index] = digit;
        return next;
      });
      if (digit) focusAt(index + 1);
    },
    [focusAt],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (digits[index]) {
          setDigits((prev) => {
            const next = [...prev];
            next[index] = '';
            return next;
          });
        } else {
          focusAt(index - 1);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        focusAt(index - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        focusAt(index + 1);
      }
    },
    [digits, focusAt],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>): void => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
      if (!pasted) return;
      const next = Array(OTP_LENGTH).fill('');
      pasted.split('').forEach((ch, i) => {
        if (i < OTP_LENGTH) next[i] = ch;
      });
      setDigits(next);
      setHasError(false);
      focusAt(Math.min(pasted.length, OTP_LENGTH - 1));
    },
    [focusAt],
  );

  const handleResend = useCallback((): void => {
    setSeconds(RESEND_COUNTDOWN_SECONDS);
    setCanResend(false);
    setDigits(Array(OTP_LENGTH).fill(''));
    setHasError(false);
    setTimeout(() => focusAt(0), 50);
    // TODO: call resend OTP mutation
    console.warn('Resend OTP triggered');
  }, [focusAt]);

  async function handleVerify(): Promise<void> {
    const code = digits.join('');
    if (code.length < OTP_LENGTH) {
      setHasError(true);
      focusAt(digits.findIndex((d) => !d));
      return;
    }
    setIsSubmitting(true);
    // TODO: replace with useOtpVerifyMutation from @queries/use-auth
    await new Promise((r) => setTimeout(r, 1500));
    console.log('OTP code submitted:', code);
    setIsSubmitting(false);
  }

  const isFilled = digits.every(Boolean);

  return (
    <motion.div
      className="shadow-modal overflow-hidden rounded-2xl border border-border bg-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="p-7 sm:p-9">
        <motion.div
          className="flex flex-col items-center gap-5 text-center"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Shield badge */}
          <motion.div variants={itemVariants}>
            <ShieldBadge />
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Two-Factor Authentication
            </h1>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              Enter the 6-digit code sent to your device.
            </p>
          </motion.div>

          {/* OTP boxes */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 sm:gap-3"
            role="group"
            aria-label="One-time password input"
          >
            {digits.map((digit, i) => (
              <OtpBox
                key={i}
                index={i}
                value={digit}
                inputRef={(el) => {
                  inputRefs.current[i] = el;
                }}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                hasError={hasError && !digit}
              />
            ))}
          </motion.div>

          {/* Error message */}
          {hasError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-brand-red"
              role="alert"
            >
              Please enter all 6 digits to continue.
            </motion.p>
          )}

          {/* Verify button */}
          <motion.div variants={itemVariants} className="w-full">
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleVerify}
              className={`h-12 w-full cursor-pointer rounded-xl text-[15px] font-bold text-white transition-all duration-150 ${
                isFilled && !isSubmitting
                  ? 'bg-brand-navy hover:-translate-y-px hover:bg-brand-navy/90 hover:shadow-card active:translate-y-0'
                  : 'bg-brand-navy/60'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Verifying...
                </span>
              ) : (
                'Verify Code'
              )}
            </Button>
          </motion.div>

          {/* Resend + timer */}
          <motion.div variants={itemVariants} className="w-full">
            <CountdownTimer seconds={seconds} onResend={handleResend} canResend={canResend} />
          </motion.div>

          {/* Back link */}
          <motion.div variants={itemVariants}>
            <Link
              href={{ pathname: '/login' }}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to sign in
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
