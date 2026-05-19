'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import type { Resolver } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { Input } from '@ui/input';

import { EyeOffIcon, EyeOpenIcon, LockIcon } from '@assets/icons/custom';
import { PasswordStrengthMeter } from '@components/shared/password-strength-meter';

import type { ResetPasswordInput } from '@validations/auth.schema';
import { resetPasswordSchema } from '@validations/auth.schema';

import { resetPassword } from '@services/org/auth.service';
import { ExpiredTokenState } from './expired-token-state';
import { InlineStrengthBar } from './inline-strength-bar';
import { RequirementsCard } from './password-requirement-card';
import { SuccessState } from './success-state';

// ── Animation Variants ──────────────────────────────────────────────
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

// ── Props ────────────────────────────────────────────────────────────
interface ResetPasswordOrgFormProps {
  token: string;
}

type FormState = 'idle' | 'success' | 'token_error';

// ── Component ────────────────────────────────────────────────────────
export function ResetPasswordOrgForm({ token }: ResetPasswordOrgFormProps): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<FormState>('idle');

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema) as Resolver<ResetPasswordInput>,
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');

  if (formState === 'token_error') return <ExpiredTokenState />;
  if (formState === 'success') return <SuccessState />;

  function onSubmit(data: ResetPasswordInput): void {
    startTransition(async () => {
      const result = await resetPassword({
        token,
        newPassword: data.password,
        confirmPassword: data.confirmPassword,
      });
      if (!result.success) {
        // Detect expired / invalid token responses from backend
        const isTokenError =
          result.message.toLowerCase().includes('invalid') ||
          result.message.toLowerCase().includes('expired');

        if (isTokenError) {
          setFormState('token_error');
          return;
        }

        toast.error(result.message);
        return;
      }

      setFormState('success');
    });
  }

  return (
    <motion.div
      className="flex flex-col gap-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Heading */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-foreground lg:text-4xl">
          Create new password
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Your new employer account password must be different from previously used passwords to
          maintain organization security.
        </p>
      </motion.div>

      {/* Form card */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-border bg-card p-5 shadow-card lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
          aria-label="Create new employer password form"
        >
          <FieldGroup>
            {/* New Password */}
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="org-new-password"
                    className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                  >
                    New Password
                  </FieldLabel>
                  <div className="relative">
                    <LockIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="org-new-password"
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
                  {/* Desktop: inline bar */}
                  <div className="hidden lg:block">
                    <InlineStrengthBar password={passwordValue} />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Confirm Password */}
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="org-confirm-password"
                    className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                  >
                    Confirm New Password
                  </FieldLabel>
                  <div className="relative">
                    {/* Shield icon */}
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
                      id="org-confirm-password"
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

            {/* Requirements — animate in when user starts typing */}
            {passwordValue && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              >
                <div className="hidden lg:block">
                  <RequirementsCard password={passwordValue} />
                </div>
                <div className="block lg:hidden">
                  <PasswordStrengthMeter password={passwordValue} />
                </div>
              </motion.div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="mt-1 h-12 w-full cursor-pointer rounded-xl bg-brand-navy text-[15px] font-bold text-white transition-all duration-150 hover:-translate-y-px hover:bg-brand-navy/90 hover:shadow-card active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
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

        {/* Mobile support link */}
        <div className="mt-4 border-t border-border pt-4 lg:hidden">
          <Link
            href={{ pathname: '/help' }}
            className="flex items-center justify-center gap-2 text-sm font-semibold text-brand-sky transition-colors hover:text-brand-sky/80"
          >
            <svg viewBox="0 0 20 20" fill="none" className="size-4 shrink-0" aria-hidden="true">
              <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M7.5 7.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="10" cy="15" r="0.8" fill="currentColor" />
            </svg>
            Having trouble? Contact support
          </Link>
        </div>
      </motion.div>

      {/* Desktop back link */}
      <motion.div variants={itemVariants} className="hidden text-center lg:flex lg:justify-center">
        <Link
          href={{ pathname: '/org/login' }}
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
          Back to Employer Sign In
        </Link>
      </motion.div>
    </motion.div>
  );
}
