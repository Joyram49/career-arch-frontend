'use client';

import { PlanNumberInput } from '@components/shared/plan-number-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateOrgProfile } from '@queries/org/use-org-profile';
import { Button } from '@ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { Input } from '@ui/input';
import { Textarea } from '@ui/textarea';
import { Controller, useForm, type Resolver } from 'react-hook-form';

import type { IOrgProfile } from '@app-types/org/org.profile';
import {
  COMPANY_SIZES,
  INDUSTRIES,
  orgProfileFormSchema,
  type OrgProfileFormInput,
} from '@validations/org.profile.schema';

function mapProfileToFormInput(profile: IOrgProfile): OrgProfileFormInput {
  return {
    companyName: profile.companyName,
    website: profile.website ?? '',
    industry: (profile.industry as OrgProfileFormInput['industry']) ?? undefined,
    companySize: (profile.companySize as OrgProfileFormInput['companySize']) ?? undefined,
    foundedYear: profile.foundedYear ?? undefined,
    description: profile.description ?? '',
    location: profile.location ?? '',
    country: profile.country ?? '',
    linkedinUrl: profile.linkedinUrl ?? '',
    twitterUrl: profile.twitterUrl ?? '',
  };
}

interface OrgProfileFormProps {
  profile: IOrgProfile;
}

export function OrgProfileForm({ profile }: OrgProfileFormProps): React.JSX.Element {
  const updateProfile = useUpdateOrgProfile();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<OrgProfileFormInput>({
    resolver: zodResolver(orgProfileFormSchema) as Resolver<OrgProfileFormInput>,
    defaultValues: mapProfileToFormInput(profile),
    mode: 'onBlur',
  });

  const description = watch('description');

  function onSubmit(data: OrgProfileFormInput): void {
    updateProfile.mutate(data);
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="flex-1 overflow-y-auto p-6">
        <FieldGroup>
          <Controller
            name="companyName"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!errors.companyName}>
                <FieldLabel htmlFor="company-name">Company Name</FieldLabel>
                <Input id="company-name" {...field} />
                {errors.companyName && <FieldError errors={[errors.companyName]} />}
              </Field>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="website"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.website}>
                  <FieldLabel htmlFor="company-website">Website</FieldLabel>
                  <Input
                    id="company-website"
                    placeholder="https://example.com"
                    {...field}
                    value={field.value ?? ''}
                  />
                  {errors.website && <FieldError errors={[errors.website]} />}
                </Field>
              )}
            />

            <Controller
              name="foundedYear"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.foundedYear}>
                  <FieldLabel htmlFor="company-founded">Founded Year</FieldLabel>
                  <PlanNumberInput
                    id="company-founded"
                    value={field.value}
                    onChange={field.onChange}
                    min={1800}
                    max={new Date().getFullYear()}
                    allowEmpty
                    placeholder="e.g. 2015"
                  />
                  {errors.foundedYear && <FieldError errors={[errors.foundedYear]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="industry"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="company-industry">Industry</FieldLabel>
                  <select
                    id="company-industry"
                    className="h-9 rounded-lg border border-border bg-input px-3 text-sm text-foreground"
                    {...field}
                    value={field.value ?? ''}
                  >
                    <option value="">Select industry…</option>
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            />

            <Controller
              name="companySize"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="company-size">Company Size</FieldLabel>
                  <select
                    id="company-size"
                    className="h-9 rounded-lg border border-border bg-input px-3 text-sm text-foreground"
                    {...field}
                    value={field.value ?? ''}
                  >
                    <option value="">Select size…</option>
                    {COMPANY_SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s} employees
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            />
          </div>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!errors.description}>
                <FieldLabel htmlFor="company-description">Company Description</FieldLabel>
                <Textarea
                  id="company-description"
                  rows={5}
                  placeholder="Tell candidates what your company does and what makes it a great place to work…"
                  {...field}
                />
                <FieldDescription>
                  {description?.length ?? 0}/2000 characters (minimum 50)
                </FieldDescription>
                {errors.description && <FieldError errors={[errors.description]} />}
              </Field>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="company-location">Location</FieldLabel>
                  <Input
                    id="company-location"
                    placeholder="e.g. San Francisco, CA"
                    {...field}
                    value={field.value ?? ''}
                  />
                </Field>
              )}
            />
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="company-country">Country</FieldLabel>
                  <Input
                    id="company-country"
                    placeholder="e.g. United States"
                    {...field}
                    value={field.value ?? ''}
                  />
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="linkedinUrl"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.linkedinUrl}>
                  <FieldLabel htmlFor="company-linkedin">LinkedIn URL</FieldLabel>
                  <Input
                    id="company-linkedin"
                    placeholder="https://linkedin.com/company/…"
                    {...field}
                    value={field.value ?? ''}
                  />
                  {errors.linkedinUrl && <FieldError errors={[errors.linkedinUrl]} />}
                </Field>
              )}
            />
            <Controller
              name="twitterUrl"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.twitterUrl}>
                  <FieldLabel htmlFor="company-twitter">Twitter / X URL</FieldLabel>
                  <Input
                    id="company-twitter"
                    placeholder="https://x.com/…"
                    {...field}
                    value={field.value ?? ''}
                  />
                  {errors.twitterUrl && <FieldError errors={[errors.twitterUrl]} />}
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </div>

      <div className="flex items-center justify-end border-t border-border bg-card px-6 py-4">
        <Button
          type="submit"
          className="bg-brand-sky text-white hover:bg-brand-sky/90"
          disabled={!isDirty || updateProfile.isPending}
        >
          {updateProfile.isPending ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
