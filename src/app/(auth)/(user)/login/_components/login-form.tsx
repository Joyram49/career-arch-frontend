'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import type { Resolver } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';

// ✅ Schema + types always from @validations — never defined inline
import type { LoginInput } from '@validations/auth.schema';
import { loginSchema } from '@validations/auth.schema';

// ✅ Icons always from @assets/icons/custom
import { EyeOffIcon, EyeOpenIcon, LockIcon, MailIcon } from '@assets/icons/custom';

import { Field, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { SocialAuth } from './social-auth';

// ── Animation variants ──────────────────────────────────────────
// ✅ Typed with Variants, ease as cubic-bezier array (not string)
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94] as const, // easeOut cubic-bezier
    },
  },
};

// ── Component ───────────────────────────────────────────────────
export function LoginForm(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    // ✅ Cast resolver to fix optional().default() type mismatch
    resolver: zodResolver(loginSchema) as Resolver<LoginInput>,
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  async function onSubmit(data: LoginInput): Promise<void> {
    // TODO: replace with useLoginMutation from @queries/use-auth
    await new Promise((r) => setTimeout(r, 1200));
    console.log('Login payload:', data);
  }

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Heading ── */}
      <motion.div variants={itemVariants} className="space-y-1.5">
        <h1 className="text-3xl leading-none font-extrabold tracking-tight text-foreground lg:text-4xl">
          Welcome back
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </motion.div>

      {/* ── Form card ──
          Shows as a bordered card on mobile (matching Figma mobile design),
          invisible/flat on desktop where the split panel provides structure.
      ── */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-border bg-card p-6 shadow-card lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
          aria-label="Sign in form"
        >
          <FieldGroup>
            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="email"
                    className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                  >
                    Email address
                  </FieldLabel>
                  <div className="relative">
                    <MailIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className="h-11 border-transparent bg-input pl-10 text-[15px] transition-all focus:border-ring focus:bg-background"
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="password"
                    className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                  >
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <LockIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? 'password-error' : undefined}
                      className="h-11 border-transparent bg-input pr-11 pl-10 text-[15px] transition-all focus:border-ring focus:bg-background"
                      {...register('password')}
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
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Remember me + Forgot password */}
            <div className="flex flex-col pt-0.5 sm:flex-row sm:items-center sm:justify-between">
              <Controller
                control={control}
                name="rememberMe"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        aria-invalid={fieldState.invalid}
                        onCheckedChange={field.onChange}
                        className="border-border data-[state=checked]:border-brand-navy data-[state=checked]:bg-brand-navy data-[state=checked]:text-white"
                      />
                      <FieldLabel
                        htmlFor="rememberMe"
                        className="cursor-pointer text-sm font-medium text-muted-foreground"
                      >
                        Remember me
                      </FieldLabel>
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Link
                href={{ pathname: '/forgot-password' }}
                className="pt-2 text-sm font-bold whitespace-nowrap text-foreground transition-colors hover:text-brand-sky sm:pt-0"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 h-12 w-full cursor-pointer rounded-xl bg-brand-navy text-[15px] font-bold text-white transition-all duration-150 hover:-translate-y-px hover:bg-brand-navy/90 hover:shadow-card active:translate-y-0"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </FieldGroup>
        </form>
      </motion.div>

      {/* ── Social Auth ── */}
      <motion.div variants={itemVariants}>
        <SocialAuth />
      </motion.div>

      {/* ── Sign up link ── */}
      <motion.p variants={itemVariants} className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          href={{ pathname: '/register' }}
          className="font-bold text-foreground transition-colors hover:text-brand-sky"
        >
          Sign up
        </Link>
      </motion.p>
    </motion.div>
  );
}
