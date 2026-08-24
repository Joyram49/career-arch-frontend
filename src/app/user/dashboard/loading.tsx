import { Skeleton } from '@ui/skeleton';

export default function DashboardLoading(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner skeleton */}
      <Skeleton className="h-32 w-full rounded-2xl" />
      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      {/* Pipeline skeleton */}
      <Skeleton className="h-56 w-full rounded-2xl" />
      {/* Bottom grid skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}
