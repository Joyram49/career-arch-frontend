import { Skeleton } from '@ui/skeleton';

export default function AdminLoginLoading() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center"
      style={{ background: '#090e1a' }}
    >
      <div className="w-full max-w-[420px] px-4">
        {/* Card skeleton */}
        <div
          className="rounded-2xl border p-8 sm:p-10"
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            borderColor: 'rgba(51, 65, 85, 0.8)',
          }}
        >
          {/* Shield icon */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <Skeleton
              className="size-14 rounded-2xl"
              style={{ background: 'rgba(51,65,85,0.5)' }}
            />
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-3 w-24" style={{ background: 'rgba(51,65,85,0.5)' }} />
              <Skeleton className="h-7 w-40" style={{ background: 'rgba(51,65,85,0.5)' }} />
              <Skeleton className="h-4 w-32" style={{ background: 'rgba(51,65,85,0.5)' }} />
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" style={{ background: 'rgba(51,65,85,0.5)' }} />
              <Skeleton
                className="h-11 w-full rounded-xl"
                style={{ background: 'rgba(51,65,85,0.5)' }}
              />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" style={{ background: 'rgba(51,65,85,0.5)' }} />
              <Skeleton
                className="h-11 w-full rounded-xl"
                style={{ background: 'rgba(51,65,85,0.5)' }}
              />
            </div>
            <Skeleton
              className="mt-2 h-11 w-full rounded-xl"
              style={{ background: 'rgba(14,165,233,0.2)' }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
