'use client';

import { useAdminIncentiveStats } from '@queries/admin/use-admin-incentive-stats';
import { AdminStatCard } from '../../_components/shared';

function StatsSkeleton(): React.JSX.Element {
  return (
    <div className="grid grid-cols-4 gap-4 border-b border-border bg-muted/30 px-6 py-4">
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

function StatsErrorState({ onRetry }: { onRetry: () => void }): React.JSX.Element {
  return (
    <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-3">
      <span className="text-xs text-muted-foreground">Couldn&apos;t load incentive stats.</span>
      <button
        type="button"
        onClick={onRetry}
        className="text-xs font-medium text-brand-sky underline"
      >
        Retry
      </button>
    </div>
  );
}

export function AdminIncentivesStats(): React.JSX.Element | null {
  const { data: stats, isLoading, isError, refetch } = useAdminIncentiveStats();

  if (isLoading) return <StatsSkeleton />;
  if (isError) return <StatsErrorState onRetry={refetch} />;
  if (!stats) return null;

  const pendingDisplay = `$${(stats.pendingValueCents / 100).toFixed(2)}`;
  const overdueDisplay = `$${(stats.overdueValueCents / 100).toFixed(2)}`;
  const collectedDisplay = `$${(stats.totalCollectedCents / 100).toFixed(2)}`;

  return (
    <div className="grid grid-cols-4 gap-4 border-b border-border bg-muted/30 px-6 py-4">
      <AdminStatCard
        label="Pending Total"
        value={pendingDisplay}
        trend={{ value: `${stats.totalPending} awaiting payment`, direction: 'neutral' }}
        icon="ti-coin"
        accent="amber"
      />
      <AdminStatCard
        label="Overdue Total"
        value={overdueDisplay}
        trend={{
          value: `${stats.totalOverdue} past due`,
          direction: stats.totalOverdue > 0 ? 'down' : 'neutral',
        }}
        icon="ti-alert-triangle"
        accent="red"
      />
      <AdminStatCard
        label="Disputed"
        value={stats.totalDisputed}
        trend={{ value: 'need resolution', direction: 'neutral' }}
        icon="ti-message-report"
        accent="purple"
      />
      <AdminStatCard
        label="Total Collected"
        value={collectedDisplay}
        trend={{ value: `${stats.totalPaid} paid • ${stats.totalWaived} waived`, direction: 'up' }}
        icon="ti-check"
        accent="emerald"
      />
    </div>
  );
}
