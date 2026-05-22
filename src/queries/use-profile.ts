'use client';

import { useQuery } from '@tanstack/react-query';

import { IApiResponse } from '@app-types/api';
import { IUser } from '@app-types/auth';
import client from '@lib/axios/client';
// import { updateProfile } from '@services/user/profile.service';

export async function getProfileClient(): Promise<IUser> {
  const response = await client.get<IApiResponse<{ user: IUser }>>('/auth/user/me');
  return response.data.data.user;
}

export const PROFILE_KEYS = {
  root: () => ['profile'] as const,
  mine: () => ['profile', 'me'] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_KEYS.mine(),
    queryFn: getProfileClient,
    staleTime: 1000 * 60 * 5,
  });
}

// export function useUpdateProfile() {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: updateProfile,
//     onSuccess: () => {
//       void qc.invalidateQueries({ queryKey: PROFILE_KEYS.mine() });
//     },
//   });
// }
