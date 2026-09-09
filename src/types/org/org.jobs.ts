export type OrgJobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';

export type OrgJobType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'FREELANCE'
  | 'REMOTE';

export type OrgRequiredPlan = 'FREE' | 'BASIC' | 'PREMIUM';

export interface IOrgJobListItem {
  id: string;
  title: string;
  slug: string;
  status: OrgJobStatus;
  jobType: OrgJobType;
  location: string | null;
  isRemote: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  experienceLevel: string | null;
  requiredPlan: OrgRequiredPlan;
  applicationsCount: number;
  views: number;
  vacancies: number;
  deadline: string | null;
  publishedAt: string | null;
  createdAt: string;
  /** Only present for ARCHIVED (trash) items — hard-delete cutoff from DeletedJob.deleteAt */
  deleteAt?: string | null;
}

export interface IOrgJobsFilters {
  page: number;
  limit: number;
  search?: string;
  status?: OrgJobStatus;
  jobType?: OrgJobType;
  sortBy?: 'createdAt' | 'deadline' | 'applications';
  sortOrder?: 'asc' | 'desc';
}

export interface IOrgJobsStatusCounts {
  all: number;
  draft: number;
  published: number;
  closed: number;
  archived: number;
}
