'use client';

export function EmailVerificationLoadingCard(): React.JSX.Element {
  return (
    <div className="shadow-modal w-full max-w-sm rounded-3xl border border-border bg-card p-7 sm:max-w-md sm:p-10">
      <div className="animate-pulse">
        <div className="mx-auto mb-6 size-20 rounded-3xl bg-muted sm:size-24" />
        <div className="mx-auto h-7 w-52 rounded-md bg-muted" />
        <div className="mt-4 space-y-2">
          <div className="h-4 rounded bg-muted" />
          <div className="mx-auto h-4 w-[90%] rounded bg-muted" />
        </div>
        <div className="mt-8 space-y-3 rounded-2xl border border-border p-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="size-5 rounded-full bg-muted" />
              <div className="h-4 flex-1 rounded bg-muted" />
            </div>
          ))}
        </div>
        <div className="mt-8 h-12 rounded-xl bg-muted" />
      </div>
    </div>
  );
}
