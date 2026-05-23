// src/lib/axios/modules/jobs.api.ts
import type { IApiResponse, IPaginationMeta } from '@app-types/api';
import type { IJob } from '@app-types/job';
import client from '../client';

const jobs = {
  search: (params?: Record<string, unknown>) =>
    client.get<IApiResponse<IPaginationMeta>>('/jobs', { params }),

  getBySlug: (slug: string) => client.get<IApiResponse<{ job: IJob }>>(`/jobs/${slug}`),

  getCategories: () => client.get<IApiResponse<{ categories: string[] }>>('/jobs/categories'),
};

export default jobs;
