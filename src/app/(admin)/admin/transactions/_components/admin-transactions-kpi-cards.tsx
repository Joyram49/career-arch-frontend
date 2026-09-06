'use client';

import { type IAdminTransactionStats } from '@app-types/admin/admin.dashboard.transactions';
import { AdminStatCard } from '../../_components/shared';
import { formatCents } from './admin-transactions-utils';

interface AdminTransactionsKpiCardsProps {
  stats: IAdminTransactionStats | undefined;
  isLoading: boolean;
}

export function AdminTransactionsKpiCards({
  stats,
  isLoading,
}: AdminTransactionsKpiCardsProps): React.JSX.Element {
  const monthDelta =
    stats && stats.previousMonthRevenueCents > 0
      ? ((stats.monthlyRevenueCents - stats.previousMonthRevenueCents) /
          stats.previousMonthRevenueCents) *
        100
      : null;

  return (
    <div className="grid grid-cols-2 gap-4 border-b border-border bg-muted/30 px-6 py-4 lg:grid-cols-5">
      <AdminStatCard
        label="This Month"
        value={isLoading ? '—' : formatCents(stats?.monthlyRevenueCents ?? 0)}
        trend={
          monthDelta !== null
            ? {
                value: `${Math.abs(monthDelta).toFixed(1)}% vs last month`,
                direction: monthDelta >= 0 ? 'up' : 'down',
              }
            : undefined
        }
        icon="ti-trending-up"
        accent="emerald"
      />
      <AdminStatCard
        label="Today"
        value={isLoading ? '—' : formatCents(stats?.todayRevenueCents ?? 0)}
        trend={{ value: `${stats?.todayTransactionCount ?? 0} transactions`, direction: 'neutral' }}
        icon="ti-calendar"
        accent="sky"
      />
      <AdminStatCard
        label="Subscriptions / Incentives"
        value={
          isLoading
            ? '—'
            : `${formatCents(stats?.revenueBySourceThisMonth.subscriptionCents ?? 0)} / ${formatCents(
                stats?.revenueBySourceThisMonth.incentiveCents ?? 0,
              )}`
        }
        trend={{ value: 'this month', direction: 'neutral' }}
        icon="ti-chart-pie"
        accent="purple"
      />
      <AdminStatCard
        label="Refunded"
        value={isLoading ? '—' : formatCents(stats?.totalRefundedCents ?? 0)}
        trend={{ value: `${stats?.totalRefundedCount ?? 0} refunds`, direction: 'neutral' }}
        icon="ti-arrow-back-up"
        accent="slate"
      />
      <AdminStatCard
        label="Failed Payments"
        value={isLoading ? '—' : (stats?.totalFailedCount ?? 0)}
        trend={{
          value: formatCents(stats?.totalFailedCents ?? 0),
          direction: (stats?.totalFailedCount ?? 0) > 0 ? 'down' : 'neutral',
        }}
        icon="ti-alert-circle"
        accent="red"
      />
    </div>
  );
}
