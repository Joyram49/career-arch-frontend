'use client';

import { formatDistanceToNow } from 'date-fns';

import type { IOrgApplicationListItem } from '@app-types/org/org.applications';

interface OrgApplicationKanbanCardProps {
  application: IOrgApplicationListItem;
  onClick: () => void;
  showJobTitle: boolean;
}

export function OrgApplicationKanbanCard({
  application,
  onClick,
  showJobTitle,
}: OrgApplicationKanbanCardProps): React.JSX.Element {
  const initials = application.candidateName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border border-border bg-card p-3 text-left shadow-sm transition-shadow hover:shadow-card"
    >
      <div className="flex items-center gap-2">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-sky/15 text-[10px] font-bold text-brand-sky">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-foreground">
            {application.candidateName}
          </p>
          {showJobTitle && (
            <p className="truncate text-[10px] text-muted-foreground">{application.jobTitle}</p>
          )}
        </div>
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">
        Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
      </p>
    </button>
  );
}
