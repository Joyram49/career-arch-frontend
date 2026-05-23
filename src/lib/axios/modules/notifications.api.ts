// src/lib/axios/modules/notifications.api.ts
import type { IApiResponse, IPaginationMeta } from '@app-types/api';
import client from '../client';
const notifications = {
  getAll: (params?: Record<string, unknown>) =>
    client.get<IApiResponse<IPaginationMeta>>('/notifications', { params }),

  markRead: (id: string) => client.patch<IApiResponse<null>>(`/notifications/${id}/read`),

  markAllRead: () => client.patch<IApiResponse<null>>('/notifications/read-all'),
};

export default notifications;
