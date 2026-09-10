'use client';

import { Button } from '@ui/button';
import Link from 'next/link';

import type { IOrgJobDetail } from '@app-types/org/org.job-detail';

import { PlanBadge, StatusBadge } from '../../../_components/shared';
import { deadlineLabel, formatSalaryRange, jobTypeLabel } from '../../_components/job-format.utils';

interface OrgJobDetailHeaderProps {
  job: IOrgJobDetail;
  isBusy: boolean;
  onPublish: () => void;
  onClose: () => void;
  onArchive: () => void;
  onRestore: () => void;
}

export function OrgJobDetailHeader({
  job,
  isBusy,
  onPublish,
  onClose,
  onArchive,
  onRestore,
}: OrgJobDetailHeaderProps): React.JSX.Element {
  const deadline = deadlineLabel(job);
  const statusKey = job.status.toLowerCase() as 'draft' | 'published' | 'closed' | 'archived';
  const planKey = job.requiredPlan.toLowerCase() as 'free' | 'basic' | 'premium';

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-foreground">{job.title}</h1>
            <StatusBadge status={statusKey} />
            <PlanBadge plan={planKey} />
          </div>

          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <i className="ti ti-briefcase text-[13px]" aria-hidden="true" />
              {jobTypeLabel(job.jobType)}
            </span>
            <span className="flex items-center gap-1">
              <i className="ti ti-map-pin text-[13px]" aria-hidden="true" />
              {job.isRemote ? 'Remote' : (job.location ?? 'Not specified')}
            </span>
            {job.experienceLevel && (
              <span className="flex items-center gap-1">
                <i className="ti ti-award text-[13px]" aria-hidden="true" />
                {job.experienceLevel} Level
              </span>
            )}
            <span className="flex items-center gap-1">
              <i className="ti ti-users text-[13px]" aria-hidden="true" />
              {job.vacancies} vacanc{job.vacancies === 1 ? 'y' : 'ies'}
            </span>
          </p>

          <p className="mt-3 text-base font-bold text-brand-emerald">{formatSalaryRange(job)}</p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {job.status !== 'ARCHIVED' && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/org/applications?jobId=${job.id}`}>
                <i className="ti ti-inbox mr-1.5" aria-hidden="true" />
                View Applications
              </Link>
            </Button>
          )}

          {(job.status === 'DRAFT' || job.status === 'PUBLISHED') && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/org/jobs/${job.id}/edit`}>
                <i className="ti ti-pencil mr-1.5" aria-hidden="true" />
                Edit
              </Link>
            </Button>
          )}

          {job.status === 'DRAFT' && (
            <Button
              size="sm"
              className="bg-brand-emerald text-white hover:bg-brand-emerald/90"
              disabled={isBusy}
              onClick={onPublish}
            >
              Publish
            </Button>
          )}

          {job.status === 'PUBLISHED' && (
            <Button
              size="sm"
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
              disabled={isBusy}
              onClick={onClose}
            >
              Close
            </Button>
          )}

          {(job.status === 'DRAFT' || job.status === 'CLOSED') && (
            <Button
              size="sm"
              variant="outline"
              className="border-slate-300 text-slate-500 hover:bg-slate-50"
              disabled={isBusy}
              onClick={onArchive}
            >
              Archive
            </Button>
          )}

          {job.status === 'ARCHIVED' && (
            <Button
              size="sm"
              className="bg-brand-sky text-white hover:bg-brand-sky/90"
              disabled={isBusy}
              onClick={onRestore}
            >
              Restore
            </Button>
          )}
        </div>
      </div>

      <p
        className={`mt-3 border-t border-border pt-3 text-xs ${deadline.isUrgent ? 'font-medium text-brand-red' : 'text-muted-foreground'}`}
      >
        <i className="ti ti-calendar-event mr-1" aria-hidden="true" />
        {deadline.text}
      </p>
    </div>
  );
}
