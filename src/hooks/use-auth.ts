'use client';

import type { IMeResponse } from '@app-types/auth';
import { client } from '@lib/axios';
import { type IAuthState, useAuthStore } from '@lib/store/auth.store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

/* ─────────────────────────────────────────────
   useAuth — primary auth hook
   Reads from Zustand store + re-fetches /me
   to keep user data fresh after page reload.
   ──────────────────────────────────────────── */
export function useAuth(): {
  user: IAuthState['user'];
  role: IAuthState['role'];
  plan: IAuthState['plan'];
  isAuthenticated: IAuthState['isAuthenticated'];
  isHydrated: IAuthState['isHydrated'];
  isUser: ReturnType<IAuthState['isUser']>;
  isOrg: ReturnType<IAuthState['isOrg']>;
  isAdmin: ReturnType<IAuthState['isAdmin']>;
  currentUser: ReturnType<IAuthState['getUser']>;
  currentOrg: ReturnType<IAuthState['getOrg']>;
  currentAdmin: ReturnType<IAuthState['getAdmin']>;
} {
  const {
    user,
    role,
    plan,
    isAuthenticated,
    isHydrated,
    setUser,
    clearAuth,
    isUser,
    isOrg,
    isAdmin,
    getUser,
    getOrg,
    getAdmin,
  } = useAuthStore();

  const { data, isError } = useQuery({
    queryKey: ['auth', 'me', role],
    queryFn: async (): Promise<IMeResponse> => {
      const endpoint =
        role === 'ORGANIZATION'
          ? '/auth/org/me'
          : role === 'ADMIN'
            ? '/auth/admin/me'
            : '/auth/user/me';

      const response = await client.get<{ data: IMeResponse }>(endpoint);
      return response.data?.data ?? response.data ?? {};
    },
    enabled: isAuthenticated && isHydrated && role !== null,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  useEffect(() => {
    if (!data || role === null) return;

    if (role === 'USER' && data.user !== undefined) {
      const fetchedUser = data.user;
      const userPlan = fetchedUser.subscription?.plan ?? 'FREE';
      setUser(fetchedUser, 'USER', userPlan);
      return;
    }

    if (role === 'ORGANIZATION' && data.organization !== undefined) {
      setUser(data.organization, 'ORGANIZATION');
      return;
    }

    if (role === 'ADMIN' && data.admin !== undefined) {
      setUser(data.admin, 'ADMIN');
    }
  }, [data, role, setUser]);

  useEffect(() => {
    if (isError && isAuthenticated) {
      clearAuth();
    }
  }, [isError, isAuthenticated, clearAuth]);

  return {
    user,
    role,
    plan,
    isAuthenticated,
    isHydrated,
    isUser: isUser(),
    isOrg: isOrg(),
    isAdmin: isAdmin(),
    currentUser: role === 'USER' ? (getUser() ?? data?.user ?? null) : null,
    currentOrg: role === 'ORGANIZATION' ? (getOrg() ?? data?.organization ?? null) : null,
    currentAdmin: role === 'ADMIN' ? (getAdmin() ?? data?.admin ?? null) : null,
  };
}
