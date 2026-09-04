/* eslint-disable @typescript-eslint/explicit-function-return-type */
// src/queries/admin/use-admin-jobs.ts
'use client';

import { type IApiErrorResponse } from '@app-types/api';
import { APIKit } from '@lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

function showApiError(error: AxiosError<IApiErrorResponse>, fallback: string): void {
  toast.error(error.response?.data?.message ?? fallback);
}

// ── Takedown (force-close a published job) ──────────────────────────────────

export function useTakedownJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      APIKit.admin.jobs.takedown(id, reason),
    onSuccess: () => {
      toast.success('Job taken down successfully');
      void queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    },
    onError: (error: AxiosError<IApiErrorResponse>) =>
      showApiError(error, 'Failed to take down job'),
  });
}

// ── Republish (CLOSED → PUBLISHED) ───────────────────────────────────────────

export function useRepublishJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => APIKit.admin.jobs.republish(id),
    onSuccess: () => {
      toast.success('Job republished successfully');
      void queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    },
    onError: (error: AxiosError<IApiErrorResponse>) =>
      showApiError(error, 'Failed to republish job'),
  });
}

// ── Archive (CLOSED → ARCHIVED, soft delete) ─────────────────────────────────

export function useArchiveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      APIKit.admin.jobs.archive(id, reason),
    onSuccess: () => {
      toast.success('Job archived successfully');
      void queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
    },
    onError: (error: AxiosError<IApiErrorResponse>) => showApiError(error, 'Failed to archive job'),
  });
}
