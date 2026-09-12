export function OrgApplicationsKanbanSkeleton(): React.JSX.Element {
  return (
    <div className="flex flex-1 gap-3 overflow-x-auto px-6 pb-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex w-64 shrink-0 flex-col gap-2 rounded-xl border border-border bg-muted/40 p-3"
        >
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          {Array.from({ length: 2 }).map((_, j) => (
            <div key={j} className="h-16 animate-pulse rounded-lg border border-border bg-card" />
          ))}
        </div>
      ))}
    </div>
  );
}
