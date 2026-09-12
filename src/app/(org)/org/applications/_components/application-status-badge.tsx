import { cn } from '@lib/utils';

import type { ApplicationStatus } from '@app-types/org/org.applications';

const LABELS: Record<ApplicationStatus, string> = {
  PENDING: 'Applied',
  UNDER_REVIEW: 'Under Review',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW_SCHEDULED: 'Interview',
  OFFERED: 'Offered',
  HIRED: 'Hired',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};

const BADGE_CLASS: Record<ApplicationStatus, string> = {
  PENDING: 'badge-status-applied',
  UNDER_REVIEW: 'badge-status-review',
  SHORTLISTED: 'badge-status-shortlisted',
  INTERVIEW_SCHEDULED: 'badge-status-interview',
  OFFERED: 'badge-status-offered',
  HIRED: 'badge-status-hired',
  REJECTED: 'badge-status-rejected',
  WITHDRAWN: 'badge-status-withdrawn',
};

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function ApplicationStatusBadge({
  status,
  className,
}: ApplicationStatusBadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
        BADGE_CLASS[status],
        className,
      )}
    >
      {LABELS[status]}
    </span>
  );
}
