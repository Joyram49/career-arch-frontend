/* eslint-disable @typescript-eslint/explicit-function-return-type */
// src/queries/org/use-org-job-detail.ts
'use client';

import { useQuery } from '@tanstack/react-query';

import type { IOrgJobDetail } from '@app-types/org/org.job-detail';

/**
 * ── MOCK DATA LAYER — Phase 4B design pass ──────────────────────────────
 * Real endpoint already exists: GET /org/jobs/:id (org.jobs.routes.ts).
 * Once `org.jobs.getById` lands in `@lib/axios/modules/org.api.ts`, replace
 * the queryFn body with `(await APIKit.org.jobs.getById(id)).data.data.job`.
 * The `applicationsByStatus` breakdown will need a small addition on the
 * backend service (a `groupBy` on Application.status scoped to this job) —
 * everything else already maps 1:1 to the Job + Application models.
 */

async function mockDelay<T>(data: T, ms = 400): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return data;
}

const MOCK_JOB_DETAILS: Record<string, IOrgJobDetail> = {
  '1': {
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
    category: 'Engineering',
    skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'AWS'],
    description:
      'We are looking for a Senior Backend Engineer to design and scale the services that power our hiring platform. You will work closely with product and infrastructure teams to ship reliable, well-tested APIs.',
    responsibilities:
      'Own the design of core backend services. Mentor mid-level engineers. Partner with product on API contracts. Participate in on-call rotation.',
    requirements:
      '5+ years of backend experience. Strong grasp of relational databases and caching strategies. Comfortable owning services end-to-end.',
    applicationsByStatus: {
      PENDING: 18,
      UNDER_REVIEW: 12,
      SHORTLISTED: 8,
      INTERVIEW_SCHEDULED: 5,
      OFFERED: 2,
      HIRED: 1,
      REJECTED: 1,
      WITHDRAWN: 0,
    },
  },
  '3': {
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
    category: 'Engineering',
    skills: ['Kubernetes', 'Terraform', 'CI/CD'],
    description:
      'Draft — help us build and maintain the infrastructure behind CareerArch, including our CI/CD pipelines and production Kubernetes clusters.',
    responsibilities:
      'Manage infrastructure as code. Improve deployment pipelines. Own incident response tooling.',
    requirements: '3+ years in a DevOps or SRE role. Hands-on Kubernetes and Terraform experience.',
    applicationsByStatus: {
      PENDING: 0,
      UNDER_REVIEW: 0,
      SHORTLISTED: 0,
      INTERVIEW_SCHEDULED: 0,
      OFFERED: 0,
      HIRED: 0,
      REJECTED: 0,
      WITHDRAWN: 0,
    },
  },
  '6': {
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
    category: 'Engineering',
    skills: ['React', 'CSS', 'JavaScript'],
    description:
      'A 6-month internship for someone early in their frontend career, working alongside our design system team.',
    responsibilities: 'Build UI components under senior guidance. Fix bugs. Write component tests.',
    requirements:
      'Basic React and CSS knowledge. Currently pursuing or recently completed a CS-related degree.',
    applicationsByStatus: {
      PENDING: 4,
      UNDER_REVIEW: 3,
      SHORTLISTED: 2,
      INTERVIEW_SCHEDULED: 1,
      OFFERED: 1,
      HIRED: 1,
      REJECTED: 0,
      WITHDRAWN: 0,
    },
  },
};

const FALLBACK_JOB: IOrgJobDetail = {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ...MOCK_JOB_DETAILS['1']!,
};

export function useOrgJobDetail(id: string) {
  return useQuery({
    queryKey: ['org-job-detail', id],
    queryFn: () => mockDelay(MOCK_JOB_DETAILS[id] ?? { ...FALLBACK_JOB, id }),
    enabled: id.length > 0,
    staleTime: 1000 * 60,
  });
}
