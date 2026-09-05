import type { PlanName } from '@app-types/auth';

export type SubscriptionStatusName = 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'PAST_DUE';

export interface IAdminSubscriptionListItem {
  id: string;
  plan: PlanName;
  status: SubscriptionStatusName;
  amountCents: number;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  applyCountThisMonth: number;
  applyCountResetAt: string | null;
  savedJobCount: number;
  updatedAt: string | null;
  createdAt: string | null;
  user: {
    id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
    } | null;
  } | null;
}

export interface IAdminSubscriptionsFilters {
  page: number;
  limit: number;
  plan?: PlanName;
  status?: SubscriptionStatusName;
  search?: string;
}

// ── Stats (KPI cards) ────────────────────────────────────────────────────
export interface IAdminSubscriptionStats {
  totalActive: number;
  byPlan: {
    FREE: number;
    BASIC: number;
    PREMIUM: number;
  };
  mrrCents: number;
  pastDue: number;
  cancellingAtPeriodEnd: number;
}
