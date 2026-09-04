export interface IAdminOrgListItem {
  id: string;
  email: string;
  isApproved: boolean;
  isActive: boolean;
  isEmailVerified: boolean;
  isPaymentMethodOnFile: boolean;
  hasUnpaidIncentives: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  profile: {
    companyName: string;
    industry: string | null;
    companySize: string | null;
    location: string | null;
    country: string | null;
  } | null;
  _count: {
    jobs: number;
  };
  // Count of applications with status HIRED across all of this org's jobs
  hiredCount: number;
  // Currently-unpaid incentives (PENDING + OVERDUE + DISPUTED), aggregated
  incentives: {
    unpaidAmountCents: number;
    unpaidCount: number;
  };
}
