'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { Input } from '@ui/input';

import { MailIcon } from '@assets/icons/custom';

// ✅ Schema + types always from @validations — never defined inline
// ⚠️  Add to src/validations/auth.schema.ts:
//    export const forgotPasswordSchema = z.object({
//      email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
//    });
//    export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
import type { ForgotPasswordInput } from '@validations/auth.schema';
import { forgotPasswordSchema } from '@validations/auth.schema';

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

// ── Icon Badge ──────────────────────────────────────────────────
function ResetIconBadge(): React.JSX.Element {
  return (
    <div className="flex size-16 items-center justify-center rounded-2xl bg-muted shadow-sm">
      <svg viewBox="0 0 32 32" fill="none" className="size-8 text-foreground" aria-hidden="true">
        {/* Lock body */}
        <rect x="7" y="14" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.8" />
        {/* Lock shackle */}
        <path
          d="M11 14V10a5 5 0 0 1 10 0v4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Reset arrow */}
        <path
          d="M19.5 20 A3.5 3.5 0 1 1 16 16.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M16 14 L18 16.5 L13.5 16.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

// ── Component ───────────────────────────────────────────────────
export function ForgotPasswordForm(): React.JSX.Element {
  const [emailSent, setEmailSent] = useState(false);

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(data: ForgotPasswordInput): Promise<void> {
    // TODO: replace with useForgotPasswordMutation from @queries/use-auth
    await new Promise((r) => setTimeout(r, 1400));
    console.log('Forgot password payload:', data);
    setEmailSent(true);
  }

  // ── Success state ──────────────────────────────────────────
  if (emailSent) {
    return (
      <motion.div
        className="flex flex-col items-center gap-5 text-center"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      >
        {/* Success icon */}
        <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-emerald/10">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            className="size-8 text-brand-emerald"
            aria-hidden="true"
          >
            <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M10 16.5 L14 20.5 L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Check your email
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            We&apos;ve sent a reset link to{' '}
            <span className="font-semibold text-foreground">{getValues('email')}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive it? Check your spam folder or{' '}
            <button
              type="button"
              onClick={() => setEmailSent(false)}
              className="font-semibold text-brand-sky hover:underline"
            >
              try another email
            </button>
          </p>
        </div>
        <Link
          href={{ pathname: '/login' }}
          className="mt-2 text-sm font-bold text-foreground transition-colors hover:text-brand-sky"
        >
          ← Back to sign in
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Back to login (desktop-visible) ── */}
      <motion.div variants={itemVariants}>
        <Link
          href={{ pathname: '/login' }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-sky transition-colors hover:text-brand-sky/80"
          aria-label="Back to login"
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
          Back to login
        </Link>
      </motion.div>

      {/* ── Icon badge + heading ── */}
      <motion.div variants={itemVariants} className="space-y-4">
        {/* Desktop: icon is centered; mobile: also centered via outer flex */}
        <div className="hidden lg:flex">
          <ResetIconBadge />
        </div>
        <div className="flex justify-center lg:hidden">
          <ResetIconBadge />
        </div>

        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-3xl leading-none font-extrabold tracking-tight text-foreground lg:text-4xl">
            Forgot your password?
          </h1>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link to get back into your account.
          </p>
        </div>
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
          aria-label="Forgot password form"
        >
          <FieldGroup>
            {/* ── Email ── */}
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="fp-email"
                    className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                  >
                    Email Address
                  </FieldLabel>
                  <div className="relative">
                    <MailIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="fp-email"
                      type="email"
                      placeholder="name@company.com"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      className="h-11 border-transparent bg-input pl-10 text-[15px] transition-all focus:border-ring focus:bg-background"
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Submit button ── */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 h-12 w-full cursor-pointer rounded-xl bg-brand-navy text-[15px] font-bold text-white transition-all duration-150 hover:-translate-y-px hover:bg-brand-navy/90 hover:shadow-card active:translate-y-0"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Sending reset link...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send Reset Link
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

        {/* Mobile-only: contact support */}
        <div className="mt-4 border-t border-border pt-4 text-center lg:hidden">
          <p className="text-sm text-muted-foreground">
            Having trouble?{' '}
            <Link
              href={{ pathname: '/help' }}
              className="font-semibold text-brand-sky hover:underline"
            >
              Contact support
            </Link>
          </p>
        </div>
      </motion.div>

      {/* ── Mobile security note ── */}
      <motion.div
        variants={itemVariants}
        className="flex items-start gap-3 rounded-xl border border-border bg-muted/50 p-4 lg:hidden"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-sky/10">
          <svg viewBox="0 0 20 20" fill="none" className="size-5 text-brand-sky" aria-hidden="true">
            <path
              d="M10 2L3 5.5V10c0 4 3.1 7.7 7 8.5 3.9-.8 7-4.5 7-8.5V5.5L10 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M7 10.5L9.5 13L13 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Your security is our priority. We use industry-standard encryption to protect your account
          details.
        </p>
      </motion.div>

      {/* ── Desktop trust badges ── */}
      <motion.div
        variants={itemVariants}
        className="hidden items-center justify-center gap-2 lg:flex"
      >
        <span className="text-[10px] font-bold tracking-widest text-muted-foreground/50 uppercase">
          Encrypted
        </span>
        <span className="size-1 rounded-full bg-muted-foreground/30" />
        <span className="text-[10px] font-bold tracking-widest text-muted-foreground/50 uppercase">
          Secure Access
        </span>
      </motion.div>
    </motion.div>
  );
}
