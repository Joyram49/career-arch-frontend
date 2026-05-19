'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { cancelSubscription, getInvoices, getMySubscription } from '@services/subscription.service';

export const SUBSCRIPTION_KEYS = {
  root: () => ['subscription'] as const,
  mine: () => ['subscription', 'me'] as const,
  invoices: () => ['subscription', 'invoices'] as const,
};

export function useSubscription() {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.mine(),
    queryFn: getMySubscription,
    staleTime: 1000 * 60 * 5,
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.invoices(),
    queryFn: getInvoices,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      toast.success('Subscription cancelled');
      void qc.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.root() });
    },
    onError: () => toast.error('Failed to cancel subscription'),
  });
}
