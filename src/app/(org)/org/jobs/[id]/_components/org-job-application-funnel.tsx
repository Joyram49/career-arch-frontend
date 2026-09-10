import Link from 'next/link';

import type { ApplicationStatusKey, IOrgJobDetail } from '@app-types/org/org.job-detail';

const STATUS_ORDER: { key: ApplicationStatusKey; label: string; color: string }[] = [
  { key: 'PENDING', label: 'Applied', color: 'bg-slate-400' },
  { key: 'UNDER_REVIEW', label: 'Under Review', color: 'bg-blue-500' },
  { key: 'SHORTLISTED', label: 'Shortlisted', color: 'bg-purple-500' },
  { key: 'INTERVIEW_SCHEDULED', label: 'Interview', color: 'bg-amber-500' },
  { key: 'OFFERED', label: 'Offered', color: 'bg-emerald-400' },
  { key: 'HIRED', label: 'Hired', color: 'bg-emerald-600' },
  { key: 'REJECTED', label: 'Rejected', color: 'bg-red-500' },
  { key: 'WITHDRAWN', label: 'Withdrawn', color: 'bg-slate-300' },
];

interface OrgJobApplicationFunnelProps {
  job: IOrgJobDetail;
}

export function OrgJobApplicationFunnel({ job }: OrgJobApplicationFunnelProps): React.JSX.Element {
  const counts = job.applicationsByStatus;
  const max = Math.max(1, ...Object.values(counts));
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Application Funnel
        </h2>
        {total > 0 && (
          <Link
            href={`/org/applications?jobId=${job.id}`}
            className="text-xs font-medium text-brand-sky hover:underline"
          >
            View all
          </Link>
        )}
      </div>

      {total === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">No applications received yet.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2.5">
          {STATUS_ORDER.map(({ key, label, color }) => {
            const count = counts[key];
            const width = count === 0 ? 0 : Math.max(6, (count / max) * 100);
            return (
              <div key={key}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold text-foreground">{count}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
