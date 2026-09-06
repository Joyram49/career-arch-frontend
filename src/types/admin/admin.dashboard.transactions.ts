export type TxType = 'SUBSCRIPTION' | 'REFUND' | 'INCENTIVE' | 'OTHER';
export type TxStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';

export interface IAdminTransactionPartyUser {
  id: string;
  email: string;
  name: string | null;
}

export interface IAdminTransactionPartyOrg {
  id: string;
  email: string;
  companyName: string | null;
}

export interface IAdminTransactionSubscriptionInfo {
  id: string;
  plan: 'FREE' | 'BASIC' | 'PREMIUM';
  // Schema is monthly-only today — see backend admin.transactions.service.ts note
  billingCycle: 'MONTHLY';
}

export interface IAdminTransactionListItem {
  id: string;
  type: TxType;
  status: TxStatus;
  amountCents: number;
  currency: string;
  description: string | null;
  stripePaymentIntentId: string | null;
  stripeInvoiceId: string | null;
  stripeRefundId: string | null;
  stripeChargeId: string | null;
  isRefunded: boolean;
  isFailed: boolean;
  createdAt: string;
  updatedAt: string;
  user: IAdminTransactionPartyUser | null;
  organization: IAdminTransactionPartyOrg | null;
  subscription: IAdminTransactionSubscriptionInfo | null;
}

export interface IAdminTransactionDetail extends IAdminTransactionListItem {
  metaData: Record<string, unknown> | null;
}

export interface IAdminTransactionsFilters {
  page: number;
  limit: number;
  search?: string;
  type?: TxType;
  status?: TxStatus;
  sortBy?: 'createdAt' | 'amount';
  sortOrder?: 'asc' | 'desc';
}

export interface IAdminTransactionStats {
  monthlyRevenueCents: number;
  previousMonthRevenueCents: number;
  monthlyTransactionCount: number;
  todayRevenueCents: number;
  todayTransactionCount: number;
  totalRefundedCents: number;
  totalRefundedCount: number;
  totalFailedCents: number;
  totalFailedCount: number;
  totalPendingCents: number;
  totalPendingCount: number;
  revenueBySourceThisMonth: {
    subscriptionCents: number;
    incentiveCents: number;
  };
}

export type TransactionsChartRange = '7w' | '30d' | '2m' | '3m' | '6m' | '1y' | '2y' | '3y' | '5y';

export interface IRevenueTimelineBucket {
  label: string;
  startDate: string;
  endDate: string;
  subscriptionRevenueCents: number;
  incentiveRevenueCents: number;
  refundedCents: number;
  netRevenueCents: number;
}

export interface IRevenueTimelineData {
  range: TransactionsChartRange;
  buckets: IRevenueTimelineBucket[];
}
