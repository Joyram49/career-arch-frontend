'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getProfile, updateProfile } from '@services/user/profile.service';

export const PROFILE_KEYS = {
  root: () => ['profile'] as const,
  mine: () => ['profile', 'me'] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_KEYS.mine(),
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: PROFILE_KEYS.mine() });
    },
  });
}
