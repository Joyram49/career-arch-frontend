/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';

import { APIKit } from '@lib/axios';
import { useQuery } from '@tanstack/react-query';

import type { IOrgJobsPerformanceFilters } from '@app-types/org/org.dashboard';

export function useOrgDashboardStats() {
  return useQuery({
    queryKey: ['org-dashboard-stats'],
    queryFn: async () => (await APIKit.org.dashboard.getStats()).data.data.stats,
    staleTime: 1000 * 60,
  });
}

export function useOrgJobsPerformance(filters: IOrgJobsPerformanceFilters) {
  return useQuery({
    queryKey: ['org-jobs-performance', filters],
    queryFn: async () => {
      const response = await APIKit.org.dashboard.getJobsPerformance(filters);
      return { jobs: response.data.data.jobs, meta: response.data.data.meta };
    },
    placeholderData: (prev) => prev,
  });
}

export function useOrgRecentApplications() {
  return useQuery({
    queryKey: ['org-recent-applications'],
    queryFn: async () => (await APIKit.org.dashboard.getRecentApplications()).data.data.applicants,
    staleTime: 1000 * 60,
  });
}
