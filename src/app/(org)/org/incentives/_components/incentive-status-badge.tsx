import { cn } from '@lib/utils';

import type { IncentiveStatus } from '@app-types/org/org.incentives';

const STATUS_STYLES: Record<IncentiveStatus, string> = {
  PENDING: 'bg-amber-500/10 text-amber-700 border-amber-200',
  PAID: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  OVERDUE: 'bg-red-500/10 text-red-700 border-red-200',
  DISPUTED: 'bg-amber-500/10 text-amber-700 border-amber-200',
  WAIVED: 'bg-slate-500/10 text-slate-500 border-slate-200',
};

interface IncentiveStatusBadgeProps {
  status: IncentiveStatus;
  className?: string;
}

export function IncentiveStatusBadge({
  status,
  className,
}: IncentiveStatusBadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
        STATUS_STYLES[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
