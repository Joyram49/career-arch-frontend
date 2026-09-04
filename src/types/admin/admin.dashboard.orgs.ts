// src/types/admin/admin.dashboard.organizations.ts

export interface IAdminOrgProfile {
  companyName: string;
  industry: string | null;
  companySize: string | null;
  location: string | null;
  country: string | null;
}

export interface IAdminOrgIncentives {
  unpaidAmountCents: number;
  unpaidCount: number;
}

export interface IAdminOrgListItem {
  id: string;
  email: string;
  isApproved: boolean;
  isActive: boolean;
  isEmailVerified: boolean;
  isPaymentMethodOnFile: boolean;
  hasUnpaidIncentives: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  profile: IAdminOrgProfile | null;
  _count: {
    jobs: number;
  };
  hiredCount: number;
  incentives: IAdminOrgIncentives;
}

export interface IAdminOrganizationsFilters {
  page: number;
  limit: number;
  search?: string;
  location?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  isApproved?: boolean;
  isPaymentMethodOnFile?: boolean;
  hasUnpaidIncentives?: boolean;
  sortBy?: 'createdAt' | 'email' | 'lastLoginAt' | 'foundedYear';
  sortOrder?: 'asc' | 'desc';
}
