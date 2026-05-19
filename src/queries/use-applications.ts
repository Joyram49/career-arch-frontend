'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  getApplications,
  getApplicationStats,
  withdrawApplication,
} from '@services/application.service';

export const APPLICATION_KEYS = {
  all: () => ['applications'] as const,
  list: (filters = {}) => ['applications', 'list', filters] as const,
  stats: () => ['applications', 'stats'] as const,
  detail: (id: string) => ['applications', 'detail', id] as const,
};

export function useApplications(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: APPLICATION_KEYS.list(filters),
    queryFn: () => getApplications(filters),
    staleTime: 1000 * 60 * 2,
  });
}

export function useApplicationStats() {
  return useQuery({
    queryKey: APPLICATION_KEYS.stats(),
    queryFn: getApplicationStats,
    staleTime: 1000 * 60 * 5,
  });
}

export function useWithdrawApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => withdrawApplication(id),
    onSuccess: () => {
      toast.success('Application withdrawn');
      void qc.invalidateQueries({ queryKey: APPLICATION_KEYS.all() });
    },
    onError: () => toast.error('Failed to withdraw application'),
  });
}
