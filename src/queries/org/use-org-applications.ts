/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
// src/queries/org/use-org-applications.ts
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type {
  ApplicationStatus,
  IOrgApplicationDetail,
  IOrgApplicationListItem,
  IOrgApplicationsFilters,
  IOrgJobOption,
} from '@app-types/org/org.applications';

/**
 * ── MOCK DATA LAYER — Phase 4B design pass ──────────────────────────────
 * Real endpoints already exist: GET /org/applications, GET /org/applications/:id,
 * PATCH /org/applications/:id/status, GET /org/jobs/:jobId/applications
 * (org.application.routes.ts / org.job.applications.routes.ts). Once
 * `org.applications` lands in `@lib/axios/modules/org.api.ts`, swap each
 * mock body for the matching `APIKit.org.applications.*` call.
 */

async function mockDelay<T>(data: T, ms = 400): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return data;
}

const JOB_OPTIONS: IOrgJobOption[] = [
  { id: '1', title: 'Senior Backend Engineer' },
  { id: '2', title: 'Product Designer' },
  { id: '5', title: 'QA Automation Engineer' },
];

function jobTitle(jobId: string): string {
  return JOB_OPTIONS.find((j) => j.id === jobId)?.title ?? 'Unknown Job';
}

const NAMES: [string, string][] = [
  ['Sarah', 'Chen'],
  ['Marcus', 'Webb'],
  ['Priya', 'Nair'],
  ['Diego', 'Alvarez'],
  ['Fatima', 'Al-Sayed'],
  ['Liam', 'O\u2019Connor'],
  ['Aisha', 'Rahman'],
  ['Noah', 'Kim'],
  ['Elena', 'Petrova'],
  ['Yusuf', 'Demir'],
  ['Grace', 'Okonkwo'],
  ['Ravi', 'Patel'],
  ['Mei', 'Lin'],
  ['Tomas', 'Novak'],
];

const STATUSES: ApplicationStatus[] = [
  'PENDING',
  'PENDING',
  'PENDING',
  'UNDER_REVIEW',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'SHORTLISTED',
  'INTERVIEW_SCHEDULED',
  'OFFERED',
  'HIRED',
  'REJECTED',
  'REJECTED',
  'WITHDRAWN',
  'PENDING',
];

const MOCK_APPLICATIONS: IOrgApplicationListItem[] = NAMES.map(([first, last], i) => {
  const jobId = JOB_OPTIONS[i % JOB_OPTIONS.length]!.id;
  return {
    id: `app-${i + 1}`,
    jobId,
    jobTitle: jobTitle(jobId),
    status: STATUSES[i]!,
    candidateId: `cand-${i + 1}`,
    candidateName: `${first} ${last}`,
    candidateHeadline: i % 2 === 0 ? 'Full-stack developer' : 'Product-minded engineer',
    appliedAt: new Date(Date.now() - (i + 1) * 8 * 3_600_000).toISOString(),
    updatedAt: new Date(Date.now() - i * 3_600_000).toISOString(),
    resumeUrl: '/mock/resume.pdf',
  };
});

function toDetail(item: IOrgApplicationListItem): IOrgApplicationDetail {
  return {
    ...item,
    candidateEmail: `${item.candidateName.split(' ')[0]!.toLowerCase()}@example.com`,
    candidatePhone: '+1 (555) 010-0000',
    candidateLocation: 'Remote',
    candidateLinkedinUrl: 'https://linkedin.com/in/example',
    candidateGithubUrl: 'https://github.com/example',
    candidatePortfolioUrl: null,
    candidateSkills: ['TypeScript', 'React', 'Node.js'],
    candidateExperienceYears: 4,
    coverLetter:
      "I'm excited about this role because it combines the technical depth and product ownership I've been looking for in my next position.",
    notes: null,
    answers: null,
    hasIncentive: item.status === 'HIRED',
  };
}

// ── List / board data ────────────────────────────────────────────────────

function filterApplications(filters: Partial<IOrgApplicationsFilters>): IOrgApplicationListItem[] {
  return MOCK_APPLICATIONS.filter((a) => (filters.jobId ? a.jobId === filters.jobId : true))
    .filter((a) => (filters.status ? a.status === filters.status : true))
    .filter((a) =>
      filters.search ? a.candidateName.toLowerCase().includes(filters.search.toLowerCase()) : true,
    );
}

/** Kanban board: all statuses, no pagination — grouped into columns client-side. */
export function useOrgApplicationsBoard(jobId?: string, search?: string) {
  return useQuery({
    queryKey: ['org-applications-board', jobId, search],
    queryFn: () => mockDelay(filterApplications({ jobId, search })),
    placeholderData: (prev) => prev,
  });
}

/** List view: paginated + status-filterable. */
export function useOrgApplicationsList(filters: IOrgApplicationsFilters) {
  return useQuery({
    queryKey: ['org-applications-list', filters],
    queryFn: () => {
      const filtered = filterApplications(filters);
      const start = (filters.page - 1) * filters.limit;
      return mockDelay({
        applications: filtered.slice(start, start + filters.limit),
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

export function useOrgJobOptions() {
  return useQuery({
    queryKey: ['org-job-options'],
    queryFn: () => mockDelay(JOB_OPTIONS),
    staleTime: 1000 * 60 * 5,
  });
}

// ── Detail ───────────────────────────────────────────────────────────────

export function useOrgApplicationDetail(id: string | null) {
  return useQuery({
    queryKey: ['org-application-detail', id],
    queryFn: () => {
      const item = MOCK_APPLICATIONS.find((a) => a.id === id);
      return mockDelay(item ? toDetail(item) : null);
    },
    enabled: id !== null,
  });
}

// ── Mutations ────────────────────────────────────────────────────────────

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; status: ApplicationStatus }) =>
      mockDelay(payload, 500),
    onSuccess: (data) => {
      const label = data.status === 'HIRED' ? 'Candidate marked as hired! 🎉' : 'Status updated';
      toast.success(label);
      void qc.invalidateQueries({ queryKey: ['org-applications-board'] });
      void qc.invalidateQueries({ queryKey: ['org-applications-list'] });
      void qc.invalidateQueries({ queryKey: ['org-application-detail', data.id] });
    },
    onError: () => toast.error('Failed to update status'),
  });
}

export function useUpdateApplicationNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; notes: string }) => mockDelay(payload),
    onSuccess: (data) => {
      toast.success('Note saved');
      void qc.invalidateQueries({ queryKey: ['org-application-detail', data.id] });
    },
    onError: () => toast.error('Failed to save note'),
  });
}
