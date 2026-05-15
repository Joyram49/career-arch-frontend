import { Skeleton } from '@components/ui/skeleton';

export default function ResetPasswordLoading() {
  return (
    <main className="flex min-h-screen bg-background">
      {/* Left panel skeleton */}
      <div className="hidden bg-[#0d1117] lg:block lg:w-[55%]" />

      {/* Right panel skeleton */}
      <div className="flex flex-1 flex-col justify-between px-5 py-8 sm:px-8 md:px-12 lg:px-14 xl:px-20">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center space-y-6">
          {/* Heading */}
          <div className="space-y-2">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* New password field */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-11 w-full rounded-xl" />
            {/* Strength bar */}
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-3 w-36" />
          </div>

          {/* Confirm password field */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>

          {/* Requirements card */}
          <div className="space-y-3 rounded-xl border border-border p-4">
            <Skeleton className="h-3 w-44" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="size-5 shrink-0 rounded-full" />
                <Skeleton className="h-3 w-48" />
              </div>
            ))}
          </div>

          {/* Button */}
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="mx-auto h-4 w-32" />
        </div>
      </div>
    </main>
  );
}
