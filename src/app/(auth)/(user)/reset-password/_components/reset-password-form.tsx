'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import type { Resolver } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { Input } from '@ui/input';

import { EyeOffIcon, EyeOpenIcon, LockIcon } from '@assets/icons/custom';

import { PasswordStrengthMeter } from '@components/shared/password-strength-meter';

import type { ResetPasswordInput } from '@validations/auth.schema';
import { resetPasswordSchema } from '@validations/auth.schema';

// ── Animation Variants ──────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ── Inline Strength Bar (desktop design, shown between fields) ──
interface StrengthBarProps {
  password: string;
}

function getStrengthMeta(password: string): {
  score: number;
  label: string;
  percent: number;
  colorClass: string;
  textClass: string;
} {
  if (!password)
    return {
      score: 0,
      label: '',
      percent: 0,
      colorClass: 'bg-border',
      textClass: 'text-muted-foreground',
    };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const meta = [
    { label: 'WEAK', percent: 25, colorClass: 'bg-brand-red', textClass: 'text-brand-red' },
    { label: 'MODERATE', percent: 50, colorClass: 'bg-brand-amber', textClass: 'text-brand-amber' },
    { label: 'PROFESSIONAL', percent: 75, colorClass: 'bg-brand-sky', textClass: 'text-brand-sky' },
    {
      label: 'STRONG',
      percent: 100,
      colorClass: 'bg-brand-emerald',
      textClass: 'text-brand-emerald',
    },
  ];

  return { score, ...(meta[score - 1] ?? meta[0]) };
}

function InlineStrengthBar({ password }: StrengthBarProps): React.JSX.Element {
  const { label, percent, colorClass, textClass } = getStrengthMeta(password);

  if (!password) return <></>;

  return (
    <div className="mt-2 space-y-1.5">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          Strength: <span className={textClass}>{label}</span>
        </span>
        <span className={`text-[11px] font-bold ${textClass}`}>{percent}%</span>
      </div>
      {/* Single progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        />
      </div>
    </div>
  );
}

// ── Requirements Card (desktop) ─────────────────────────────────
interface Requirement {
  met: boolean;
  label: string;
  badge: string;
}

function RequirementsCard({ password }: { password: string }): React.JSX.Element {
  const requirements: Requirement[] = [
    { met: password.length >= 8, label: 'Minimum 8 characters', badge: 'MIN_8' },
    { met: /[A-Z]/.test(password), label: 'At least one uppercase letter', badge: 'A-Z' },
    { met: /[0-9]/.test(password), label: 'Includes at least one number', badge: '0-9' },
    {
      met: /[^A-Za-z0-9]/.test(password),
      label: 'Includes a special character (@, #, $)',
      badge: '!@#',
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <p className="mb-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
        Password Requirements
      </p>
      <ul className="space-y-2.5" role="list" aria-label="Password requirements">
        {requirements.map((req) => (
          <li key={req.label} className="flex items-center gap-3">
            {req.met ? (
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="size-5 shrink-0 text-brand-emerald"
                aria-hidden="true"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="9"
                  fill="currentColor"
                  fillOpacity="0.15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M6.5 10.5L9 13L13.5 7.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="size-5 shrink-0 text-muted-foreground/40"
                aria-hidden="true"
              >
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
            <span
              className={`flex-1 text-sm font-medium ${req.met ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {req.label}
            </span>
            {/* Badge tag — mobile-style hidden on desktop, shown via responsive class */}
            <span
              className={`hidden rounded px-1.5 py-0.5 font-mono text-[10px] font-bold sm:block lg:hidden xl:block ${req.met ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-muted text-muted-foreground'}`}
            >
              {req.badge}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Mobile reset icon badge ─────────────────────────────────────
function ResetBadge(): React.JSX.Element {
  return (
    <div className="flex size-14 items-center justify-center rounded-2xl bg-muted shadow-sm">
      <svg viewBox="0 0 32 32" fill="none" className="size-7 text-foreground" aria-hidden="true">
        <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M16 10 A6 6 0 1 1 10.5 19"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M8 17 L10.5 19.5 L13 17"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

// ── Component ───────────────────────────────────────────────────
export function ResetPasswordForm(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema) as Resolver<ResetPasswordInput>,
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');

  async function onSubmit(data: ResetPasswordInput): Promise<void> {
    // TODO: replace with useResetPasswordMutation from @queries/use-auth
    await new Promise((r) => setTimeout(r, 1500));
    console.log('Reset password payload:', data);
    setSuccess(true);
  }

  // ── Success State ──────────────────────────────────────────
  if (success) {
    return (
      <motion.div
        className="flex flex-col items-center gap-5 text-center"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      >
        <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-emerald/10">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            className="size-8 text-brand-emerald"
            aria-hidden="true"
          >
            <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M10 16.5L14 20.5L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Password reset!
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Your password has been updated successfully. You can now sign in with your new password.
          </p>
        </div>
        <Link
          href={{ pathname: '/login' }}
          className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-navy text-[15px] font-bold text-white transition-all duration-150 hover:bg-brand-navy/90"
        >
          Sign In Now
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Mobile icon badge ── */}
      <motion.div variants={itemVariants} className="flex lg:hidden">
        <ResetBadge />
      </motion.div>

      {/* ── Heading ── */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-foreground lg:text-4xl">
          Create new password
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Your new password must be unique from those previously used to ensure your career
          architecture remains secure.
        </p>
      </motion.div>

      {/* ── Form card ──
          Bordered card on mobile; flat/transparent on desktop.
      ── */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-border bg-card p-5 shadow-card lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
          aria-label="Create new password form"
        >
          <FieldGroup>
            {/* ── New Password ── */}
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="new-password"
                    className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                  >
                    New Password
                  </FieldLabel>
                  <div className="relative">
                    <LockIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      aria-invalid={!!errors.password}
                      className="h-11 border-transparent bg-input pr-11 pl-10 text-[15px] transition-all focus:border-ring focus:bg-background"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute top-1/2 right-3.5 -translate-y-1/2 p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {showPassword ? (
                        <EyeOpenIcon className="size-4" />
                      ) : (
                        <EyeOffIcon className="size-4" />
                      )}
                    </button>
                  </div>

                  {/* Desktop: inline strength bar between fields */}
                  <div className="hidden lg:block">
                    <InlineStrengthBar password={passwordValue} />
                  </div>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Confirm New Password ── */}
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="confirm-password"
                    className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                  >
                    Confirm New Password
                  </FieldLabel>
                  <div className="relative">
                    {/* Shield icon for confirm field matching Figma */}
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    >
                      <path
                        d="M10 2L3 5V9.5c0 4.1 3 7.9 7 8.5 4-0.6 7-4.4 7-8.5V5L10 2Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <Input
                      {...field}
                      id="confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat new password"
                      autoComplete="new-password"
                      aria-invalid={!!errors.confirmPassword}
                      className="h-11 border-transparent bg-input pr-11 pl-10 text-[15px] transition-all focus:border-ring focus:bg-background"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                      className="absolute top-1/2 right-3.5 -translate-y-1/2 p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {showConfirm ? (
                        <EyeOpenIcon className="size-4" />
                      ) : (
                        <EyeOffIcon className="size-4" />
                      )}
                    </button>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Password Requirements Card ── */}
            {passwordValue && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              >
                {/* Desktop: custom requirements card */}
                <div className="hidden lg:block">
                  <RequirementsCard password={passwordValue} />
                </div>

                {/* Mobile: reuse existing PasswordStrengthMeter (segmented bar + criteria) */}
                <div className="block lg:hidden">
                  <PasswordStrengthMeter password={passwordValue} />
                </div>
              </motion.div>
            )}

            {/* ── Submit Button ── */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 h-12 w-full cursor-pointer rounded-xl bg-brand-navy text-[15px] font-bold text-white transition-all duration-150 hover:-translate-y-px hover:bg-brand-navy/90 hover:shadow-card active:translate-y-0"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Resetting password...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Reset Password
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8H13M9 4L13 8L9 12"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </Button>
          </FieldGroup>
        </form>

        {/* Mobile: contact support link */}
        <div className="mt-4 border-t border-border pt-4 lg:hidden">
          <Link
            href={{ pathname: '/help' }}
            className="flex items-center justify-center gap-2 text-sm font-semibold text-brand-sky transition-colors hover:text-brand-sky/80"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="size-4 shrink-0 text-brand-sky"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M7.5 7.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="10" cy="15" r="0.8" fill="currentColor" />
            </svg>
            Having trouble resetting? Contact support
          </Link>
        </div>
      </motion.div>

      {/* ── Desktop: Back to Sign In link ── */}
      <motion.div variants={itemVariants} className="hidden text-center lg:flex lg:justify-center">
        <Link
          href={{ pathname: '/login' }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-sky transition-colors hover:text-brand-sky/80"
        >
          <svg viewBox="0 0 16 16" fill="none" className="size-4 shrink-0" aria-hidden="true">
            <path
              d="M10 3L5 8L10 13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Sign In
        </Link>
      </motion.div>
    </motion.div>
  );
}
