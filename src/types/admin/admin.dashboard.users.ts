export type AdminUserPlan = 'FREE' | 'BASIC' | 'PREMIUM';

export interface IAdminUserListItem {
  id: string;
  email: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null;
  subscription: {
    plan: AdminUserPlan;
  } | null;
  _count: {
    applications: number;
  };
}

export interface IAdminUsersFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  plan?: AdminUserPlan;
  sortBy?: 'createdAt' | 'email' | 'lastLoginAt';
  sortOrder?: 'asc' | 'desc';
}
