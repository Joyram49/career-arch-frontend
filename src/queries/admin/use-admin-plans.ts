/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';

import {
  type ICreatePlanPayload,
  type IUpdatePlanPayload,
} from '@app-types/admin/admin.dashboard.plans';
import type { IApiErrorResponse } from '@app-types/api';
import { APIKit } from '@lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

function useInvalidateAdminPlans(): () => Promise<void> {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
}

function getErrorMessage(error: AxiosError<IApiErrorResponse>, fallback: string): string {
  return error.response?.data?.message ?? fallback;
}

export function useCreatePlan() {
  const invalidate = useInvalidateAdminPlans();

  return useMutation({
    mutationFn: (payload: ICreatePlanPayload) => APIKit.admin.plans.create(payload),
    onSuccess: () => {
      toast.success('Plan created and synced to Stripe');
      void invalidate();
    },
    onError: (error: AxiosError<IApiErrorResponse>) => {
      toast.error(getErrorMessage(error, 'Failed to create plan'));
    },
  });
}

interface UpdatePlanVariables {
  id: string;
  payload: IUpdatePlanPayload;
}

export function useUpdatePlan() {
  const invalidate = useInvalidateAdminPlans();

  return useMutation({
    mutationFn: ({ id, payload }: UpdatePlanVariables) => APIKit.admin.plans.update(id, payload),
    onSuccess: () => {
      toast.success('Plan updated');
      void invalidate();
    },
    onError: (error: AxiosError<IApiErrorResponse>) => {
      toast.error(getErrorMessage(error, 'Failed to update plan'));
    },
  });
}

export function useTogglePlan() {
  const invalidate = useInvalidateAdminPlans();

  return useMutation({
    mutationFn: (id: string) => APIKit.admin.plans.toggle(id),
    onSuccess: (response) => {
      const isActive = response.data.data.plan.isActive;
      toast.success(`Plan ${isActive ? 'activated' : 'deactivated'}`);
      void invalidate();
    },
    onError: (error: AxiosError<IApiErrorResponse>) => {
      toast.error(getErrorMessage(error, 'Failed to toggle plan status'));
    },
  });
}

export function useDeletePlan() {
  const invalidate = useInvalidateAdminPlans();

  return useMutation({
    mutationFn: (id: string) => APIKit.admin.plans.delete(id),
    onSuccess: () => {
      toast.success('Plan deleted');
      void invalidate();
    },
    onError: (error: AxiosError<IApiErrorResponse>) => {
      toast.error(getErrorMessage(error, 'Failed to delete plan'));
    },
  });
}
