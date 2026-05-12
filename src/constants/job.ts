import { ExperienceLevel, JobType } from '@app-types/job';

/* ── Job type display labels ── */
export const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  FREELANCE: 'Freelance',
};

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  FRESHER: 'Fresher',
  ENTRY: 'Entry Level',
  MID: 'Mid Level',
  SENIOR: 'Senior',
  LEAD: 'Lead / Principal',
};

export const JOB_CATEGORIES = [
  'Engineering',
  'Design',
  'Marketing',
  'Finance',
  'Sales',
  'Operations',
  'HR',
  'Legal',
  'Product',
  'Data',
  'Healthcare',
  'Education',
  'Customer Support',
  'Other',
] as const;
