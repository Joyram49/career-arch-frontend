import { cn } from '@lib/utils';

interface OrgApplicationsViewToggleProps {
  view: 'kanban' | 'list';
  onChange: (view: 'kanban' | 'list') => void;
}

export function OrgApplicationsViewToggle({
  view,
  onChange,
}: OrgApplicationsViewToggleProps): React.JSX.Element {
  return (
    <div className="flex items-center rounded-lg border border-border bg-muted p-0.5">
      <button
        type="button"
        onClick={() => onChange('kanban')}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
          view === 'kanban' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
        )}
      >
        <i className="ti ti-layout-kanban text-sm" aria-hidden="true" />
        Board
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
          view === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
        )}
      >
        <i className="ti ti-list text-sm" aria-hidden="true" />
        List
      </button>
    </div>
  );
}
