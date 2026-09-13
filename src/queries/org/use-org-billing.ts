/* eslint-disable @typescript-eslint/explicit-function-return-type */
// src/queries/org/use-org-billing.ts
'use client';

import { APIKit } from '@lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

import type { ApiErrorResponse } from '@app-types/api';

/**
 * ── NOT mocked, unlike every other org page built so far ────────────────
 * Two reasons: `org.billing.controller.ts` / `.service.ts` are already
 * fully implemented on the backend (same situation as Incentives and
 * Profile), and Stripe's `confirmCardSetup()` talks to Stripe's real
 * servers regardless of what the backend returns — a fake `clientSecret`
 * would just produce a real Stripe error, so there's no honest way to mock
 * the add-card flow. Requires `APIKit.org.billing` to exist — see
 * ORG_API_BILLING_ADDITION.snippet.ts if you haven't added it yet.
 */

function extractErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return axiosError.response?.data?.message ?? fallback;
}

export function useOrgBilling() {
  return useQuery({
    queryKey: ['org-billing'],
    queryFn: async () => (await APIKit.org.billing.getInfo()).data.data.billing,
    staleTime: 1000 * 60,
  });
}

export function useCreateSetupIntent() {
  return useMutation({
    mutationFn: async () => (await APIKit.org.billing.createSetupIntent()).data.data,
    onError: (error) => toast.error(extractErrorMessage(error, 'Failed to start card setup')),
  });
}

export function useSavePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (paymentMethodId: string) =>
      (await APIKit.org.billing.savePaymentMethod(paymentMethodId)).data.data.billing,
    onSuccess: () => {
      toast.success('Payment method saved successfully.');
      void qc.invalidateQueries({ queryKey: ['org-billing'] });
    },
    onError: (error) => toast.error(extractErrorMessage(error, 'Failed to save payment method')),
  });
}

export function useRemovePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => (await APIKit.org.billing.removePaymentMethod()).data,
    onSuccess: () => {
      toast.success('Payment method removed successfully');
      void qc.invalidateQueries({ queryKey: ['org-billing'] });
    },
    onError: (error) => toast.error(extractErrorMessage(error, 'Failed to remove payment method')),
  });
}
