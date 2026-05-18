import { Skeleton } from '@components/ui/skeleton';

export default function RegisterOrgLoading() {
  return (
    <main className="flex min-h-screen bg-background">
      <div className="hidden bg-brand-navy/95 lg:block lg:w-[55%]" />
      <div className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-8 md:px-12 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
