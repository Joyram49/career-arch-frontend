'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { Input } from '@ui/input';

import { MailIcon } from '@assets/icons/custom';

import { forgotPassword } from '@services/user/auth.service';
import type { ForgotPasswordInput } from '@validations/auth.schema';
import { forgotPasswordSchema } from '@validations/auth.schema';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { ResetIconBadge } from './reset-icon-badge';
import { SuccessState } from './success-state';

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

// ── Component ───────────────────────────────────────────────────
export function ForgotPasswordForm(): React.JSX.Element {
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    control,
    getValues,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  // ── Success state ──────────────────────────────────────────
  if (isSubmitSuccessful) {
    return <SuccessState email={getValues('email')} onRetry={() => reset({ email: '' })} />;
  }

  // ── Form submit ────────────────────────────────────────────
  function onSubmit(data: ForgotPasswordInput): void {
    startTransition(async () => {
      const result = await forgotPassword({ email: data.email });

      if (!result.success) {
        toast.error(result.message);
        return;
      }
    });
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Back to login ── */}
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

      {/* ── Icon + heading ── */}
      <motion.div variants={itemVariants} className="space-y-4">
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
            Enter your email and we&apos;ll send you a secure reset link to get back into your
            account.
          </p>
        </div>
      </motion.div>

      {/* ── Form card ── */}
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
                      aria-describedby={errors.email ? 'fp-email-error' : undefined}
                      className="h-11 border-transparent bg-input pl-10 text-[15px] transition-all focus:border-ring focus:bg-background"
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Submit ── */}
            <Button
              type="submit"
              disabled={isPending}
              className="mt-1 h-12 w-full cursor-pointer rounded-xl bg-brand-navy text-[15px] font-bold text-white transition-all duration-150 hover:-translate-y-px hover:bg-brand-navy/90 hover:shadow-card active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
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

        {/* Mobile: contact support */}
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
          Your security is our priority. The reset link is valid for 1 hour and can only be used
          once.
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
          1-Hour Expiry
        </span>
        <span className="size-1 rounded-full bg-muted-foreground/30" />
        <span className="text-[10px] font-bold tracking-widest text-muted-foreground/50 uppercase">
          Single-Use
        </span>
      </motion.div>
    </motion.div>
  );
}
