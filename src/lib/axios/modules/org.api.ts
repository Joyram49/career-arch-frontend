// src/lib/axios/modules/org.api.ts
import type { IApiResponse, IPaginationMeta } from '@app-types/api';
import type { IJob } from '@app-types/job';
import client from '../client';

const org = {
  profile: {
    get: () => client.get<IApiResponse<{ org: unknown }>>('/org/profile'),

    update: (payload: Record<string, unknown>) =>
      client.put<IApiResponse<{ org: unknown }>>('/org/profile', payload),

    uploadLogo: (formData: FormData) =>
      client.post<IApiResponse<{ logoUrl: string }>>('/org/profile/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
  },

  jobs: {
    getAll: (params?: Record<string, unknown>) =>
      client.get<IApiResponse<IPaginationMeta>>('/org/jobs', { params }),

    getById: (id: string) => client.get<IApiResponse<{ job: IJob }>>(`/org/jobs/${id}`),

    create: (payload: Record<string, unknown>) =>
      client.post<IApiResponse<{ job: IJob }>>('/org/jobs', payload),

    update: (id: string, payload: Record<string, unknown>) =>
      client.put<IApiResponse<{ job: IJob }>>(`/org/jobs/${id}`, payload),

    delete: (id: string) => client.delete<IApiResponse<null>>(`/org/jobs/${id}`),

    publish: (id: string) => client.patch<IApiResponse<null>>(`/org/jobs/${id}/publish`),

    close: (id: string) => client.patch<IApiResponse<null>>(`/org/jobs/${id}/close`),

    restore: (id: string) => client.patch<IApiResponse<null>>(`/org/jobs/${id}/restore`),

    getDeleted: () => client.get<IApiResponse<{ jobs: IJob[] }>>('/org/jobs/deleted'),
  },

  applications: {
    getAll: (params?: Record<string, unknown>) =>
      client.get<IApiResponse<IPaginationMeta>>('/org/applications', {
        params,
      }),

    getById: (id: string) =>
      client.get<IApiResponse<{ application: unknown }>>(`/org/applications/${id}`),

    updateStatus: (id: string, payload: { status: string }) =>
      client.patch<IApiResponse<null>>(`/org/applications/${id}/status`, payload),

    getByJob: (jobId: string, params?: Record<string, unknown>) =>
      client.get<IApiResponse<IPaginationMeta>>(`/org/jobs/${jobId}/applications`, { params }),
  },

  incentives: {
    getAll: (params?: Record<string, unknown>) =>
      client.get<IApiResponse<IPaginationMeta>>('/org/incentives', {
        params,
      }),

    getById: (id: string) =>
      client.get<IApiResponse<{ incentive: unknown }>>(`/org/incentives/${id}`),

    pay: (id: string) => client.post<IApiResponse<null>>(`/org/incentives/${id}/pay`),

    dispute: (id: string, payload: { reason: string }) =>
      client.post<IApiResponse<null>>(`/org/incentives/${id}/dispute`, payload),
  },

  billing: {
    get: () => client.get<IApiResponse<{ billing: unknown }>>('/org/billing'),

    createSetupIntent: () =>
      client.post<IApiResponse<{ clientSecret: string }>>('/org/billing/setup-intent'),

    savePaymentMethod: (payload: { paymentMethodId: string }) =>
      client.post<IApiResponse<null>>('/org/billing/payment-method', payload),

    deletePaymentMethod: () => client.delete<IApiResponse<null>>('/org/billing/payment-method'),
  },
};

export default org;
