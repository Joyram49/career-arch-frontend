'use client';

import type { IOrgIncentiveStats } from '@app-types/org/org.incentives';

import { OrgStatCard } from '../../_components/shared';

function StatsSkeleton(): React.JSX.Element {
  return (
    <div className="grid grid-cols-4 gap-4 px-6 pt-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-4">
          <div className="h-2.5 w-20 rounded bg-muted" />
          <div className="mt-2.5 h-7 w-16 rounded bg-muted" />
          <div className="mt-2 h-2.5 w-24 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

interface OrgIncentivesStatsProps {
  stats: IOrgIncentiveStats | undefined;
  isLoading: boolean;
}

export function OrgIncentivesStats({
  stats,
  isLoading,
}: OrgIncentivesStatsProps): React.JSX.Element | null {
  if (isLoading) return <StatsSkeleton />;
  if (!stats) return null;

  return (
    <div className="grid grid-cols-4 gap-4 px-6 pt-4">
      <OrgStatCard
        label="Pending"
        value={`$${stats.pendingAmount.toFixed(2)}`}
        trend={{ value: `${stats.totalPending} awaiting payment`, direction: 'neutral' }}
        icon="ti-coin"
        accent="amber"
      />
      <OrgStatCard
        label="Overdue"
        value={`$${stats.overdueAmount.toFixed(2)}`}
        trend={{
          value: `${stats.totalOverdue} past due`,
          direction: stats.totalOverdue > 0 ? 'down' : 'neutral',
        }}
        icon="ti-alert-triangle"
        accent="red"
      />
      <OrgStatCard
        label="Disputed"
        value={stats.totalDisputed}
        trend={{ value: 'awaiting admin review', direction: 'neutral' }}
        icon="ti-message-report"
        accent="purple"
      />
      <OrgStatCard
        label="Total Paid"
        value={`$${stats.paidAmount.toFixed(2)}`}
        trend={{ value: `${stats.totalPaid} payments made`, direction: 'up' }}
        icon="ti-check"
        accent="emerald"
      />
    </div>
  );
}
