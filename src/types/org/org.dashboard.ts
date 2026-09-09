export type OrgJobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';

export type OrgRequiredPlan = 'FREE' | 'BASIC' | 'PREMIUM';

// ── Overview stats (GET /org/dashboard/stats — not yet implemented) ────────
export interface IOrgDashboardStats {
  activeJobListings: number;
  jobsExpiringSoon: number;
  totalApplications: number;
  newApplicationsThisWeek: number;
  interviewsScheduled: number;
  interviewsThisWeek: number;
  successfulHires: number;
  pendingIncentiveAmountCents: number;
  pendingIncentiveCount: number;
}

// ── Jobs performance table (GET /org/dashboard/jobs-performance) ───────────
export interface IOrgJobPerformanceItem {
  id: string;
  title: string;
  slug: string;
  status: OrgJobStatus;
  requiredPlan: OrgRequiredPlan;
  applicationsCount: number;
  views: number;
  daysActive: number;
  deadline: string | null;
}

export interface IOrgJobsPerformanceFilters {
  page: number;
  limit: number;
  search?: string;
  status?: OrgJobStatus;
}

// ── Recent applications panel (GET /org/dashboard/recent-applications) ─────
export interface IOrgRecentApplicant {
  id: string;
  applicationId: string;
  candidateName: string;
  candidateAvatarUrl?: string | null;
  jobId: string;
  jobTitle: string;
  appliedAt: string;
}
