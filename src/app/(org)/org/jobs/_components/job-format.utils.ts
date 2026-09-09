import type { IOrgJobListItem, OrgJobType } from '@app-types/org/org.jobs';
import { formatDistanceToNow } from 'date-fns';

const JOB_TYPE_LABELS: Record<OrgJobType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  FREELANCE: 'Freelance',
  REMOTE: 'Remote',
};

export function jobTypeLabel(type: OrgJobType): string {
  return JOB_TYPE_LABELS[type];
}

export function formatSalaryRange(
  job: Pick<IOrgJobListItem, 'salaryMin' | 'salaryMax' | 'salaryCurrency'>,
): string {
  const { salaryMin, salaryMax, salaryCurrency } = job;
  if (salaryMin === null && salaryMax === null) return 'Not specified';

  const fmt = (n: number): string => `${(n / 1000).toFixed(0)}k`;
  const symbol = salaryCurrency === 'USD' ? '$' : `${salaryCurrency} `;

  if (salaryMin !== null && salaryMax !== null) {
    return `${symbol}${fmt(salaryMin)} – ${symbol}${fmt(salaryMax)}`;
  }
  return `${symbol}${fmt((salaryMin ?? salaryMax) as number)}+`;
}

export function deadlineLabel(job: IOrgJobListItem): { text: string; isUrgent: boolean } {
  if (job.status === 'DRAFT') return { text: 'Not published yet', isUrgent: false };

  if (job.status === 'ARCHIVED' && job.deleteAt) {
    return {
      text: `Permanently deletes ${formatDistanceToNow(new Date(job.deleteAt), { addSuffix: true })}`,
      isUrgent: true,
    };
  }

  if (!job.deadline) return { text: 'No deadline set', isUrgent: false };

  const isPast = new Date(job.deadline) < new Date();
  return {
    text: `${isPast ? 'Closed' : 'Closes'} ${formatDistanceToNow(new Date(job.deadline), { addSuffix: true })}`,
    isUrgent: isPast,
  };
}
