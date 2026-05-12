/* ─────────────────────────────────────────────
   Job types
──────────────────────────────────────────── */

import { IPaginationMeta } from './api';
import { IOrgProfile, PlanName } from './auth';

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';

export type ExperienceLevel = 'FRESHER' | 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';

export type RequiredPlan = PlanName;

/* ======================= Public job (search results / details)  =========================== */
export interface IJob {
  id: string;
  slug: string;
  title: string;
  jobType: JobType;
  location: string | null;
  isRemote: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  category: string;
  experienceLevel: ExperienceLevel;
  requiredPlan: RequiredPlan;
  requiredSkills: string[];
  preferredSkills: string[];
  benefits: string[];
  vacancies: number;
  applicationDeadline: string | null;
  status: JobStatus;
  applicationCount?: number;
  viewCount: number;
  postedAt: string;
  createdAt: string;
  organization: {
    id: string;
    companyName: string;
    isApproved: string;
    profile: Pick<IOrgProfile, 'logoUrl' | 'industry' | 'companySize' | 'location'> | null;
  };
  isSaved?: boolean;
  hasApplied: boolean;
}

/* ======================= Job search filters =========================== */
export interface IJobFilters {
  keyword?: string;
  location?: string;
  jobType?: string[];
  experienceLevel?: ExperienceLevel[];
  salaryMin?: number;
  salaryMax?: number;
  category?: string;
  isRemote?: string;
  requiredPlan?: string;
  companySize?: string;
  datePosted?: 'ANY' | '24H' | 'WEEK' | 'MONTH';
  page?: number;
  limit?: number;
  sortBy?: 'RECENT' | 'SALARY_HIGH' | 'SALARY_LOW' | 'RELEVANCE';
}

/* ======================= Job Search response =========================== */
export interface IJobSearchMeta extends IPaginationMeta {
  isLimited?: boolean;
  limitMessage?: string;
}

/* ======================= Organization job (for org dashboard) =========================== */
export interface IOrgJob extends IJob {
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  screeningQuestions: string[];
}

/* ======================= Create/Edit job form shape =========================== */
export interface ICreateJobInput {
  title: string;
  jobType: JobType;
  location: string;
  isRemote: string;
  salaryMin?: string;
  salaryMax?: string;
  currency: string;
  category: string;
  vacancies: number;
  applicationDeadline?: string;
  requiredPlan: RequiredPlan;
  description: string;
  responsibilities?: string;
  benefits: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experienceLevel: ExperienceLevel;
  education?: string;
  screeningQuestions?: string[];
}
