/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';

import { APIKit } from '@lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

function useInvalidateOrganizations(): () => Promise<void> {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
}

export function useApproveOrganization() {
  const invalidate = useInvalidateOrganizations();
  return useMutation({
    mutationFn: (id: string) => APIKit.admin.organizations.approve(id),
    onSuccess: () => {
      toast.success('Organization approved');
      void invalidate();
    },
    onError: () => toast.error('Failed to approve organization'),
  });
}

export function useSuspendOrganization() {
  const invalidate = useInvalidateOrganizations();
  return useMutation({
    mutationFn: (id: string) => APIKit.admin.organizations.suspend(id),
    onSuccess: () => {
      toast.success('Organization suspended');
      void invalidate();
    },
    onError: () => toast.error('Failed to suspend organization'),
  });
}

export function useActivateOrganization() {
  const invalidate = useInvalidateOrganizations();
  return useMutation({
    mutationFn: (id: string) => APIKit.admin.organizations.activate(id),
    onSuccess: () => {
      toast.success('Organization activated');
      void invalidate();
    },
    onError: () => toast.error('Failed to activate organization'),
  });
}
