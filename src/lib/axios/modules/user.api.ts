import { IApiResponse, IPaginationMeta } from '@app-types/api';
import type { IUser, IUserProfile } from '@app-types/auth';
import client from '../client';

const user = {
  profile: {
    getMe: () => client.get<IApiResponse<{ user: IUser }>>('/auth/user/me'),

    update: (payload: Partial<IUserProfile>) =>
      client.put<IApiResponse<{ user: IUser }>>('/user/profile', payload),

    uploadAvatar: (formData: FormData) =>
      client.post<IApiResponse<{ avatarUrl: string }>>('/user/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),

    uploadResume: (formData: FormData) =>
      client.post<IApiResponse<{ resumeUrl: string }>>('/user/profile/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),

    deleteResume: () => client.delete<IApiResponse<null>>('/user/profile/resume'),
  },

  savedJobs: {
    getAll: (params?: Record<string, unknown>) =>
      client.get<IApiResponse<IPaginationMeta>>('/user/saved-jobs', {
        params,
      }),

    save: (jobId: string) => client.post<IApiResponse<null>>(`/user/jobs/${jobId}/save`),

    unsave: (jobId: string) => client.delete<IApiResponse<null>>(`/user/jobs/${jobId}/save`),
  },
};

export default user;
