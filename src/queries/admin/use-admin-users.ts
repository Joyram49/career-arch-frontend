/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';

import type { IApiErrorResponse } from '@app-types/api';
import { APIKit } from '@lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

interface UpdateUserStatusVariables {
  id: string;
  reason?: string;
}

function useInvalidateAdminUsers(): () => Promise<void> {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['admin-users'] });
}

export function useSuspendUser() {
  const invalidate = useInvalidateAdminUsers();

  return useMutation({
    mutationFn: ({ id, reason }: UpdateUserStatusVariables) =>
      APIKit.admin.users.suspend(id, reason),
    onSuccess: () => {
      toast.success('User suspended successfully');
      void invalidate();
    },
    onError: (error: AxiosError<IApiErrorResponse>) => {
      toast.error(error.response?.data?.message ?? 'Failed to suspend user');
    },
  });
}

export function useActivateUser() {
  const invalidate = useInvalidateAdminUsers();

  return useMutation({
    mutationFn: ({ id, reason }: UpdateUserStatusVariables) =>
      APIKit.admin.users.activate(id, reason),
    onSuccess: () => {
      toast.success('User activated successfully');
      void invalidate();
    },
    onError: (error: AxiosError<IApiErrorResponse>) => {
      toast.error(error.response?.data?.message ?? 'Failed to activate user');
    },
  });
}
