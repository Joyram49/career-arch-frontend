import { Skeleton } from '@components/ui/skeleton';

export default function LoginLoading() {
  return (
    <main className="flex min-h-screen bg-background">
      {/* Left panel skeleton */}
      <div className="hidden bg-brand-navy/95 lg:block lg:w-[55%]" />

      {/* Right panel skeleton */}
      <div className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-8 md:px-12 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-11 flex-1 rounded-xl" />
            <Skeleton className="h-11 flex-1 rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
