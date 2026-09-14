export type OrgJobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';

export interface IOrgDashboardStats {
  activeJobListings: number;
  jobsExpiringSoon: number;
  totalApplications: number;
  newApplicationsThisWeek: number;
  interviewsScheduled: number;
  interviewsThisWeek: number;
  successfulHires: number;
  pendingIncentiveAmount: number;
  pendingIncentiveCount: number;
}

export interface IOrgJobPerformanceItem {
  id: string;
  title: string;
  slug: string;
  status: OrgJobStatus;
  requiredPlan: 'FREE' | 'BASIC' | 'PREMIUM';
  applicationsCount: number;
  views: number;
  daysActive: number;
  deadline: string | null;
}

// The backend's /org/dashboard/jobs-performance only supports page/limit —
// no search/status filtering exists there (this is a lightweight recent-jobs
// feed, not the full Job Listings query). Kept in sync with the real
// endpoint rather than the earlier, broader mock-only shape.
export interface IOrgJobsPerformanceFilters {
  page: number;
  limit: number;
}

export interface IOrgRecentApplicant {
  id: string;
  applicationId: string;
  candidateName: string;
  candidateAvatarUrl?: string | null;
  jobId: string;
  jobTitle: string;
  appliedAt: string;
}
