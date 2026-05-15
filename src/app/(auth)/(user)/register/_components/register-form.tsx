'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import type { Resolver } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { Input } from '@ui/input';

// ✅ Schema + types always from @validations — never defined inline
import type { RegisterInput } from '@validations/auth.schema';
import { registerSchema } from '@validations/auth.schema';

// ✅ Icons always from @assets/icons/custom
import { EyeOffIcon, EyeOpenIcon, LockIcon, MailIcon, UserIcon } from '@assets/icons/custom';
import { PasswordStrengthMeter } from '@components/shared/password-strength-meter';
import { SocialAuth } from './social-auth';
// ── Animation Variants ──────────────────────────────────────────
// ✅ Typed Variants, ease as cubic-bezier (not string)
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.065 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

// ── Component ───────────────────────────────────────────────────
export function RegisterForm(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    // ✅ Cast resolver — registerSchema has .refine() which can cause type mismatch
    resolver: zodResolver(registerSchema) as Resolver<RegisterInput>,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  // Watch password value for the strength meter
  const passwordValue = watch('password');

  async function onSubmit(data: RegisterInput): Promise<void> {
    // TODO: replace with useRegisterMutation from @queries/use-auth
    await new Promise((r) => setTimeout(r, 1400));
    console.log('Register payload:', data);
  }

  return (
    <motion.div
      className="flex flex-col gap-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Heading ── */}
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-3xl leading-none font-extrabold tracking-tight text-foreground lg:text-4xl">
          Create your account
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Join <span className="font-bold text-brand-sky">2.4M+</span> professionals today
        </p>
      </motion.div>

      {/* ── Social Auth (OAuth buttons + divider) ── */}
      <motion.div variants={itemVariants}>
        <SocialAuth />
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
          aria-label="Create account form"
        >
          <FieldGroup>
            {/* ── Name Row: First + Last ── */}
            <div className="grid grid-cols-2 gap-3">
              {/* First Name */}
              <Controller
                name="firstName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="firstName"
                      className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                    >
                      First Name
                    </FieldLabel>
                    <div className="relative">
                      <UserIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        id="firstName"
                        type="text"
                        placeholder="John"
                        autoComplete="given-name"
                        aria-invalid={!!errors.firstName}
                        className="h-11 border-transparent bg-input pl-10 text-[15px] transition-all focus:border-ring focus:bg-background"
                      />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Last Name */}
              <Controller
                name="lastName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="lastName"
                      className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                    >
                      Last Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      autoComplete="family-name"
                      aria-invalid={!!errors.lastName}
                      className="h-11 border-transparent bg-input text-[15px] transition-all focus:border-ring focus:bg-background"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* ── Email Address ── */}
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="email"
                    className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                  >
                    Email Address
                  </FieldLabel>
                  <div className="relative">
                    <MailIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      className="h-11 border-transparent bg-input pl-10 text-[15px] transition-all focus:border-ring focus:bg-background"
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Password ── */}
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel
                      htmlFor="password"
                      className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                    >
                      Password
                    </FieldLabel>
                    <span className="text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">
                      Secure Encryption
                    </span>
                  </div>
                  <div className="relative">
                    <LockIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
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

                  {/* Password strength meter — shown inline on desktop, below confirm on mobile */}
                  <div className="hidden sm:block">
                    <PasswordStrengthMeter password={passwordValue} />
                  </div>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Confirm Password ── */}
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="confirmPassword"
                    className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                  >
                    Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <LockIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      aria-invalid={!!errors.confirmPassword}
                      className="h-11 border-transparent bg-input pr-11 pl-10 text-[15px] transition-all focus:border-ring focus:bg-background"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={
                        showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                      }
                      className="absolute top-1/2 right-3.5 -translate-y-1/2 p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {showConfirmPassword ? (
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

            {/* Mobile: strength meter shown below confirm password (matches Figma mobile layout) */}
            <div className="block sm:hidden">
              <PasswordStrengthMeter password={passwordValue} />
            </div>

            {/* ── Accept Terms ── */}
            <Controller
              control={control}
              name="acceptTerms"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-start gap-3 pt-0.5">
                    <Checkbox
                      id="acceptTerms"
                      checked={field.value}
                      aria-invalid={fieldState.invalid}
                      onCheckedChange={field.onChange}
                      className="mt-0.5 border-border data-[state=checked]:border-brand-navy data-[state=checked]:bg-brand-navy data-[state=checked]:text-white"
                    />
                    <FieldLabel
                      htmlFor="acceptTerms"
                      className="cursor-pointer text-sm leading-relaxed font-normal text-muted-foreground"
                    >
                      I agree to the{' '}
                      <Link
                        href={{ pathname: '/terms' }}
                        className="font-semibold text-brand-sky hover:underline"
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        href={{ pathname: '/privacy' }}
                        className="font-semibold text-brand-sky hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </FieldLabel>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Submit Button ── */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 h-12 w-full cursor-pointer rounded-xl bg-brand-navy text-[15px] font-bold text-white transition-all duration-150 hover:-translate-y-px hover:bg-brand-navy/90 hover:shadow-card active:translate-y-0"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </FieldGroup>
        </form>
      </motion.div>

      {/* ── Sign in link ── */}
      <motion.p variants={itemVariants} className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href={{ pathname: '/login' }}
          className="font-bold text-foreground transition-colors hover:text-brand-sky"
        >
          Sign in
        </Link>
      </motion.p>

      {/* ── Employer CTA ── */}
      <motion.div variants={itemVariants} className="border-t border-border pt-4">
        <Link
          href={{ pathname: '/register-org' }}
          className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>Are you an employer?</span>
          <span className="font-semibold text-foreground">Register your company</span>
          <svg viewBox="0 0 16 16" fill="none" className="size-3.5 shrink-0" aria-hidden="true">
            <path
              d="M3 8H13M9 4L13 8L9 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </motion.div>
    </motion.div>
  );
}
