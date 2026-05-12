'use client';

import type { IAdmin, IOrganization, IUser, PlanName, UserRole } from '@app-types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthUser = IUser | IOrganization | IAdmin;

interface IAuthState {
  /* ── State ── */
  user: AuthUser | null;
  role: UserRole | null;
  plan: PlanName | null; // Only relevant for USER role
  isAuthenticated: boolean;
  isHydrated: boolean;

  /* ── Actions ── */
  setUser: (user: AuthUser, role: UserRole, plan?: PlanName) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  setPlan: (plan: PlanName) => void;
  clearAuth: () => void;
  setHydrated: () => void;

  /* ── Derived helpers ── */
  isUser: () => boolean;
  isOrg: () => boolean;
  isAdmin: () => boolean;
  getUser: () => IUser | null;
  getOrg: () => IOrganization | null;
  getAdmin: () => IAdmin | null;
}

export const useAuthStore = create<IAuthState>()(
  persist(
    (set, get) => ({
      /* ── Initial state ── */
      user: null,
      role: null,
      plan: null,
      isAuthenticated: false,
      isHydrated: false,

      /* ── Actions ── */
      setUser: (user, role, plan) =>
        set({
          user,
          role,
          plan: plan ?? null,
          isAuthenticated: true,
        }),

      updateUser: (updates) =>
        set((state) => {
          if (!state.user) return { user: null };

          return {
            user: {
              ...state.user,
              ...updates,
            } as AuthUser,
          };
        }),

      setPlan: (plan) => set({ plan }),

      clearAuth: () =>
        set({
          user: null,
          role: null,
          plan: null,
          isAuthenticated: false,
        }),

      setHydrated: () => set({ isHydrated: true }),

      /* ── Derived helpers ── */
      isUser: () => get().role === 'USER',
      isOrg: () => get().role === 'ORGANIZATION',
      isAdmin: () => get().role === 'ADMIN',

      getUser: () => {
        const { user, role } = get();
        return role === 'USER' ? (user as IUser) : null;
      },

      getOrg: () => {
        const { user, role } = get();
        return role === 'ORGANIZATION' ? (user as IOrganization) : null;
      },

      getAdmin: () => {
        const { user, role } = get();
        return role === 'ADMIN' ? (user as IAdmin) : null;
      },
    }),
    {
      name: 'careerarch-auth',
      /*
       * IMPORTANT: Only persist role and plan — never user object with sensitive data.
       * The actual user object is re-fetched on mount via /auth/*_/me.
       * Tokens live in HttpOnly cookies — never in localStorage.
       */
      partialize: (state) => ({
        role: state.role,
        plan: state.plan,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
