import { cn } from '@lib/utils';
import { Button } from '@ui/button';
import Link from 'next/link';

interface OrgQuickActionsProps {
  pendingIncentiveCount: number;
}

export function OrgQuickActions({
  pendingIncentiveCount,
}: OrgQuickActionsProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-3 px-6">
      <Button asChild className="bg-brand-sky text-white hover:bg-brand-sky/90">
        <Link href="/org/jobs/new">
          <i className="ti ti-plus mr-1.5" aria-hidden="true" />
          Post New Job
        </Link>
      </Button>

      <Button asChild variant="outline">
        <Link href="/org/applications">
          <i className="ti ti-inbox mr-1.5" aria-hidden="true" />
          View All Applications
        </Link>
      </Button>

      <Button
        asChild
        variant="outline"
        className={cn(
          pendingIncentiveCount > 0 &&
            'border-amber-300 text-amber-700 hover:border-amber-400 hover:bg-amber-50',
        )}
      >
        <Link href="/org/incentives">
          <i className="ti ti-coin mr-1.5" aria-hidden="true" />
          Pay Pending Incentives
          {pendingIncentiveCount > 0 && (
            <span className="ml-2 flex size-4.5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
              {pendingIncentiveCount}
            </span>
          )}
        </Link>
      </Button>
    </div>
  );
}
