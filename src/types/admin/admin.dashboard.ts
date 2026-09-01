export interface IAdminDashboardStats {
  users: {
    total: number;
    active: number;
    newThisWeek: number;
    userPrevWeek: number;
  };
  organizations: {
    total: number;
    approved: number;
    pendingApproval: number;
    newThisWeek: number;
    orgsPrevWeek: number;
  };
  jobs: {
    total: number;
    published: number;
    draft: number;
    closed: number;
    newJobThisMonth: number;
    newJobPrevMonth: number;
  };
  applications: {
    total: number;
    hired: number;
  };
  revenue: {
    mrrCents: number;
    previousMrrCents: number;
    activeBasic: number;
    activePremium: number;
  };
  incentives: {
    totalPendingCents: number;
    totalPendingCount: number;
    totalOverdueCount: number;
    totalCollectedCents: number;
  };
}

export type ChartRange = '30d' | '2m' | '3m' | '6m' | '1y' | '2y' | '3y' | '5y';
export type RevenueTrendRange = '7w' | ChartRange;

export interface IRegistrationBucket {
  label: string;
  startDate: string;
  endDate: string;
  users: number;
  orgs: number;
}

export interface IRegistrationChartData {
  range: ChartRange;
  buckets: IRegistrationBucket[];
}

export interface IRevenueTrendBucket {
  label: string;
  startDate: string;
  endDate: string;
  subscriptionRevenueCents: number;
  incentiveRevenueCents: number;
  totalRevenueCents: number;
}

export interface IRevenueTrendData {
  range: RevenueTrendRange;
  buckets: IRevenueTrendBucket[];
}

export type PlanKey = 'FREE' | 'BASIC' | 'PREMIUM';

export interface IRevenueByPlanItem {
  plan: PlanKey;
  amountCents: number;
}

export interface IRevenueByPlanData {
  range: ChartRange;
  totalCents: number;
  breakdown: IRevenueByPlanItem[];
}
