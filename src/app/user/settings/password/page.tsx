'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { type Resolver, Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { cn } from '@lib/utils';
import { changePassword } from '@services/user/profile.service';
import { Button } from '@ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { Input } from '@ui/input';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Required'),
    newPassword: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Must contain uppercase')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
    confirmPassword: z.string().min(1, 'Required'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type FormData = z.infer<typeof schema>;

function PasswordStrength({ password }: { password: string }): React.JSX.Element {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
    { label: 'Special character', ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const pct = (score / 4) * 100;
  const color =
    score <= 1
      ? 'var(--brand-red)'
      : score <= 2
        ? 'var(--brand-amber)'
        : score === 3
          ? 'var(--brand-sky)'
          : 'var(--brand-emerald)';
  const label = score <= 1 ? 'Weak' : score <= 2 ? 'Fair' : score === 3 ? 'Good' : 'Strong';

  if (password === '') return <></>;
  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 overflow-hidden rounded-full bg-muted" style={{ height: 5 }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
        <span className="text-[11px] font-bold" style={{ color }}>
          {label}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {checks.map((c) => (
          <span
            key={c.label}
            className={cn(
              'text-[11px] font-medium',
              c.ok ? 'text-brand-emerald' : 'text-muted-foreground',
            )}
          >
            {c.ok ? '✓' : '○'} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PasswordSettingsPage(): React.JSX.Element {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });
  const newPw = form.watch('newPassword');

  async function onSubmit(data: FormData): Promise<void> {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated successfully');
      form.reset();
    } catch {
      toast.error('Current password is incorrect');
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-card"
    >
      <h2 className="mb-1 text-[14px] font-bold text-foreground">Change Password</h2>
      <p className="mb-5 text-[12px] text-muted-foreground">
        Use a strong, unique password to keep your account secure.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Controller
            name="currentPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="currentPassword"
                  className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                >
                  Current Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="currentPassword"
                    type={showCurrent ? 'text' : 'password'}
                    className="h-10 rounded-xl border-transparent bg-input pr-10 text-[13px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showCurrent ? 'Hide' : 'Show'}
                  >
                    <svg viewBox="0 0 18 18" fill="none" className="size-4">
                      {showCurrent ? (
                        <>
                          <path
                            d="M1 9c2-3.5 4.5-5.5 8-5.5S15 5.5 17 9c-2 3.5-4.5 5.5-8 5.5S3 12.5 1 9z"
                            stroke="currentColor"
                            strokeWidth="1.3"
                          />
                          <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                        </>
                      ) : (
                        <>
                          <path
                            d="M1 1l16 16M7.4 4A8.3 8.3 0 0117 9c-.9 1.6-2.1 3-3.5 4M4 5.5A8.6 8.6 0 001 9c2 3.5 4.5 5.5 8 5.5a8 8 0 004-1"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                          />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="newPassword"
                  className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                >
                  New Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="newPassword"
                    type={showNew ? 'text' : 'password'}
                    className="h-10 rounded-xl border-transparent bg-input pr-10 text-[13px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showNew ? 'Hide' : 'Show'}
                  >
                    <svg viewBox="0 0 18 18" fill="none" className="size-4">
                      <path
                        d="M1 9c2-3.5 4.5-5.5 8-5.5S15 5.5 17 9c-2 3.5-4.5 5.5-8 5.5S3 12.5 1 9z"
                        stroke="currentColor"
                        strokeWidth="1.3"
                      />
                      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  </button>
                </div>
                <PasswordStrength password={newPw ?? ''} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="confirmPassword"
                  className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                >
                  Confirm New Password
                </FieldLabel>
                <Input
                  {...field}
                  id="confirmPassword"
                  type="password"
                  className="h-10 rounded-xl border-transparent bg-input text-[13px]"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="rounded-xl"
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="rounded-xl bg-brand-navy font-bold text-white hover:bg-brand-navy/90"
            >
              {form.formState.isSubmitting ? 'Updating…' : 'Update Password'}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </motion.div>
  );
}
