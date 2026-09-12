import type { IOrgApplicationListItem } from '@app-types/org/org.applications';

import { OrgApplicationKanbanCard } from './org-application-kanban-card';

interface OrgApplicationsKanbanColumnProps {
  label: string;
  applications: IOrgApplicationListItem[];
  onCardClick: (id: string) => void;
  showJobTitle: boolean;
}

export function OrgApplicationsKanbanColumn({
  label,
  applications,
  onCardClick,
  showJobTitle,
}: OrgApplicationsKanbanColumnProps): React.JSX.Element {
  return (
    <div className="flex w-64 shrink-0 flex-col rounded-xl border border-border bg-muted/40 p-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold text-foreground">{label}</h3>
        <span className="flex size-5 items-center justify-center rounded-full bg-card text-[10px] font-bold text-foreground shadow-sm">
          {applications.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {applications.length === 0 ? (
          <p className="px-1 py-6 text-center text-[11px] text-muted-foreground">No candidates</p>
        ) : (
          applications.map((a) => (
            <OrgApplicationKanbanCard
              key={a.id}
              application={a}
              onClick={() => onCardClick(a.id)}
              showJobTitle={showJobTitle}
            />
          ))
        )}
      </div>
    </div>
  );
}
