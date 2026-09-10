'use client';

import { cn } from '@lib/utils';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';

import type { OrgJobFormInput } from '@validations/org.job-form.schema';

import { SkillsInput } from './job-skills-input';
import { RichTextEditor } from './job-tiptap-editor';

const EXPERIENCE_LEVELS: NonNullable<OrgJobFormInput['experienceLevel']>[] = [
  'Entry',
  'Mid',
  'Senior',
  'Lead',
];

interface JobFormStepRequirementsProps {
  control: Control<OrgJobFormInput>;
  errors: FieldErrors<OrgJobFormInput>;
}

export function JobFormStepRequirements({
  control,
  errors,
}: JobFormStepRequirementsProps): React.JSX.Element {
  return (
    <FieldGroup>
      <Controller
        name="requirements"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Requirements</FieldLabel>
            <RichTextEditor
              value={field.value ?? ''}
              onChange={field.onChange}
              placeholder="Years of experience, must-have qualifications…"
            />
          </Field>
        )}
      />

      <Controller
        name="skills"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.skills}>
            <FieldLabel>Required Skills</FieldLabel>
            <SkillsInput value={field.value} onChange={field.onChange} />
            <FieldDescription>Press Enter after each skill. Up to 20.</FieldDescription>
            {errors.skills && <FieldError errors={[errors.skills]} />}
          </Field>
        )}
      />

      <Controller
        name="experienceLevel"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Experience Level</FieldLabel>
            <div className="flex gap-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => field.onChange(level)}
                  className={cn(
                    'flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                    field.value === level
                      ? 'border-brand-sky bg-brand-sky/10 text-brand-sky'
                      : 'border-border bg-card text-foreground hover:bg-muted',
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </Field>
        )}
      />
    </FieldGroup>
  );
}
