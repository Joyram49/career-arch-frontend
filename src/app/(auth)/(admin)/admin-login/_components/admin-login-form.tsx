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
import { Field, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { Input } from '@ui/input';

import { EyeOffIcon, EyeOpenIcon, LockIcon, MailIcon, ShieldIcon } from '@assets/icons/custom';

import { useAuthStore } from '@lib/store/auth.store';
import { loginAdmin } from '@services/admin/auth.service';
import { AdminLoginInput, adminLoginSchema } from '@validations/auth.schema';

// ── Animation variants ─────────────────────────────────────────────────────

const wrapperVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ── Component ──────────────────────────────────────────────────────────────

export function AdminLoginForm(): React.JSX.Element {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema) as Resolver<AdminLoginInput>,
    defaultValues: { email: '', password: '' },
  });

  function onSubmit(data: AdminLoginInput): void {
    startTransition(async () => {
      const result = await loginAdmin(data);

      if (!result.success) {
        if (result.fieldErrors !== undefined) {
          result.fieldErrors.forEach(({ field, message }) => {
            setError(field as keyof AdminLoginInput, { message });
          });
        }
        toast.error(result.message, {
          description: 'Check your credentials and try again.',
        });
        return;
      }

      // Hydrate Zustand — admin has no plan
      setUser(result.admin, 'ADMIN');

      toast.success('Access granted', { description: `Welcome, ${result.admin.name}` });
      router.push('/');
    });
  }

  return (
    <motion.div
      className="w-full max-w-[420px]"
      variants={wrapperVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── Card ── */}
      <div
        className="relative overflow-hidden rounded-2xl border"
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          borderColor: 'rgba(51, 65, 85, 0.8)',
          backdropFilter: 'blur(24px)',
          boxShadow:
            '0 0 0 1px rgba(14,165,233,0.06), 0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Top sky accent line */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(14,165,233,0.5), rgba(14,165,233,0.8), rgba(14,165,233,0.5), transparent)',
          }}
          aria-hidden="true"
        />

        {/* Subtle inner glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(14,165,233,0.06) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        <motion.div
          className="relative p-8 sm:p-10"
          variants={staggerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ── Header ── */}
          <motion.div variants={itemVariants} className="mb-8 flex flex-col items-center gap-4">
            {/* Shield icon badge */}
            <div
              className="flex size-14 items-center justify-center rounded-2xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(14,165,233,0.05) 100%)',
                border: '1px solid rgba(14,165,233,0.25)',
                boxShadow: '0 0 20px rgba(14,165,233,0.12)',
              }}
            >
              <ShieldIcon className="size-7" style={{ color: '#0ea5e9' }} />
            </div>

            <div className="text-center">
              {/* System label */}
              <p
                className="mb-1 font-mono text-[10px] font-semibold tracking-[0.25em] uppercase"
                style={{ color: 'rgba(14,165,233,0.7)' }}
              >
                RESTRICTED ACCESS
              </p>
              <h1
                className="text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ color: '#f1f5f9' }}
              >
                Admin Portal
              </h1>
              <p className="mt-1 text-sm" style={{ color: 'rgba(148,163,184,0.8)' }}>
                CareerArch Control Center
              </p>
            </div>
          </motion.div>

          {/* ── Form ── */}
          <motion.div variants={itemVariants}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
              aria-label="Admin sign in form"
            >
              <FieldGroup>
                {/* Email */}
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="admin-email"
                        className="text-[10px] font-bold tracking-[0.2em] uppercase"
                        style={{ color: 'rgba(148,163,184,0.9)' }}
                      >
                        Admin Email
                      </FieldLabel>
                      <div className="relative">
                        <MailIcon
                          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
                          style={{ color: 'rgba(100,116,139,0.8)' }}
                        />
                        <Input
                          {...field}
                          id="admin-email"
                          type="email"
                          placeholder="admin@careerarch.com"
                          autoComplete="email"
                          aria-invalid={!!errors.email}
                          className="h-11 pl-10 text-[14px] transition-all"
                          style={inputStyle}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} className="text-red-400" />
                      )}
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
                        htmlFor="admin-password"
                        className="text-[10px] font-bold tracking-[0.2em] uppercase"
                        style={{ color: 'rgba(148,163,184,0.9)' }}
                      >
                        Password
                      </FieldLabel>
                      <div className="relative">
                        <LockIcon
                          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
                          style={{ color: 'rgba(100,116,139,0.8)' }}
                        />
                        <Input
                          {...field}
                          id="admin-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          aria-invalid={!!errors.password}
                          className="h-11 pr-11 pl-10 text-[14px] transition-all"
                          style={inputStyle}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          className="absolute top-1/2 right-3.5 -translate-y-1/2 p-0.5 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                          style={{ color: 'rgba(100,116,139,0.8)' }}
                        >
                          {showPassword ? (
                            <EyeOpenIcon className="size-4" />
                          ) : (
                            <EyeOffIcon className="size-4" />
                          )}
                        </button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} className="text-red-400" />
                      )}
                    </Field>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="mt-2 h-11 w-full rounded-xl text-[14px] font-bold transition-all duration-150 hover:-translate-y-px active:translate-y-0"
                  style={{
                    background: isPending
                      ? 'rgba(14,165,233,0.5)'
                      : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                    color: '#fff',
                    border: 'none',
                    boxShadow: isPending
                      ? 'none'
                      : '0 0 20px rgba(14,165,233,0.3), 0 4px 12px rgba(14,165,233,0.2)',
                  }}
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <ShieldIcon className="size-4" />
                      Authenticate
                    </span>
                  )}
                </Button>
              </FieldGroup>
            </form>
          </motion.div>

          {/* ── Footer ── */}
          <motion.div
            variants={itemVariants}
            className="mt-7 flex flex-col items-center gap-3 border-t pt-6"
            style={{ borderColor: 'rgba(51,65,85,0.5)' }}
          >
            {/* Warning note */}
            <p
              className="flex items-center gap-1.5 text-center font-mono text-[10px] tracking-wide"
              style={{ color: 'rgba(100,116,139,0.7)' }}
            >
              <span
                className="inline-block size-1.5 rounded-full"
                style={{ background: '#f59e0b', boxShadow: '0 0 4px rgba(245,158,11,0.6)' }}
                aria-hidden="true"
              />
              Unauthorized access is monitored and prosecuted
            </p>

            {/* Back to user login */}
            <Link
              href={{ pathname: '/login' }}
              className="text-xs transition-colors hover:underline"
              style={{ color: 'rgba(148,163,184,0.6)' }}
            >
              ← Back to user portal
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Below-card label */}
      <p
        className="mt-5 text-center font-mono text-[10px] tracking-[0.2em] uppercase"
        style={{ color: 'rgba(100,116,139,0.45)' }}
      >
        CareerArch · Admin Control Center · v4.0
      </p>
    </motion.div>
  );
}

// ── Shared input style — dark glass aesthetic ──────────────────────────────
const inputStyle: React.CSSProperties = {
  background: 'rgba(30, 41, 59, 0.6)',
  border: '1px solid rgba(51, 65, 85, 0.8)',
  color: '#e2e8f0',
  backdropFilter: 'blur(8px)',
};
