'use client';

import { cn } from '@lib/utils';
import { Button } from '@ui/button';
import Link from 'next/link';

import type { IOrgJobListItem } from '@app-types/org/org.jobs';

import { PlanBadge, StatusBadge } from '../../_components/shared';
import { deadlineLabel, formatSalaryRange, jobTypeLabel } from './job-format.utils';

interface OrgJobCardProps {
  job: IOrgJobListItem;
  isBusy: boolean;
  onPublish: (job: IOrgJobListItem) => void;
  onClose: (job: IOrgJobListItem) => void;
  onArchive: (job: IOrgJobListItem) => void;
  onRestore: (job: IOrgJobListItem) => void;
}

export function OrgJobCard({
  job,
  isBusy,
  onPublish,
  onClose,
  onArchive,
  onRestore,
}: OrgJobCardProps): React.JSX.Element {
  const deadline = deadlineLabel(job);
  const statusKey = job.status.toLowerCase() as 'draft' | 'published' | 'closed' | 'archived';
  const planKey = job.requiredPlan.toLowerCase() as 'free' | 'basic' | 'premium';

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/org/jobs/${job.id}`}
              className="text-sm font-semibold text-foreground hover:text-brand-sky hover:underline"
            >
              {job.title}
            </Link>
            <StatusBadge status={statusKey} />
            <PlanBadge plan={planKey} />
          </div>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <i className="ti ti-briefcase text-[13px]" aria-hidden="true" />
              {jobTypeLabel(job.jobType)}
            </span>
            <span className="flex items-center gap-1">
              <i className="ti ti-map-pin text-[13px]" aria-hidden="true" />
              {job.isRemote ? 'Remote' : (job.location ?? 'Not specified')}
            </span>
            <span className="flex items-center gap-1">
              <i className="ti ti-cash text-[13px]" aria-hidden="true" />
              {formatSalaryRange(job)}
            </span>
            {job.experienceLevel && (
              <span className="flex items-center gap-1">
                <i className="ti ti-award text-[13px]" aria-hidden="true" />
                {job.experienceLevel}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            <strong className="text-foreground">{job.applicationsCount}</strong> applications
          </span>
          <span>
            <strong className="text-foreground">{job.views.toLocaleString()}</strong> views
          </span>
          <span className={cn(deadline.isUrgent && 'font-medium text-brand-red')}>
            {deadline.text}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {job.status !== 'ARCHIVED' && (
            <Button asChild size="sm" variant="outline" className="h-7 px-2 text-xs">
              <Link href={`/org/applications?jobId=${job.id}`}>Applications</Link>
            </Button>
          )}

          {job.status === 'DRAFT' && (
            <>
              <Button asChild size="sm" variant="outline" className="h-7 px-2 text-xs">
                <Link href={`/org/jobs/${job.id}/edit`}>Edit</Link>
              </Button>
              <Button
                size="sm"
                className="h-7 bg-brand-emerald px-2 text-xs text-white hover:bg-brand-emerald/90"
                disabled={isBusy}
                onClick={() => onPublish(job)}
              >
                Publish
              </Button>
            </>
          )}

          {job.status === 'PUBLISHED' && (
            <>
              <Button asChild size="sm" variant="outline" className="h-7 px-2 text-xs">
                <Link href={`/org/jobs/${job.id}/edit`}>Edit</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 border-amber-300 px-2 text-xs text-amber-700 hover:bg-amber-50"
                disabled={isBusy}
                onClick={() => onClose(job)}
              >
                Close
              </Button>
            </>
          )}

          {(job.status === 'DRAFT' || job.status === 'CLOSED') && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 border-slate-300 px-2 text-xs text-slate-500 hover:bg-slate-50"
              disabled={isBusy}
              onClick={() => onArchive(job)}
            >
              Archive
            </Button>
          )}

          {job.status === 'ARCHIVED' && (
            <Button
              size="sm"
              className="h-7 bg-brand-sky px-2 text-xs text-white hover:bg-brand-sky/90"
              disabled={isBusy}
              onClick={() => onRestore(job)}
            >
              Restore
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
