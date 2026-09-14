'use client';

import { useOrgDashboardStats } from '@queries/org/use-org-dashboard';
import { OrgStatCard } from '../../_components/shared';

function StatsSkeleton(): React.JSX.Element {
  return (
    <div className="grid grid-cols-4 gap-4 px-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-4">
          <div className="h-2.5 w-24 rounded bg-muted" />
          <div className="mt-2.5 h-7 w-16 rounded bg-muted" />
          <div className="mt-2 h-2.5 w-28 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function StatsErrorState({ onRetry }: { onRetry: () => void }): React.JSX.Element {
  return (
    <div className="mx-6 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
      <span className="text-xs text-muted-foreground">Couldn&apos;t load dashboard stats.</span>
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

export function OrgDashboardStats(): React.JSX.Element | null {
  const { data: stats, isLoading, isError, refetch } = useOrgDashboardStats();

  if (isLoading) return <StatsSkeleton />;
  if (isError) return <StatsErrorState onRetry={refetch} />;
  if (!stats) return null;

  const pendingIncentiveDisplay = `$${(stats.pendingIncentiveAmount / 100).toFixed(2)} due`;

  return (
    <div className="grid grid-cols-4 gap-4 px-6">
      <OrgStatCard
        label="Active Job Listings"
        value={stats.activeJobListings}
        trend={{ value: `${stats.jobsExpiringSoon} expiring soon`, direction: 'neutral' }}
        icon="ti-briefcase"
        accent="sky"
      />
      <OrgStatCard
        label="Total Applications"
        value={stats.totalApplications}
        trend={{ value: `+${stats.newApplicationsThisWeek} this week`, direction: 'up' }}
        icon="ti-file-text"
        accent="purple"
      />
      <OrgStatCard
        label="Interviews Scheduled"
        value={stats.interviewsScheduled}
        trend={{ value: `${stats.interviewsThisWeek} this week`, direction: 'neutral' }}
        icon="ti-calendar-event"
        accent="amber"
      />
      <OrgStatCard
        label="Successful Hires"
        value={stats.successfulHires}
        trend={{
          value:
            stats.pendingIncentiveCount > 0 ? pendingIncentiveDisplay : 'all incentives settled',
          direction: stats.pendingIncentiveCount > 0 ? 'down' : 'up',
        }}
        icon="ti-award"
        accent="emerald"
      />
    </div>
  );
}
