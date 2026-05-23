// src/lib/axios/modules/auth.api.ts
import type { IApiResponse } from '@app-types/api';
import type { IUser } from '@app-types/auth';
import client from '../client';

const auth = {
  getMe: () => client.get<IApiResponse<{ user: IUser }>>('/auth/user/me'),

  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    client.put<IApiResponse<null>>('/user/change-password', payload),

  setupTwoFa: () =>
    client.post<IApiResponse<{ qrCodeUrl: string; manualKey: string; backupCodes: string[] }>>(
      '/auth/user/2fa/setup',
    ),

  verifyTwoFa: (payload: { otp: string }) =>
    client.post<IApiResponse<{ backupCodes: string[] }>>('/auth/user/2fa/verify', payload),

  disableTwoFa: (payload: { password: string; otp: string }) =>
    client.post<IApiResponse<null>>('/auth/user/2fa/disable', payload),
};

export default auth;
