// src/lib/axios/modules/applications.api.ts
import type { IApiResponse, IPaginationMeta } from '@app-types/api';
import type { IApplication } from '@app-types/application';
import client from '../client';

const applications = {
  apply: (payload: { jobId: string; coverLetter?: string }) =>
    client.post<IApiResponse<{ application: IApplication }>>('/applications', payload),

  getAll: (params?: Record<string, unknown>) =>
    client.get<IApiResponse<IPaginationMeta>>('/applications', {
      params,
    }),

  getById: (id: string) =>
    client.get<IApiResponse<{ application: IApplication }>>(`/applications/${id}`),

  withdraw: (id: string) => client.delete<IApiResponse<null>>(`/applications/${id}`),
};

export default applications;
