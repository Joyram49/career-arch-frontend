import { Skeleton } from '@components/ui/skeleton';

export default function LoginOrgLoading(): React.JSX.Element {
  return (
    <main className="flex min-h-screen bg-background">
      <div className="hidden bg-brand-navy/95 lg:block lg:w-[55%]" />
      <div className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-8 md:px-12 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-md space-y-6">
          {/* Badge skeleton */}
          <Skeleton className="h-6 w-40 rounded-full" />
          {/* Heading */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-52" />
            <Skeleton className="h-4 w-72" />
          </div>
          {/* Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          {/* Sign in link */}
          <Skeleton className="mx-auto h-4 w-56" />
        </div>
      </div>
    </main>
  );
}
