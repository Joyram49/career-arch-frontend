import { Skeleton } from '@components/ui/skeleton';

export default function ForgotPasswordLoading() {
  return (
    <main className="flex min-h-screen bg-background">
      {/* Left panel skeleton */}
      <div className="hidden bg-brand-navy/95 lg:block lg:w-[55%]" />

      {/* Right panel skeleton */}
      <div className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-8 md:px-12 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-md space-y-6">
          {/* Back link */}
          <Skeleton className="h-4 w-28" />

          {/* Icon badge */}
          <div className="flex justify-center">
            <Skeleton className="size-16 rounded-2xl" />
          </div>

          {/* Heading + subtitle */}
          <div className="space-y-3 text-center">
            <Skeleton className="mx-auto h-9 w-64" />
            <Skeleton className="mx-auto h-4 w-72" />
            <Skeleton className="mx-auto h-4 w-56" />
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>

          {/* Submit button */}
          <Skeleton className="h-12 w-full rounded-xl" />

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="size-1 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    </main>
  );
}
