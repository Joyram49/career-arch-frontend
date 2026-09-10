'use client';

import { cn } from '@lib/utils';
import { Checkbox } from '@ui/checkbox';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { Input } from '@ui/input';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';

import type { OrgJobFormInput } from '@validations/org.job-form.schema';

const JOB_TYPES: { value: OrgJobFormInput['jobType']; label: string }[] = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'FREELANCE', label: 'Freelance' },
  { value: 'REMOTE', label: 'Remote' },
];

const CATEGORIES = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Finance',
  'Customer Support',
  'Operations',
  'Human Resources',
  'Other',
];

const PLAN_OPTIONS: {
  value: OrgJobFormInput['requiredPlan'];
  label: string;
  description: string;
}[] = [
  {
    value: 'FREE',
    label: 'Free',
    description: 'Visible to every job seeker, including Free-plan users',
  },
  { value: 'BASIC', label: 'Basic', description: 'Requires the Basic plan or higher to apply' },
  {
    value: 'PREMIUM',
    label: 'Premium',
    description: 'Requires Premium — narrows to your most committed applicants',
  },
];

interface JobFormStepBasicsProps {
  control: Control<OrgJobFormInput>;
  errors: FieldErrors<OrgJobFormInput>;
  isRemote: boolean;
  salaryNotSpecified: boolean;
}

export function JobFormStepBasics({
  control,
  errors,
  isRemote,
  salaryNotSpecified,
}: JobFormStepBasicsProps): React.JSX.Element {
  return (
    <FieldGroup>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.title}>
            <FieldLabel htmlFor="job-title">Job Title</FieldLabel>
            <Input id="job-title" placeholder="e.g. Senior Backend Engineer" {...field} />
            {errors.title && <FieldError errors={[errors.title]} />}
          </Field>
        )}
      />

      <Controller
        name="jobType"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.jobType}>
            <FieldLabel>Job Type</FieldLabel>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {JOB_TYPES.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => field.onChange(opt.value)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-left text-xs font-medium transition-all',
                    field.value === opt.value
                      ? 'border-brand-sky bg-brand-sky/10 text-brand-sky'
                      : 'border-border bg-card text-foreground hover:bg-muted',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <Field data-invalid={!!errors.location}>
              <FieldLabel htmlFor="job-location">Location</FieldLabel>
              <Input
                id="job-location"
                placeholder="e.g. New York, NY"
                disabled={isRemote}
                {...field}
                value={field.value ?? ''}
              />
              {errors.location && <FieldError errors={[errors.location]} />}
            </Field>
          )}
        />

        <Controller
          name="isRemote"
          control={control}
          render={({ field }) => (
            <Field orientation="horizontal" className="items-center pb-1 sm:pb-2.5">
              <Checkbox id="job-remote" checked={field.value} onCheckedChange={field.onChange} />
              <FieldLabel htmlFor="job-remote" className="font-normal whitespace-nowrap">
                Remote position
              </FieldLabel>
            </Field>
          )}
        />
      </div>

      <div>
        <FieldLabel>Salary Range</FieldLabel>
        <div className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Controller
            name="salaryMin"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!errors.salaryMin}>
                <Input
                  type="number"
                  placeholder="Min"
                  disabled={salaryNotSpecified}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                  }
                />
                {errors.salaryMin && <FieldError errors={[errors.salaryMin]} />}
              </Field>
            )}
          />
          <Controller
            name="salaryMax"
            control={control}
            render={({ field }) => (
              <Field data-invalid={!!errors.salaryMax}>
                <Input
                  type="number"
                  placeholder="Max"
                  disabled={salaryNotSpecified}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                  }
                />
                {errors.salaryMax && <FieldError errors={[errors.salaryMax]} />}
              </Field>
            )}
          />
          <Controller
            name="salaryCurrency"
            control={control}
            render={({ field }) => (
              <select
                disabled={salaryNotSpecified}
                className="h-9 rounded-lg border border-border bg-input px-3 text-sm text-foreground disabled:opacity-50"
                {...field}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            )}
          />
        </div>
        <Controller
          name="salaryNotSpecified"
          control={control}
          render={({ field }) => (
            <Field orientation="horizontal" className="mt-2">
              <Checkbox
                id="salary-not-specified"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldLabel htmlFor="salary-not-specified" className="font-normal">
                Don&apos;t specify salary
              </FieldLabel>
            </Field>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Field data-invalid={!!errors.category}>
              <FieldLabel htmlFor="job-category">Category</FieldLabel>
              <select
                id="job-category"
                className="h-9 rounded-lg border border-border bg-input px-3 text-sm text-foreground"
                {...field}
              >
                <option value="">Select category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && <FieldError errors={[errors.category]} />}
            </Field>
          )}
        />

        <Controller
          name="vacancies"
          control={control}
          render={({ field }) => (
            <Field data-invalid={!!errors.vacancies}>
              <FieldLabel htmlFor="job-vacancies">Vacancies</FieldLabel>
              <Input
                id="job-vacancies"
                type="number"
                min={1}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value === '' ? 1 : Number(e.target.value))}
              />
              {errors.vacancies && <FieldError errors={[errors.vacancies]} />}
            </Field>
          )}
        />

        <Controller
          name="deadline"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="job-deadline">Application Deadline</FieldLabel>
              <Input id="job-deadline" type="date" {...field} value={field.value ?? ''} />
              <FieldDescription>Optional</FieldDescription>
            </Field>
          )}
        />
      </div>

      <Controller
        name="requiredPlan"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Required Subscription Plan</FieldLabel>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {PLAN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => field.onChange(opt.value)}
                  className={cn(
                    'rounded-lg border p-3 text-left transition-all',
                    field.value === opt.value
                      ? 'border-brand-sky bg-brand-sky/10'
                      : 'border-border bg-card hover:bg-muted',
                  )}
                >
                  <p
                    className={cn(
                      'text-xs font-bold',
                      field.value === opt.value ? 'text-brand-sky' : 'text-foreground',
                    )}
                  >
                    {opt.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{opt.description}</p>
                </button>
              ))}
            </div>
          </Field>
        )}
      />
    </FieldGroup>
  );
}
