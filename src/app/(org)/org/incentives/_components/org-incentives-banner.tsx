import type { IOrgIncentiveStats } from '@app-types/org/org.incentives';

interface OrgIncentivesBannerProps {
  stats: IOrgIncentiveStats | undefined;
}

export function OrgIncentivesBanner({ stats }: OrgIncentivesBannerProps): React.JSX.Element | null {
  const pendingCount = stats?.totalPending ?? 0;
  const overdueCount = stats?.totalOverdue ?? 0;
  const totalDue = pendingCount + overdueCount;
  if (totalDue === 0) return null;

  return (
    <div className="mx-6 mt-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <i className="ti ti-alert-triangle shrink-0 text-base" aria-hidden="true" />
      <p>
        You have <strong>{totalDue}</strong> pending incentive payment{totalDue > 1 ? 's' : ''}
        {overdueCount > 0 && (
          <>
            {' '}
            — <strong>{overdueCount}</strong> overdue
          </>
        )}
        .
      </p>
    </div>
  );
}
