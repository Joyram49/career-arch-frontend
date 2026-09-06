export type IncentiveStatusName = 'PENDING' | 'PAID' | 'WAIVED' | 'DISPUTED' | 'OVERDUE';

// ─────────────────────────────────────────────
// LIST ITEM
// ─────────────────────────────────────────────
// Mirrors backend `IIncentiveResponse` (src/modules/incentives/types/index.ts).
// `amount` is a plain dollar value (e.g. 50), NOT cents — only the stats
// endpoint below reports in cents (mirrors backend INCENTIVE.AMOUNT_CENTS).
export interface IAdminIncentiveListItem {
  id: string;
  orgId: string;
  jobId: string;
  applicationId: string;
  amount: number;
  currency: string;
  status: IncentiveStatusName;
  dueAt: string | null;
  paidAt: string | null;
  // Proxy for "hire date" — see backend comment in incentives/types/index.ts.
  hiredAt: string | null;
  stripePaymentIntentId: string | null;
  createdAt: string;
  updatedAt: string;
  organization: {
    id: string;
    companyName: string;
  } | null;
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  job: {
    title: string;
    slug: string;
  } | null;
}

// ─────────────────────────────────────────────
// FILTERS
// ─────────────────────────────────────────────
export interface IAdminIncentivesFilters {
  page?: number;
  limit?: number;
  status?: IncentiveStatusName;
  orgId?: string;
  // Free-text search — matches org (company) name or candidate first/last name/email.
  search?: string;
  sortBy?: 'createdAt' | 'dueAt' | 'paidAt';
  sortOrder?: 'asc' | 'desc';
}

// ─────────────────────────────────────────────
// STATS (KPI cards)
// ─────────────────────────────────────────────
// Mirrors backend `IIncentiveStats` (src/modules/incentives/types/index.ts).
export interface IAdminIncentiveStats {
  totalCollectedCents: number;
  totalPending: number;
  pendingValueCents: number;
  totalOverdue: number;
  overdueValueCents: number;
  totalDisputed: number;
  totalWaived: number;
  totalPaid: number;
}
