/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';

import type { IApiErrorResponse } from '@app-types/api';
import { APIKit } from '@lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

export type DisputeResolution = 'collect' | 'waive';

interface WaiveIncentiveInput {
  id: string;
  reason: string;
}

interface ResolveDisputeInput {
  id: string;
  resolution: DisputeResolution;
  note?: string;
}

// Both mutations change an incentive's status, which shifts the
// pending/overdue/disputed/paid/waived counts AND the collected/pending cents
// shown on the KPI cards — so, unlike a subscription refund, list + stats
// must invalidate together every time.
function useInvalidateAdminIncentives(): () => Promise<void> {
  const queryClient = useQueryClient();
  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin-incentives'] }),
      queryClient.invalidateQueries({ queryKey: ['admin-incentive-stats'] }),
    ]);
  };
}

// ── Waive ─────────────────────────────────────────────────────────────────
export function useWaiveIncentive() {
  const invalidate = useInvalidateAdminIncentives();

  return useMutation({
    mutationFn: ({ id, reason }: WaiveIncentiveInput) => APIKit.admin.incentives.waive(id, reason),
    onSuccess: () => {
      toast.success('Incentive waived successfully');
      void invalidate();
    },
    onError: (error: AxiosError<IApiErrorResponse>) => {
      toast.error(error.response?.data?.message ?? 'Failed to waive incentive');
    },
  });
}

// ── Resolve dispute (collect or waive) ─────────────────────────────────────
export function useResolveDispute() {
  const invalidate = useInvalidateAdminIncentives();

  return useMutation({
    mutationFn: ({ id, resolution, note }: ResolveDisputeInput) =>
      APIKit.admin.incentives.resolveDispute(id, { resolution, note }),
    onSuccess: (_, variables) => {
      toast.success(
        variables.resolution === 'collect'
          ? 'Dispute resolved — payment collected'
          : 'Dispute resolved — incentive waived',
      );
      void invalidate();
    },
    onError: (error: AxiosError<IApiErrorResponse>) => {
      toast.error(error.response?.data?.message ?? 'Failed to resolve dispute');
    },
  });
}
