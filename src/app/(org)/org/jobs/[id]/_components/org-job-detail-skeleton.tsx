export function OrgJobDetailSkeleton(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />

      <div className="animate-pulse rounded-xl border border-border bg-card p-5">
        <div className="h-5 w-64 rounded bg-muted" />
        <div className="mt-3 flex gap-3">
          <div className="h-3 w-16 rounded bg-muted" />
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-3 w-16 rounded bg-muted" />
        </div>
        <div className="mt-4 h-5 w-40 rounded bg-muted" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-card" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl border border-border bg-card" />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-48 animate-pulse rounded-xl border border-border bg-card" />
        </div>
      </div>
    </div>
  );
}
