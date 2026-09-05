/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';

import type { ApiErrorResponse } from '@app-types/api';
import { APIKit } from '@lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

export type RefundReason = 'duplicate' | 'fraudulent' | 'requested_by_customer';

interface CancelSubscriptionInput {
  id: string;
}

interface RefundSubscriptionInput {
  id: string;
  reason?: RefundReason;
}

// ── Force cancel ────────────────────────────────────────────────────────
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: CancelSubscriptionInput) => APIKit.admin.subscriptions.cancel(id),
    onSuccess: () => {
      toast.success('Subscription cancelled and user downgraded to FREE');
      void queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      // Cancelling changes byPlan counts + mrrCents — stats must refresh too.
      void queryClient.invalidateQueries({ queryKey: ['admin-subscription-stats'] });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message ?? 'Failed to cancel subscription');
    },
  });
}

// ── Refund last invoice ────────────────────────────────────────────────
export function useRefundSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: RefundSubscriptionInput) =>
      APIKit.admin.subscriptions.refund(id, reason !== undefined ? { reason } : {}),
    onSuccess: () => {
      toast.success('Refund issued successfully');
      void queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      // Refund doesn't change plan/status, only Stripe-side money — stats
      // (mrrCents etc.) are unaffected, but list amount could theoretically
      // still be re-derived, so we invalidate the list only, not stats.
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(error.response?.data?.message ?? 'Failed to issue refund');
    },
  });
}
