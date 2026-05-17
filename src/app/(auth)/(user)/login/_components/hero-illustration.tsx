export function HeroIllustration() {
  return (
    <div className="relative w-full max-w-105">
      <div className="absolute inset-0 rounded-4xl bg-linear-to-br from-brand-sky/10 to-brand-emerald/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="h-80 rounded-3xl bg-linear-to-br from-brand-sky/30 to-brand-emerald/20 p-6">
          <div className="flex h-full flex-col justify-between">
            <div className="flex justify-end">
              <div className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-background/10">
                <div className="size-3 rounded-full bg-brand-amber" />
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-background/10 p-5 backdrop-blur">
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-300 uppercase">
                  Growth Metric
                </p>

                <h3 className="mt-2 text-3xl font-bold text-white">+142%</h3>
              </div>

              <div className="flex gap-3">
                <div className="size-6 rounded-full bg-brand-sky" />
                <div className="size-4 rounded-full bg-brand-emerald" />
                <div className="size-5 rounded-full bg-brand-amber" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
