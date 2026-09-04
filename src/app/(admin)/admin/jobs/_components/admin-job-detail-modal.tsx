'use client';

import type { IAdminJobListItem } from '@app-types/admin/admin.dashboard.jobs';
import { GeneralModal } from '@components/shared/general-modal';
import { format, isPast } from 'date-fns';
import { StatusBadge } from '../../_components/shared';

interface AdminJobDetailModalProps {
  job: IAdminJobListItem | null;
  onClose: () => void;
}

export function AdminJobDetailModal({ job, onClose }: AdminJobDetailModalProps): React.JSX.Element {
  return (
    <GeneralModal
      open={job !== null}
      onOpenChange={(open) => !open && onClose()}
      title={job?.title ?? ''}
      description={
        job ? (job.organization.profile?.companyName ?? job.organization.email) : undefined
      }
      size="lg"
    >
      {job && (
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-muted-foreground">Status</span>
              <p className="mt-0.5">
                <StatusBadge status={job.status.toLowerCase() as never} />
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Job Type</span>
              <p className="font-medium text-foreground">{job.jobType.replace('_', ' ')}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Category</span>
              <p className="font-medium text-foreground">{job.category ?? '—'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Location</span>
              <p className="font-medium text-foreground">
                {job.isRemote ? 'Remote' : (job.location ?? '—')}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Vacancies</span>
              <p className="font-medium text-foreground">{job.vacancies}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Experience</span>
              <p className="font-medium text-foreground">{job.experienceLevel ?? '—'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Required Plan</span>
              <p className="font-medium text-foreground capitalize">
                {job.requiredPlan.toLowerCase()}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Applications</span>
              <p className="font-medium text-foreground">{job._count.applications}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Deadline</span>
              <p
                className={
                  job.deadline && isPast(new Date(job.deadline))
                    ? 'font-medium text-brand-red'
                    : 'font-medium text-foreground'
                }
              >
                {job.deadline ? format(new Date(job.deadline), 'dd MMM yyyy') : 'No deadline'}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Posted</span>
              <p className="font-medium text-foreground">
                {format(new Date(job.createdAt), 'dd MMM yyyy')}
              </p>
            </div>
          </div>

          <div>
            <span className="text-muted-foreground">Salary Range</span>
            <p className="mt-0.5 font-medium text-foreground">
              {job.salaryMin === null && job.salaryMax === null
                ? 'Not disclosed'
                : `${job.salaryMin ?? '—'} – ${job.salaryMax ?? '—'} ${job.salaryCurrency}`}
            </p>
          </div>

          {job.skills.length > 0 && (
            <div>
              <span className="text-muted-foreground">Skills</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </GeneralModal>
  );
}
