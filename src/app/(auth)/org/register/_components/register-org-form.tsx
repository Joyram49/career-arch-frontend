'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import type { Resolver } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { Input } from '@ui/input';

import type { RegisterOrgInput } from '@validations/auth.schema';
import { registerOrgSchema } from '@validations/auth.schema';

import { BuildingIcon, EyeOffIcon, EyeOpenIcon, LockIcon, MailIcon } from '@assets/icons/custom';

import { PasswordStrengthMeter } from '@components/shared/password-strength-meter';
import { orgRegistration } from '@services/org/auth.service';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function RegisterOrgForm(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors },
  } = useForm<RegisterOrgInput>({
    resolver: zodResolver(registerOrgSchema) as Resolver<RegisterOrgInput>,
    defaultValues: {
      companyName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const passwordValue = watch('password');

  function onSubmit(data: RegisterOrgInput): void {
    startTransition(async () => {
      const result = await orgRegistration({
        companyName: data.companyName,
        email: data.email,
        password: data.password,
      });

      if (!result.success) {
        if (result.fieldErrors !== undefined) {
          result.fieldErrors.forEach(({ field, message }) => {
            setError(field as keyof RegisterOrgInput, { message });
          });
        }
        toast.error(result.message);
        return;
      }
      const params = new URLSearchParams({
        email: data.email,
        sent: 'true',
      });

      const href = `/org/send-verify-email?${params.toString()}` as Route;

      router.push(href);
    });
  }

  return (
    <motion.div
      className="flex flex-col gap-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Org badge */}
      <motion.div variants={itemVariants}>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-emerald/20 bg-brand-emerald/8 px-3 py-1 text-[11px] font-semibold text-brand-emerald">
          <BuildingIcon className="size-3.5 shrink-0" />
          Organization Registration
        </span>
      </motion.div>

      {/* Heading */}
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-3xl leading-none font-extrabold tracking-tight text-foreground lg:text-4xl">
          Register your company
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Join <span className="font-bold text-brand-sky">18K+</span> companies already hiring on
          CareerArch
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
          aria-label="Register organization form"
        >
          <FieldGroup>
            {/* Company Name */}
            <Controller
              name="companyName"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="companyName"
                    className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                  >
                    Company Name
                  </FieldLabel>
                  <div className="relative">
                    <BuildingIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="companyName"
                      type="text"
                      placeholder="Acme Corp"
                      autoComplete="organization"
                      aria-invalid={!!errors.companyName}
                      className="h-11 border-transparent bg-input pl-10 text-[15px] transition-all focus:border-ring focus:bg-background"
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Work Email */}
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="org-reg-email"
                    className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                  >
                    Work Email
                  </FieldLabel>
                  <div className="relative">
                    <MailIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="org-reg-email"
                      type="email"
                      placeholder="hr@company.com"
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
                      htmlFor="org-reg-password"
                      className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                    >
                      Password
                    </FieldLabel>
                    <span className="text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">
                      Min 8 characters
                    </span>
                  </div>
                  <div className="relative">
                    <LockIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="org-reg-password"
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
                  <div className="hidden sm:block">
                    <PasswordStrengthMeter password={passwordValue} />
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
                    htmlFor="org-reg-confirm"
                    className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                  >
                    Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <LockIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id="org-reg-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
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

            {/* Mobile strength meter */}
            <div className="block sm:hidden">
              <PasswordStrengthMeter password={passwordValue} />
            </div>

            {/* Accept terms */}
            <Controller
              name="acceptTerms"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-start gap-3 pt-0.5">
                    <Checkbox
                      id="org-acceptTerms"
                      checked={field.value}
                      aria-invalid={fieldState.invalid}
                      onCheckedChange={field.onChange}
                      className="mt-0.5 border-border data-[state=checked]:border-brand-navy data-[state=checked]:bg-brand-navy data-[state=checked]:text-white"
                    />
                    <FieldLabel
                      htmlFor="org-acceptTerms"
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
                      , including employer hiring guidelines
                    </FieldLabel>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                  Creating account...
                </span>
              ) : (
                'Create Organization Account'
              )}
            </Button>
          </FieldGroup>
        </form>
      </motion.div>

      {/* Already registered */}
      <motion.p variants={itemVariants} className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href={{ pathname: '/org/login' }}
          className="font-bold text-foreground transition-colors hover:text-brand-sky"
        >
          Sign in
        </Link>
      </motion.p>

      {/* Job seeker CTA */}
      <motion.div variants={itemVariants} className="border-t border-border pt-4">
        <Link
          href={{ pathname: '/register' }}
          className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>Are you a job seeker?</span>
          <span className="font-semibold text-foreground">Create a talent account</span>
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
