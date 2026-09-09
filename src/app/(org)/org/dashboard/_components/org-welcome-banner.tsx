interface OrgWelcomeBannerProps {
  companyName: string;
  pendingIncentiveCount: number;
}

export function OrgWelcomeBanner({
  companyName,
  pendingIncentiveCount,
}: OrgWelcomeBannerProps): React.JSX.Element {
  return (
    <div className="welcome-banner">
      <div
        className="welcome-banner-orb -top-10 -right-10 size-48"
        style={{ background: 'var(--brand-sky)', opacity: 0.15 }}
      />
      <div
        className="welcome-banner-orb bottom-0 left-1/3 size-32"
        style={{ background: 'var(--brand-emerald)', opacity: 0.1 }}
      />
      <div className="relative z-10">
        <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
          Welcome back, {companyName} 👋
        </h1>
        <p className="mt-1.5 max-w-xl text-sm text-slate-300">
          {pendingIncentiveCount > 0
            ? `You have ${pendingIncentiveCount} pending hiring incentive${pendingIncentiveCount > 1 ? 's' : ''} awaiting payment.`
            : "Here's what's happening across your job listings today."}
        </p>
      </div>
    </div>
  );
}
