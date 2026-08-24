'use server';
import { type IApiResponse } from '@app-types/api';
import { type IUser, type IUserProfile } from '@app-types/auth';
import client from '@lib/axios/client';
import { serverFetchOrRedirect } from '@lib/server-fetch';

// ── Called from Server Components / Server Actions ──
export async function getProfileServer(): Promise<IUser> {
  const data = await serverFetchOrRedirect<IApiResponse<{ user: IUser }>>('/auth/user/me');
  return data.data.user;
}

// ── Called from TanStack Query hooks (Client Components) ──
// export async function getProfileClient(): Promise<IUser> {
//   const response = await client.get<IApiResponse<{ user: IUser }>>('/auth/user/me');
//   return response.data.data.user;
// }

export async function updateProfile(
  payload: Record<string, unknown>,
): Promise<Partial<IUserProfile>> {
  const { data } = await client.put<IApiResponse<{ user: IUser }>>('/user/profile', payload);
  return data.data.user.profile ?? {};
}

// export async function uploadAvatar(file: File) {
//   const form = new FormData();
//   form.append('avatar', file);
//   const { data } = await client.post('/user/profile/avatar', form, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return data.data;
// }

// export async function uploadResume(file: File) {
//   const form = new FormData();
//   form.append('resume', file);
//   const { data } = await client.post('/user/profile/resume', form, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return data.data;
// }

// export async function deleteResume() {
//   const { data } = await client.delete('/user/profile/resume');
//   return data;
// }

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<IApiResponse> {
  const { data } = await client.put<IApiResponse<null>>('/user/change-password', payload);
  return data;
}
