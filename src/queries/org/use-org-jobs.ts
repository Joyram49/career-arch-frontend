/* eslint-disable @typescript-eslint/explicit-function-return-type */
// src/queries/org/use-org-jobs.ts
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type {
  IOrgJobListItem,
  IOrgJobsFilters,
  IOrgJobsStatusCounts,
} from '@app-types/org/org.jobs';

/**
 * ── MOCK DATA LAYER — Phase 4B design pass ──────────────────────────────
 * Real endpoints already exist on the backend (see org.routes / org.jobs.routes:
 * GET /org/jobs, GET /org/jobs/deleted, PATCH /org/jobs/:id/publish,
 * PATCH /org/jobs/:id/close, PATCH /org/jobs/:id/restore, DELETE /org/jobs/:id).
 * Once `org.jobs` lands in `@lib/axios/modules/org.api.ts` (same pattern as
 * `admin.api.ts`), replace each queryFn/mutationFn body with the matching
 * `APIKit.org.jobs.*` call — query keys and components don't change.
 */

async function mockDelay<T>(data: T, ms = 400): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return data;
}

const MOCK_JOBS: IOrgJobListItem[] = [
  {
    id: '1',
    title: 'Senior Backend Engineer',
    slug: 'senior-backend-engineer',
    status: 'PUBLISHED',
    jobType: 'FULL_TIME',
    location: 'New York, NY',
    isRemote: true,
    salaryMin: 120000,
    salaryMax: 160000,
    salaryCurrency: 'USD',
    experienceLevel: 'Senior',
    requiredPlan: 'BASIC',
    applicationsCount: 47,
    views: 1240,
    vacancies: 2,
    deadline: new Date(Date.now() + 8 * 86_400_000).toISOString(),
    publishedAt: new Date(Date.now() - 6 * 86_400_000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 86_400_000).toISOString(),
  },
  {
    id: '2',
    title: 'Product Designer',
    slug: 'product-designer',
    status: 'PUBLISHED',
    jobType: 'FULL_TIME',
    location: 'Remote',
    isRemote: true,
    salaryMin: 90000,
    salaryMax: 120000,
    salaryCurrency: 'USD',
    experienceLevel: 'Mid',
    requiredPlan: 'FREE',
    applicationsCount: 31,
    views: 860,
    vacancies: 1,
    deadline: new Date(Date.now() + 20 * 86_400_000).toISOString(),
    publishedAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
    createdAt: new Date(Date.now() - 12 * 86_400_000).toISOString(),
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    slug: 'devops-engineer',
    status: 'DRAFT',
    jobType: 'FULL_TIME',
    location: 'San Francisco, CA',
    isRemote: false,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: 'USD',
    experienceLevel: 'Senior',
    requiredPlan: 'PREMIUM',
    applicationsCount: 0,
    views: 0,
    vacancies: 1,
    deadline: null,
    publishedAt: null,
    createdAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
  },
  {
    id: '4',
    title: 'Marketing Lead',
    slug: 'marketing-lead',
    status: 'CLOSED',
    jobType: 'FULL_TIME',
    location: 'Austin, TX',
    isRemote: false,
    salaryMin: 80000,
    salaryMax: 110000,
    salaryCurrency: 'USD',
    experienceLevel: 'Lead',
    requiredPlan: 'FREE',
    applicationsCount: 58,
    views: 2010,
    vacancies: 1,
    deadline: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    publishedAt: new Date(Date.now() - 30 * 86_400_000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 86_400_000).toISOString(),
  },
  {
    id: '5',
    title: 'QA Automation Engineer',
    slug: 'qa-automation-engineer',
    status: 'PUBLISHED',
    jobType: 'CONTRACT',
    location: 'Remote',
    isRemote: true,
    salaryMin: 60000,
    salaryMax: 85000,
    salaryCurrency: 'USD',
    experienceLevel: 'Mid',
    requiredPlan: 'BASIC',
    applicationsCount: 19,
    views: 540,
    vacancies: 1,
    deadline: new Date(Date.now() + 2 * 86_400_000).toISOString(),
    publishedAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
  },
  {
    id: '6',
    title: 'Junior Frontend Developer',
    slug: 'junior-frontend-developer',
    status: 'ARCHIVED',
    jobType: 'INTERNSHIP',
    location: 'Remote',
    isRemote: true,
    salaryMin: 40000,
    salaryMax: 55000,
    salaryCurrency: 'USD',
    experienceLevel: 'Entry',
    requiredPlan: 'FREE',
    applicationsCount: 12,
    views: 300,
    vacancies: 1,
    deadline: null,
    publishedAt: new Date(Date.now() - 45 * 86_400_000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 86_400_000).toISOString(),
    deleteAt: new Date(Date.now() + 18 * 86_400_000).toISOString(),
  },
];

function filterJobs(filters: IOrgJobsFilters): IOrgJobListItem[] {
  return MOCK_JOBS.filter((j) => (filters.status ? j.status === filters.status : true))
    .filter((j) => (filters.jobType ? j.jobType === filters.jobType : true))
    .filter((j) =>
      filters.search ? j.title.toLowerCase().includes(filters.search.toLowerCase()) : true,
    );
}

// ── List ─────────────────────────────────────────────────────────────────

export function useOrgJobsList(filters: IOrgJobsFilters) {
  return useQuery({
    queryKey: ['org-jobs', filters],
    queryFn: () => {
      const filtered = filterJobs(filters);
      return mockDelay({
        jobs: filtered,
        meta: {
          total: filtered.length,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.max(1, Math.ceil(filtered.length / filters.limit)),
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    },
    placeholderData: (prev) => prev,
  });
}

// ── Status counts (drives the tab bar) ──────────────────────────────────

export function useOrgJobsStatusCounts() {
  return useQuery({
    queryKey: ['org-jobs-status-counts'],
    queryFn: () =>
      mockDelay<IOrgJobsStatusCounts>({
        all: MOCK_JOBS.length,
        draft: MOCK_JOBS.filter((j) => j.status === 'DRAFT').length,
        published: MOCK_JOBS.filter((j) => j.status === 'PUBLISHED').length,
        closed: MOCK_JOBS.filter((j) => j.status === 'CLOSED').length,
        archived: MOCK_JOBS.filter((j) => j.status === 'ARCHIVED').length,
      }),
    staleTime: 1000 * 30,
  });
}

// ── Lifecycle mutations ──────────────────────────────────────────────────

function useJobLifecycleMutation(action: string, successMessage: (id: string) => string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => mockDelay({ id }),
    onSuccess: (_, id) => {
      toast.success(successMessage(id));
      void qc.invalidateQueries({ queryKey: ['org-jobs'] });
      void qc.invalidateQueries({ queryKey: ['org-jobs-status-counts'] });
    },
    onError: () => toast.error(`Failed to ${action} job`),
  });
}

export function usePublishJob() {
  return useJobLifecycleMutation('publish', () => 'Job published — now visible to candidates');
}

export function useCloseJob() {
  return useJobLifecycleMutation('close', () => 'Job closed — no longer accepting applications');
}

export function useArchiveJob() {
  return useJobLifecycleMutation(
    'archive',
    () => 'Job archived — it will be permanently deleted after the retention period',
  );
}

export function useRestoreJob() {
  return useJobLifecycleMutation('restore', () => 'Job restored to Drafts');
}
