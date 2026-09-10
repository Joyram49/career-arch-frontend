import { format } from 'date-fns';

import type { IOrgJobDetail } from '@app-types/org/org.job-detail';

interface InfoRowProps {
  label: string;
  value: string;
}
function InfoRow({ label, value }: InfoRowProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between py-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

interface OrgJobInfoSidebarProps {
  job: IOrgJobDetail;
}

export function OrgJobInfoSidebar({ job }: OrgJobInfoSidebarProps): React.JSX.Element {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        Job Info
      </h2>
      <div className="mt-1 divide-y divide-border">
        <InfoRow label="Category" value={job.category ?? 'Not specified'} />
        <InfoRow label="Required Plan" value={job.requiredPlan} />
        <InfoRow label="Currency" value={job.salaryCurrency} />
        <InfoRow label="Created" value={format(new Date(job.createdAt), 'dd MMM yyyy')} />
        {job.publishedAt && (
          <InfoRow label="Published" value={format(new Date(job.publishedAt), 'dd MMM yyyy')} />
        )}
        {job.deadline && (
          <InfoRow label="Deadline" value={format(new Date(job.deadline), 'dd MMM yyyy')} />
        )}
        {job.deleteAt && (
          <InfoRow
            label="Permanently Deletes"
            value={format(new Date(job.deleteAt), 'dd MMM yyyy')}
          />
        )}
      </div>
    </div>
  );
}
