export function OrgProfileSkeleton(): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[320px_1fr]">
      <div className="h-80 animate-pulse rounded-2xl border border-border bg-card" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
        ))}
        <div className="h-32 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}
