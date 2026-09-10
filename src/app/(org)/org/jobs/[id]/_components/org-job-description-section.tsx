import type { IOrgJobDetail } from '@app-types/org/org.job-detail';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}
function Section({ title, children }: SectionProps): React.JSX.Element {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        {title}
      </h2>
      <div className="mt-2.5 text-sm leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

interface OrgJobDescriptionSectionProps {
  job: IOrgJobDetail;
}

export function OrgJobDescriptionSection({
  job,
}: OrgJobDescriptionSectionProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <Section title="About the Role">
        <p className="whitespace-pre-line text-muted-foreground">{job.description}</p>
      </Section>

      {job.responsibilities && (
        <Section title="Key Responsibilities">
          <p className="whitespace-pre-line text-muted-foreground">{job.responsibilities}</p>
        </Section>
      )}

      {job.requirements && (
        <Section title="Requirements">
          <p className="whitespace-pre-line text-muted-foreground">{job.requirements}</p>
        </Section>
      )}

      {job.skills.length > 0 && (
        <Section title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-brand-sky/30 bg-brand-sky/10 px-2.5 py-1 text-xs font-medium text-brand-sky"
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
