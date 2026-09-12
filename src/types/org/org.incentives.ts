// src/types/org/org.incentives.ts

export type IncentiveStatus = 'PENDING' | 'PAID' | 'WAIVED' | 'DISPUTED' | 'OVERDUE';

export interface IOrgIncentiveListItem {
  id: string;
  orgId: string;
  jobId: string;
  applicationId: string;
  amount: number; // dollars, e.g. 50 — matches backend's `amountDollars`, not cents
  currency: string;
  status: IncentiveStatus;
  dueAt: string | null;
  paidAt: string | null;
  hiredAt: string | null;
  stripePaymentIntentId: string | null;
  createdAt: string;
  updatedAt: string;
  candidate: { firstName: string; lastName: string; email: string } | null;
  job: { title: string; slug: string } | null;
}

export interface IOrgIncentivesFilters {
  status?: IncentiveStatus;
  page: number;
  limit: number;
  sortBy: 'createdAt' | 'dueAt' | 'paidAt';
  sortOrder: 'asc' | 'desc';
}

export interface IOrgIncentiveStats {
  totalPending: number;
  pendingAmount: number;
  totalOverdue: number;
  overdueAmount: number;
  totalDisputed: number;
  totalPaid: number;
  paidAmount: number;
}
