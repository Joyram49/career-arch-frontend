'use client';

import type { OrgJobFormInput } from '@validations/org.job-form.schema';

import { formatSalaryRange, jobTypeLabel } from '../job-format.utils';

interface JobFormStepReviewProps {
  values: OrgJobFormInput;
}

function RichPreview({ html }: { html: string }): React.JSX.Element {
  return (
    <div
      className="prose prose-sm mt-2 max-w-none text-foreground"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function JobFormStepReview({ values }: JobFormStepReviewProps): React.JSX.Element {
  const salaryDisplay = formatSalaryRange({
    // "Don't specify salary" wins regardless of whatever is still sitting in
    // the (disabled) min/max fields — same rule the schema's final transform
    // applies at submit time, kept in sync here for the live preview.
    salaryMin: values.salaryNotSpecified ? null : (values.salaryMin ?? null),
    salaryMax: values.salaryNotSpecified ? null : (values.salaryMax ?? null),
    salaryCurrency: values.salaryCurrency,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-bold text-foreground">{values.title || 'Untitled Job'}</h3>
          <span className="rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 uppercase">
            {values.requiredPlan}
          </span>
        </div>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>{jobTypeLabel(values.jobType)}</span>
          <span>{values.isRemote ? 'Remote' : values.location || 'Not specified'}</span>
          <span>{values.category || 'No category'}</span>
          <span>
            {values.vacancies} vacanc{values.vacancies === 1 ? 'y' : 'ies'}
          </span>
        </p>
        <p className="mt-2 text-sm font-bold text-brand-emerald">{salaryDisplay}</p>
        {values.deadline && (
          <p className="mt-1 text-xs text-muted-foreground">Deadline: {values.deadline}</p>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          About the Role
        </h4>
        {values.description ? (
          <RichPreview html={values.description} />
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No description yet.</p>
        )}
      </div>

      {values.responsibilities && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h4 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Responsibilities
          </h4>
          <RichPreview html={values.responsibilities} />
        </div>
      )}

      {values.requirements && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h4 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Requirements
          </h4>
          <RichPreview html={values.requirements} />
        </div>
      )}

      {values.skills.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h4 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Skills
          </h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {values.skills.map((s) => (
              <span
                key={s}
                className="rounded-full border border-brand-sky/30 bg-brand-sky/10 px-2.5 py-1 text-xs font-medium text-brand-sky"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-xs text-sky-800">
        <strong>Note:</strong> This job will require the <strong>{values.requiredPlan}</strong> plan
        or above to apply.
      </div>
    </div>
  );
}
