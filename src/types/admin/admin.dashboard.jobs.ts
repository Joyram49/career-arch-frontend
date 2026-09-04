export type AdminJobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';

export type AdminJobType =
  | 'FULL_TIME'
  | 'PART_TIME'
  | 'CONTRACT'
  | 'INTERNSHIP'
  | 'FREELANCE'
  | 'REMOTE';

export type AdminJobDeadlineStatus = 'active' | 'expired' | 'all';

export type AdminJobSortBy =
  | 'createdAt'
  | 'publishedAt'
  | 'views'
  | 'title'
  | 'salaryMin'
  | 'salaryMax';

export interface IAdminJobListItem {
  id: string;
  title: string;
  slug: string;
  jobType: AdminJobType;
  status: AdminJobStatus;
  location: string | null;
  isRemote: boolean;
  requiredPlan: 'FREE' | 'BASIC' | 'PREMIUM';
  views: number;
  publishedAt: string | null;
  createdAt: string;

  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  vacancies: number;
  skills: string[];
  experienceLevel: string | null;
  category: string | null;
  deadline: string | null;

  organization: {
    id: string;
    email: string;
    profile: { companyName: string } | null;
  };
  _count: { applications: number };
}

export interface IAdminJobsFilters {
  page: number;
  limit: number;
  search?: string;
  status?: AdminJobStatus;
  jobType?: AdminJobType;
  category?: string;
  orgId?: string;
  salaryMin: number;
  salaryMax: number;
  deadlineStatus: AdminJobDeadlineStatus;
  sortBy: AdminJobSortBy;
  sortOrder: 'asc' | 'desc';
}
