/* eslint-disable @typescript-eslint/explicit-function-return-type */
// src/queries/org/use-org-dashboard.ts
'use client';

import { useQuery } from '@tanstack/react-query';

import type {
  IOrgDashboardStats,
  IOrgJobPerformanceItem,
  IOrgJobsPerformanceFilters,
  IOrgRecentApplicant,
} from '@app-types/org/org.dashboard';

/**
 * ── MOCK DATA LAYER — Phase 4B design pass ──────────────────────────────
 *
 * Backend endpoints (GET /org/dashboard/stats, /org/dashboard/jobs-performance,
 * /org/dashboard/recent-applications) don't exist yet. Every queryFn below
 * returns data shaped exactly like the intended `IApiResponse<{ ... }>`
 * payload, so swapping to the real call later is a one-line change — copy
 * the `org.dashboard.*` block into `@lib/axios/modules/org.api.ts` following
 * the same pattern as `admin.api.ts`, then replace the mock queryFn body
 * with `(await APIKit.org.dashboard.getStats()).data.data.stats`.
 *
 * Delete this comment block and the mock constants once the swap happens.
 */

async function mockDelay<T>(data: T, ms = 400): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return data;
}

// ── Stats ────────────────────────────────────────────────────────────────

const MOCK_STATS: IOrgDashboardStats = {
  activeJobListings: 8,
  jobsExpiringSoon: 2,
  totalApplications: 234,
  newApplicationsThisWeek: 47,
  interviewsScheduled: 12,
  interviewsThisWeek: 5,
  successfulHires: 3,
  pendingIncentiveAmountCents: 15000,
  pendingIncentiveCount: 2,
};

export function useOrgDashboardStats() {
  return useQuery({
    queryKey: ['org-dashboard-stats'],
    queryFn: () => mockDelay(MOCK_STATS),
    staleTime: 1000 * 60,
  });
}

// ── Jobs performance ─────────────────────────────────────────────────────

const MOCK_JOBS: IOrgJobPerformanceItem[] = [
  {
    id: '1',
    title: 'Senior Backend Engineer',
    slug: 'senior-backend-engineer',
    status: 'PUBLISHED',
    requiredPlan: 'BASIC',
    applicationsCount: 47,
    views: 1240,
    daysActive: 6,
    deadline: new Date(Date.now() + 8 * 86_400_000).toISOString(),
  },
  {
    id: '2',
    title: 'Product Designer',
    slug: 'product-designer',
    status: 'PUBLISHED',
    requiredPlan: 'FREE',
    applicationsCount: 31,
    views: 860,
    daysActive: 12,
    deadline: new Date(Date.now() + 20 * 86_400_000).toISOString(),
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    slug: 'devops-engineer',
    status: 'DRAFT',
    requiredPlan: 'PREMIUM',
    applicationsCount: 0,
    views: 0,
    daysActive: 0,
    deadline: null,
  },
  {
    id: '4',
    title: 'Marketing Lead',
    slug: 'marketing-lead',
    status: 'CLOSED',
    requiredPlan: 'FREE',
    applicationsCount: 58,
    views: 2010,
    daysActive: 30,
    deadline: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  },
  {
    id: '5',
    title: 'QA Automation Engineer',
    slug: 'qa-automation-engineer',
    status: 'PUBLISHED',
    requiredPlan: 'BASIC',
    applicationsCount: 19,
    views: 540,
    daysActive: 3,
    deadline: new Date(Date.now() + 2 * 86_400_000).toISOString(),
  },
];

export function useOrgJobsPerformance(filters: IOrgJobsPerformanceFilters) {
  return useQuery({
    queryKey: ['org-jobs-performance', filters],
    queryFn: () => {
      const filtered = MOCK_JOBS.filter((j) =>
        filters.status ? j.status === filters.status : true,
      ).filter((j) =>
        filters.search ? j.title.toLowerCase().includes(filters.search.toLowerCase()) : true,
      );
      return mockDelay({
        jobs: filtered,
        meta: {
          total: filtered.length,
          page: filters.page,
          limit: filters.limit,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    },
    placeholderData: (prev) => prev,
  });
}

// ── Recent applications ──────────────────────────────────────────────────

const MOCK_APPLICANTS: IOrgRecentApplicant[] = [
  {
    id: 'a1',
    applicationId: 'ap1',
    candidateName: 'Sarah Chen',
    jobId: '1',
    jobTitle: 'Senior Backend Engineer',
    appliedAt: new Date(Date.now() - 3_600_000 * 1).toISOString(),
  },
  {
    id: 'a2',
    applicationId: 'ap2',
    candidateName: 'Marcus Webb',
    jobId: '2',
    jobTitle: 'Product Designer',
    appliedAt: new Date(Date.now() - 3_600_000 * 3).toISOString(),
  },
  {
    id: 'a3',
    applicationId: 'ap3',
    candidateName: 'Priya Nair',
    jobId: '5',
    jobTitle: 'QA Automation Engineer',
    appliedAt: new Date(Date.now() - 3_600_000 * 8).toISOString(),
  },
  {
    id: 'a4',
    applicationId: 'ap4',
    candidateName: 'Diego Alvarez',
    jobId: '1',
    jobTitle: 'Senior Backend Engineer',
    appliedAt: new Date(Date.now() - 3_600_000 * 20).toISOString(),
  },
  {
    id: 'a5',
    applicationId: 'ap5',
    candidateName: 'Fatima Al-Sayed',
    jobId: '4',
    jobTitle: 'Marketing Lead',
    appliedAt: new Date(Date.now() - 3_600_000 * 30).toISOString(),
  },
];

export function useOrgRecentApplications() {
  return useQuery({
    queryKey: ['org-recent-applications'],
    queryFn: () => mockDelay(MOCK_APPLICANTS),
    staleTime: 1000 * 60,
  });
}
