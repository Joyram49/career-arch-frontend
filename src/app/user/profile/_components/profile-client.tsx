'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';

import { type Resolver, Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { Input } from '@ui/input';
import { Separator } from '@ui/separator';

import { useAuthStore } from '@lib/store/auth.store';
import { useUpdateProfile } from '@queries/use-profile';

/* ── Zod schema ── */
const profileSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  phone: z.string().optional(),
  location: z.string().optional(),
  headline: z.string().max(120, 'Max 120 characters').optional(),
  summary: z.string().max(600, 'Max 600 characters').optional(),
  linkedin: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  github: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  portfolio: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});
type ProfileFormData = z.infer<typeof profileSchema>;

/* ── Plan badge ── */
const FREE_PLAN_META = { label: 'Free Plan', cls: 'badge-plan-free' };
const PLAN_META: Record<string, { label: string; cls: string }> = {
  FREE: { label: 'Free Plan', cls: 'badge-plan-free' },
  BASIC: { label: 'Basic Plan', cls: 'badge-plan-basic' },
  PREMIUM: { label: 'Premium Plan', cls: 'badge-plan-premium' },
};

/* ── Preview panel ── */
function ProfilePreview({
  data,
  initials,
  plan,
}: {
  data: ProfileFormData;
  initials: string;
  plan: string;
}): React.JSX.Element {
  const planMeta = PLAN_META[plan] ?? FREE_PLAN_META;
  return (
    <div className="profile-preview-card">
      {/* Banner */}
      <div className="profile-banner" />

      {/* Avatar + name */}
      <div className="px-5 pb-5">
        <div className="-mt-8 mb-3 flex items-end justify-between">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-sky text-xl font-black text-white ring-4 ring-card">
            {initials}
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase ${planMeta.cls}`}
          >
            {planMeta.label}
          </span>
        </div>

        <h3 className="text-[17px] font-black text-foreground">
          {data.firstName} {data.lastName}
        </h3>
        {data.headline !== undefined && data.headline !== '' && (
          <p className="mt-0.5 text-[13px] text-muted-foreground">{data.headline}</p>
        )}
        {data.location !== undefined && data.location !== '' && (
          <p className="mt-1 text-[12px] text-muted-foreground">📍 {data.location}</p>
        )}

        <Separator className="my-4" />

        {data.summary !== undefined && data.summary !== '' && (
          <>
            <p className="mb-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              About
            </p>
            <p className="text-[12px] leading-relaxed text-foreground">{data.summary}</p>
            <Separator className="my-4" />
          </>
        )}

        {/* Links */}
        <div className="flex flex-col gap-1.5">
          {data.linkedin !== undefined && data.linkedin !== '' && (
            <a
              href={data.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[12px] font-semibold text-brand-sky hover:underline"
            >
              <span>LinkedIn →</span>
            </a>
          )}
          {data.github !== undefined && data.github !== '' && (
            <a
              href={data.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[12px] font-semibold text-brand-sky hover:underline"
            >
              <span>GitHub →</span>
            </a>
          )}
          {data.portfolio !== undefined && data.portfolio !== '' && (
            <a
              href={data.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[12px] font-semibold text-brand-sky hover:underline"
            >
              <span>Portfolio →</span>
            </a>
          )}
        </div>

        <Separator className="my-4" />
        <p className="text-center text-[11px] text-muted-foreground">
          This is how recruiters see your profile
        </p>
      </div>
    </div>
  );
}

/* ── Main client ── */
export function ProfileClient(): React.JSX.Element {
  const { getUser, plan } = useAuthStore();
  const updateProfile = useUpdateProfile();

  const currentUser = getUser();

  const profile = currentUser?.profile;
  const firstName = profile?.firstName ?? '';
  const lastName = profile?.lastName ?? '';
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileFormData>,
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      phone: profile?.phone ?? '',
      location: profile?.location ?? '',
      headline: profile?.headline ?? '',
      summary: profile?.summary ?? '',
      linkedin: profile?.linkedinUrl ?? '',
      github: profile?.githubUrl ?? '',
      portfolio: profile?.portfolioUrl ?? '',
    },
  });

  const watchedData = form.watch();

  function onSubmit(data: ProfileFormData): void {
    updateProfile.mutate(data, {
      onSuccess: () => toast.success('Profile updated successfully!'),
      onError: () => toast.error('Failed to update profile'),
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      className="grid gap-6 lg:grid-cols-[280px_1fr]"
    >
      {/* Preview panel */}
      <div className="hidden lg:block">
        <ProfilePreview data={watchedData} initials={initials} plan={plan ?? 'FREE'} />
      </div>

      {/* Edit form */}
      <div className="rounded-2xl border border-border bg-card shadow-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-[15px] font-bold text-foreground">Edit Profile</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Keep your profile updated to get the best matches
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
          <div className="flex flex-col gap-6">
            {/* Basic info */}
            <div>
              <p className="mb-4 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                Basic Information
              </p>
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    name="firstName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="firstName"
                          className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                        >
                          First Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id="firstName"
                          className="h-10 rounded-xl border-transparent bg-input text-[13px]"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="lastName"
                    control={form.control}
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
                          className="h-10 rounded-xl border-transparent bg-input text-[13px]"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    name="phone"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel
                          htmlFor="phone"
                          className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                        >
                          Phone
                        </FieldLabel>
                        <Input
                          {...field}
                          id="phone"
                          type="tel"
                          className="h-10 rounded-xl border-transparent bg-input text-[13px]"
                          placeholder="+1 (555) 000-0000"
                        />
                      </Field>
                    )}
                  />
                  <Controller
                    name="location"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel
                          htmlFor="location"
                          className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                        >
                          Location
                        </FieldLabel>
                        <Input
                          {...field}
                          id="location"
                          className="h-10 rounded-xl border-transparent bg-input text-[13px]"
                          placeholder="San Francisco, CA"
                        />
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </div>

            <Separator />

            {/* Professional */}
            <div>
              <p className="mb-4 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                Professional Details
              </p>
              <FieldGroup>
                <Controller
                  name="headline"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center justify-between">
                        <FieldLabel
                          htmlFor="headline"
                          className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                        >
                          Professional Headline
                        </FieldLabel>
                        <span className="text-[11px] text-muted-foreground">
                          {(field.value ?? '').length}/120
                        </span>
                      </div>
                      <Input
                        {...field}
                        id="headline"
                        className="h-10 rounded-xl border-transparent bg-input text-[13px]"
                        placeholder="Senior Backend Engineer · TypeScript · Node.js"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="summary"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center justify-between">
                        <FieldLabel
                          htmlFor="summary"
                          className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                        >
                          About / Summary
                        </FieldLabel>
                        <span className="text-[11px] text-muted-foreground">
                          {(field.value ?? '').length}/600
                        </span>
                      </div>
                      <Textarea
                        {...field}
                        id="summary"
                        rows={4}
                        className="rounded-xl border-transparent bg-input text-[13px]"
                        placeholder="Describe your professional background, key skills, and what you're looking for…"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>

            <Separator />

            {/* Links */}
            <div>
              <p className="mb-4 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                Social Links
              </p>
              <FieldGroup>
                {(
                  [
                    {
                      name: 'linkedin' as const,
                      label: 'LinkedIn URL',
                      placeholder: 'https://linkedin.com/in/you',
                    },
                    {
                      name: 'github' as const,
                      label: 'GitHub URL',
                      placeholder: 'https://github.com/you',
                    },
                    {
                      name: 'portfolio' as const,
                      label: 'Portfolio URL',
                      placeholder: 'https://yoursite.com',
                    },
                  ] as const
                ).map(({ name, label, placeholder }) => (
                  <Controller
                    key={name}
                    name={name}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={name}
                          className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                        >
                          {label}
                        </FieldLabel>
                        <Input
                          {...field}
                          id={name}
                          type="url"
                          className="h-10 rounded-xl border-transparent bg-input text-[13px]"
                          placeholder={placeholder}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                ))}
              </FieldGroup>
            </div>
          </div>

          {/* Save bar */}
          <div className="mt-8 flex justify-end gap-3">
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
              disabled={updateProfile.isPending}
              className="rounded-xl bg-brand-navy font-bold text-white hover:bg-brand-navy/90"
            >
              {updateProfile.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
