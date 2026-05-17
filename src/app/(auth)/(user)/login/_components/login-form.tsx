'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { Resolver } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { Input } from '@ui/input';

import type { LoginInput } from '@validations/auth.schema';
import { loginSchema } from '@validations/auth.schema';

import { EyeOffIcon, EyeOpenIcon, LockIcon, MailIcon } from '@assets/icons/custom';

import { useAuthStore } from '@lib/store/auth.store';
import { loginUser } from '@services/user/auth.service';

/* ── Variants ── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

/* ── Component ── */
export function LoginForm(): React.JSX.Element {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema) as Resolver<LoginInput>,
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  function onSubmit(data: LoginInput): void {
    startTransition(async () => {
      const result = await loginUser(data);

      if (!result.success) {
        // Surface field-level errors (e.g. rate limit with field context)
        if (result.fieldErrors !== undefined) {
          result.fieldErrors.forEach(({ field, message }) => {
            setError(field as keyof LoginInput, { message });
          });
        }
        toast.error(result.message);
        return;
      }

      if (result.requires2FA) {
        // Redirect to 2FA verify with temp token in query param
        // The tempToken is short-lived (5 min) and used only for OTP validation
        router.push(`/otp-verify?token=${encodeURIComponent(result.tempToken)}`);
        return;
      }

      // Hydrate Zustand store with user data
      setUser(result.user, 'USER', result.user.subscription?.plan ?? 'FREE');

      toast.success(`Welcome back, ${result.user.profile?.firstName}!`);
      router.push('/');
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
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-3xl leading-none font-extrabold tracking-tight text-foreground lg:text-4xl">
          Welcome back
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Sign in to your <span className="font-bold text-brand-sky">CareerArch</span> account
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

            {/* Password */}
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
                    <Link
                      href={{ pathname: '/forgot-password' }}
                      className="text-[11px] font-semibold text-brand-sky hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <LockIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="current-password"
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
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Remember Me */}
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Field>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="rememberMe"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-border data-[state=checked]:border-brand-navy data-[state=checked]:bg-brand-navy data-[state=checked]:text-white"
                    />
                    <FieldLabel
                      htmlFor="rememberMe"
                      className="cursor-pointer text-sm leading-none font-normal text-muted-foreground"
                    >
                      Remember me for 30 days
                    </FieldLabel>
                  </div>
                </Field>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="mt-1 h-12 w-full cursor-pointer rounded-xl bg-brand-navy text-[15px] font-bold text-white transition-all duration-150 hover:-translate-y-px hover:bg-brand-navy/90 hover:shadow-card active:translate-y-0"
            >
              {isPending ? (
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

      {/* Sign up link */}
      <motion.p variants={itemVariants} className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          href={{ pathname: '/register' }}
          className="font-bold text-foreground transition-colors hover:text-brand-sky"
        >
          Create one
        </Link>
      </motion.p>

      {/* Employer CTA */}
      <motion.div variants={itemVariants} className="border-t border-border pt-4">
        <Link
          href={{ pathname: '/login-org' }}
          className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>Signing in as an employer?</span>
          <span className="font-semibold text-foreground">Organization login</span>
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
