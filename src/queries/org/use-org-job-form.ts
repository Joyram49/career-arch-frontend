/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { OrgJobFormInput } from '@validations/org.job-form.schema';

/**
 * ── MOCK DATA LAYER — Phase 4B design pass ──────────────────────────────
 * Real endpoints already exist: POST /org/jobs, PUT /org/jobs/:id
 * (org.jobs.routes.ts). Once `org.jobs.create` / `org.jobs.update` land in
 * `@lib/axios/modules/org.api.ts`, swap the mutationFn bodies below for the
 * matching `APIKit.org.jobs.*` calls — nothing in the form components changes.
 */

async function mockDelay<T>(data: T, ms = 600): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return data;
}

export type OrgJobSubmitPayload = OrgJobFormInput & { status: 'DRAFT' | 'PUBLISHED' };

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: OrgJobSubmitPayload) =>
      mockDelay({ id: crypto.randomUUID(), ...payload }),
    onSuccess: (data) => {
      toast.success(data.status === 'PUBLISHED' ? 'Job published!' : 'Draft saved');
      void qc.invalidateQueries({ queryKey: ['org-jobs'] });
      void qc.invalidateQueries({ queryKey: ['org-jobs-status-counts'] });
      void qc.invalidateQueries({ queryKey: ['org-dashboard-stats'] });
    },
    onError: () => toast.error('Failed to save job'),
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: OrgJobSubmitPayload & { id: string }) => mockDelay(payload),
    onSuccess: (data) => {
      toast.success('Job updated');
      void qc.invalidateQueries({ queryKey: ['org-jobs'] });
      void qc.invalidateQueries({ queryKey: ['org-job-detail', data.id] });
    },
    onError: () => toast.error('Failed to update job'),
  });
}
