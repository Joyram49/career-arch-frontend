import type { IOrgApplicationListItem } from '@app-types/org/org.applications';

import { KANBAN_COLUMNS } from './application-status-flow';
import { OrgApplicationsKanbanColumn } from './org-applications-kanban-column';

interface OrgApplicationsKanbanBoardProps {
  applications: IOrgApplicationListItem[];
  onCardClick: (id: string) => void;
  showJobTitle: boolean;
}

export function OrgApplicationsKanbanBoard({
  applications,
  onCardClick,
  showJobTitle,
}: OrgApplicationsKanbanBoardProps): React.JSX.Element {
  return (
    <div className="flex flex-1 gap-3 overflow-x-auto px-6 pb-6">
      {KANBAN_COLUMNS.map((col) => (
        <OrgApplicationsKanbanColumn
          key={col.status}
          label={col.label}
          applications={applications.filter((a) => a.status === col.status)}
          onCardClick={onCardClick}
          showJobTitle={showJobTitle}
        />
      ))}
    </div>
  );
}
