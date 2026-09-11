export function OrgJobEditSkeleton(): React.JSX.Element {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-xl border border-border bg-card p-6">
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-6 flex-1 animate-pulse rounded bg-muted" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
      ))}
      <div className="h-40 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
