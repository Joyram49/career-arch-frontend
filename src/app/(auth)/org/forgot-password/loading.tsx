import { Skeleton } from '@components/ui/skeleton';

export default function ForgotPasswordOrgLoading(): React.JSX.Element {
  return (
    <main className="flex min-h-screen bg-background">
      <div className="hidden bg-brand-navy/95 lg:block lg:w-[55%]" />
      <div className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-8 md:px-12 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-md space-y-6">
          <Skeleton className="h-4 w-28" />
          <div className="flex justify-center">
            <Skeleton className="size-16 rounded-2xl" />
          </div>
          <div className="space-y-3 text-center">
            <Skeleton className="mx-auto h-9 w-64" />
            <Skeleton className="mx-auto h-4 w-72" />
            <Skeleton className="mx-auto h-4 w-56" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}
