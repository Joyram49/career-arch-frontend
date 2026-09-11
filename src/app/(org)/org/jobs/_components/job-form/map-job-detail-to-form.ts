import type { IOrgJobDetail } from '@app-types/org/org.job-detail';
import type { OrgJobFormInput } from '@validations/org.job-form.schema';

const EXPERIENCE_LEVELS: NonNullable<OrgJobFormInput['experienceLevel']>[] = [
  'Entry',
  'Mid',
  'Senior',
  'Lead',
];

/**
 * Converts a fetched IOrgJobDetail into Partial<OrgJobFormInput> so the Edit
 * page can pre-fill OrgJobForm. Anything the DB stores as `null` becomes the
 * form's empty-string/undefined equivalent; `experienceLevel` falls back to
 * `undefined` if the stored free-text value doesn't match one of the four
 * segmented-control options (the DB column has no enum constraint).
 */
export function mapJobDetailToFormInput(job: IOrgJobDetail): Partial<OrgJobFormInput> {
  const experienceLevel = EXPERIENCE_LEVELS.find((level) => level === job.experienceLevel);

  return {
    title: job.title,
    jobType: job.jobType,
    isRemote: job.isRemote,
    location: job.location ?? '',
    salaryNotSpecified: job.salaryMin == null && job.salaryMax == null,
    salaryMin: job.salaryMin ?? undefined,
    salaryMax: job.salaryMax ?? undefined,
    salaryCurrency: job.salaryCurrency,
    category: job.category ?? '',
    vacancies: job.vacancies,
    deadline: job.deadline ? job.deadline.slice(0, 10) : '',
    requiredPlan: job.requiredPlan,
    description: job.description,
    responsibilities: job.responsibilities ?? '',
    requirements: job.requirements ?? '',
    skills: job.skills,
    experienceLevel,
  };
}
