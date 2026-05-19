'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Resolver } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { useAuthStore } from '@lib/store/auth.store';
import { Button } from '@ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { Input } from '@ui/input';

const accountSchema = z.object({
  email: z.email('Enter a valid email'),
  timezone: z.string().min(1, 'Required'),
  language: z.string().min(1, 'Required'),
});
type AccountData = z.infer<typeof accountSchema>;

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Kolkata',
  'Asia/Dhaka',
  'Australia/Sydney',
];
const LANGUAGES = ['English (US)', 'English (UK)', 'Spanish', 'French', 'German', 'Japanese'];

export default function AccountSettingsPage(): React.JSX.Element {
  const { user } = useAuthStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm<AccountData>({
    resolver: zodResolver(accountSchema) as Resolver<AccountData>,
    defaultValues: {
      email: user?.email ?? '',
      timezone: 'UTC',
      language: 'English (US)',
    },
  });

  function onSubmit(_data: AccountData): void {
    toast.success('Account settings saved');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-5"
    >
      {/* Account info card */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 text-[14px] font-bold text-foreground">Account Information</h2>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="email"
                    className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                  >
                    Email Address
                  </FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    className="h-10 rounded-xl border-transparent bg-input text-[13px]"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="timezone"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel
                      htmlFor="timezone"
                      className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                    >
                      Timezone
                    </FieldLabel>
                    <select
                      {...field}
                      id="timezone"
                      className="h-10 w-full rounded-xl border border-border bg-input px-3 text-[13px] text-foreground outline-none focus:ring-2 focus:ring-ring"
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
              />
              <Controller
                name="language"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel
                      htmlFor="language"
                      className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                    >
                      Language
                    </FieldLabel>
                    <select
                      {...field}
                      id="language"
                      className="h-10 w-full rounded-xl border border-border bg-input px-3 text-[13px] text-foreground outline-none focus:ring-2 focus:ring-ring"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="rounded-xl bg-brand-navy font-bold text-white hover:bg-brand-navy/90"
              >
                Save Changes
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-brand-red/20 bg-brand-red/5 p-5">
        <h2 className="mb-1 text-[14px] font-bold text-brand-red">Danger Zone</h2>
        <p className="mb-4 text-[12px] text-muted-foreground">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        {!showDeleteConfirm ? (
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-xl border-brand-red/40 text-brand-red hover:border-brand-red hover:bg-brand-red/10"
          >
            Delete Account
          </Button>
        ) : (
          <div className="flex flex-col gap-3 rounded-xl border border-brand-red/30 bg-card p-4">
            <p className="text-[13px] font-bold text-foreground">
              Are you absolutely sure? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button className="rounded-xl bg-brand-red font-bold text-white hover:bg-brand-red/90">
                Yes, Delete My Account
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
