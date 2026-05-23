// src/lib/axios/modules/admin.api.ts
import type { IApiResponse, IPaginationMeta } from '@app-types/api';
import client from '../client';

const admin = {
  dashboard: {
    getStats: () => client.get<IApiResponse<{ stats: unknown }>>('/admin/dashboard/stats'),
  },

  users: {
    getAll: (params?: Record<string, unknown>) =>
      client.get<IApiResponse<IPaginationMeta>>('/admin/users', { params }),

    getById: (id: string) => client.get<IApiResponse<{ user: unknown }>>(`/admin/users/${id}`),

    suspend: (id: string) => client.patch<IApiResponse<null>>(`/admin/users/${id}/suspend`),

    activate: (id: string) => client.patch<IApiResponse<null>>(`/admin/users/${id}/activate`),
  },

  organizations: {
    getAll: (params?: Record<string, unknown>) =>
      client.get<IApiResponse<IPaginationMeta>>('/admin/organizations', {
        params,
      }),

    approve: (id: string) => client.patch<IApiResponse<null>>(`/admin/organizations/${id}/approve`),

    suspend: (id: string) => client.patch<IApiResponse<null>>(`/admin/organizations/${id}/suspend`),

    activate: (id: string) =>
      client.patch<IApiResponse<null>>(`/admin/organizations/${id}/activate`),
  },

  jobs: {
    getAll: (params?: Record<string, unknown>) =>
      client.get<IApiResponse<IPaginationMeta>>('/admin/jobs', { params }),

    takedown: (id: string) => client.patch<IApiResponse<null>>(`/admin/jobs/${id}/takedown`),
  },

  plans: {
    getAll: () => client.get<IApiResponse<{ plans: unknown[] }>>('/admin/plans'),

    getById: (id: string) => client.get<IApiResponse<{ plan: unknown }>>(`/admin/plans/${id}`),

    create: (payload: Record<string, unknown>) =>
      client.post<IApiResponse<{ plan: unknown }>>('/admin/plans', payload),

    update: (id: string, payload: Record<string, unknown>) =>
      client.put<IApiResponse<{ plan: unknown }>>(`/admin/plans/${id}`, payload),

    toggle: (id: string) => client.patch<IApiResponse<null>>(`/admin/plans/${id}/toggle`),

    delete: (id: string) => client.delete<IApiResponse<null>>(`/admin/plans/${id}`),
  },

  subscriptions: {
    getAll: (params?: Record<string, unknown>) =>
      client.get<IApiResponse<IPaginationMeta>>('/admin/subscriptions', { params }),

    getStats: () => client.get<IApiResponse<{ stats: unknown }>>('/admin/subscriptions/stats'),

    getById: (id: string) =>
      client.get<IApiResponse<{ subscription: unknown }>>(`/admin/subscriptions/${id}`),

    cancel: (id: string) => client.post<IApiResponse<null>>(`/admin/subscriptions/${id}/cancel`),

    refund: (id: string, payload: Record<string, unknown>) =>
      client.post<IApiResponse<null>>(`/admin/subscriptions/${id}/refund`, payload),
  },

  incentives: {
    getAll: (params?: Record<string, unknown>) =>
      client.get<IApiResponse<IPaginationMeta>>('/admin/incentives', {
        params,
      }),

    getStats: () => client.get<IApiResponse<{ stats: unknown }>>('/admin/incentives/stats'),

    getById: (id: string) =>
      client.get<IApiResponse<{ incentive: unknown }>>(`/admin/incentives/${id}`),

    waive: (id: string) => client.post<IApiResponse<null>>(`/admin/incentives/${id}/waive`),

    resolveDispute: (id: string) =>
      client.post<IApiResponse<null>>(`/admin/incentives/${id}/resolve-dispute`),
  },
};

export default admin;
