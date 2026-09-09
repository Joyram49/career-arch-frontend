export function OrgJobsListSkeleton({ count = 6 }: { count?: number }): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-3 px-6 lg:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-40 rounded bg-muted" />
            <div className="h-4 w-14 rounded bg-muted" />
          </div>
          <div className="mt-2 flex gap-3">
            <div className="h-3 w-16 rounded bg-muted" />
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <div className="h-3 w-32 rounded bg-muted" />
            <div className="h-7 w-24 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
