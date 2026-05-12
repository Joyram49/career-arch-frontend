'use client';

import type { IMeResponse } from '@app-types/auth';
import { apiGet } from '@lib/axios';
import { useAuthStore } from '@lib/store/auth.store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

/* ─────────────────────────────────────────────
   useAuth — primary auth hook
   Reads from Zustand store + re-fetches /me
   to keep user data fresh after page reload.
   ──────────────────────────────────────────── */
export function useAuth() {
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

  /* Re-fetch /me on mount when we think we're authenticated.
     This refreshes the user object without requiring a re-login. */
  const { data, isError } = useQuery({
    queryKey: ['auth', 'me', role],
    queryFn: async (): Promise<{ data: IMeResponse }> => {
      const endpoint =
        role === 'ORGANIZATION'
          ? '/auth/org/me'
          : role === 'ADMIN'
            ? '/auth/admin/me'
            : '/auth/user/me';
      return apiGet<IMeResponse>(endpoint);
    },
    enabled: isAuthenticated && isHydrated,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  /* ── Sync fetched user back into store ── */
  useEffect(() => {
    if (data?.data === undefined || role === null) return;

    if (role === 'USER' && data.data.user !== undefined) {
      // TypeScript knows fetchedUser is IUser here — .subscription exists
      const fetchedUser = data.data.user;
      const userPlan = fetchedUser.subscription?.plan ?? 'FREE';
      setUser(fetchedUser, 'USER', userPlan);
      return;
    }

    if (role === 'ORGANIZATION' && data.data.organization !== undefined) {
      // TypeScript knows fetchedUser is IOrganization here
      setUser(data.data.organization, 'ORGANIZATION');
      return;
    }

    if (role === 'ADMIN' && data.data.admin !== undefined) {
      // TypeScript knows fetchedUser is IAdmin here
      setUser(data.data.admin, 'ADMIN');
    }
  }, [data, role, setUser]);

  /* If /me returns 401 even after refresh-token attempt, clear auth */
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
    currentUser: getUser(),
    currentOrg: getOrg(),
    currentAdmin: getAdmin(),
  };
}
