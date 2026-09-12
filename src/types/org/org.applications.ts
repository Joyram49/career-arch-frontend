export type ApplicationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'OFFERED'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface IOrgApplicationListItem {
  id: string;
  jobId: string;
  jobTitle: string;
  status: ApplicationStatus;
  candidateId: string;
  candidateName: string;
  candidateAvatarUrl?: string | null;
  candidateHeadline?: string | null;
  appliedAt: string;
  updatedAt: string;
  resumeUrl: string | null;
}

export interface IOrgApplicationDetail extends IOrgApplicationListItem {
  candidateEmail: string;
  candidatePhone?: string | null;
  candidateLocation?: string | null;
  candidateLinkedinUrl?: string | null;
  candidateGithubUrl?: string | null;
  candidatePortfolioUrl?: string | null;
  candidateSkills: string[];
  candidateExperienceYears?: number | null;
  coverLetter: string | null;
  notes: string | null;
  answers?: Record<string, string> | null;
  hasIncentive: boolean;
}

export interface IOrgApplicationsFilters {
  view: 'kanban' | 'list';
  page: number;
  limit: number;
  jobId?: string;
  status?: ApplicationStatus;
  search?: string;
}

export interface IOrgJobOption {
  id: string;
  title: string;
}
