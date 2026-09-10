'use client';

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';

import type { OrgJobFormInput } from '@validations/org.job-form.schema';

import { RichTextEditor } from './job-tiptap-editor';

interface JobFormStepDetailsProps {
  control: Control<OrgJobFormInput>;
  errors: FieldErrors<OrgJobFormInput>;
}

export function JobFormStepDetails({
  control,
  errors,
}: JobFormStepDetailsProps): React.JSX.Element {
  return (
    <FieldGroup>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.description}>
            <FieldLabel>Job Description</FieldLabel>
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Describe the role, the team, and what makes this opportunity exciting…"
            />
            <FieldDescription>Minimum 50 characters.</FieldDescription>
            {errors.description && <FieldError errors={[errors.description]} />}
          </Field>
        )}
      />

      <Controller
        name="responsibilities"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Key Responsibilities</FieldLabel>
            <RichTextEditor
              value={field.value ?? ''}
              onChange={field.onChange}
              placeholder="List what this person will own day-to-day…"
            />
            <FieldDescription>Optional, but recommended.</FieldDescription>
          </Field>
        )}
      />
    </FieldGroup>
  );
}
