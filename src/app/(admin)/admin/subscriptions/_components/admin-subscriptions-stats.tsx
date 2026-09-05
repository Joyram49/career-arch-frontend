'use client';

import { useAdminSubscriptionStats } from '@queries/admin/use-admin-subscription-stats';
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
      <span className="text-xs text-muted-foreground">Couldn&apos;t load subscription stats.</span>
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

export function AdminSubscriptionsStats(): React.JSX.Element | null {
  const { data: stats, isLoading, isError, refetch } = useAdminSubscriptionStats();

  if (isLoading) return <StatsSkeleton />;
  if (isError) return <StatsErrorState onRetry={refetch} />;
  if (!stats) return null;

  const mrrDisplay = `$${(stats.mrrCents / 100).toFixed(2)}`;

  return (
    <div className="grid grid-cols-4 gap-4 border-b border-border bg-muted/30 px-6 py-4">
      <AdminStatCard
        label="Active Subs"
        value={stats.totalActive}
        trend={{ value: 'all plans', direction: 'neutral' }}
        icon="ti-users"
        accent="sky"
      />
      <AdminStatCard
        label="Basic Active"
        value={stats.byPlan.BASIC}
        icon="ti-credit-card"
        accent="sky"
      />
      <AdminStatCard
        label="Premium Active"
        value={stats.byPlan.PREMIUM}
        icon="ti-star"
        accent="amber"
      />
      <AdminStatCard
        label="Total MRR"
        value={mrrDisplay}
        trend={{
          value: stats.pastDue > 0 ? `${stats.pastDue} past due` : 'all paid',
          direction: stats.pastDue > 0 ? 'down' : 'up',
        }}
        icon="ti-trending-up"
        accent="emerald"
      />
    </div>
  );
}
