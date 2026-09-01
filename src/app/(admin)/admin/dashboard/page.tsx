'use client';

import { APIKit } from '@lib/axios';
import { cn } from '@lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@ui/button';
import { motion, type Variants } from 'framer-motion';
import { AdminPageHeader, AdminStatCard } from '../_components/shared';
import { RegistrationChart } from './_components/registration-chart';
import { RevenueByPlanChart } from './_components/revenue-by-plan-chart';
import { RevenueTrendChart } from './_components/revenue-trend-chart';

const pendingActions = [
  {
    id: '1',
    type: 'org_approval',
    label: 'TechCorp Inc. awaiting approval',
    badge: 'Pending Org',
    variant: 'amber',
  },
  {
    id: '2',
    type: 'org_approval',
    label: 'Nexus Solutions awaiting approval',
    badge: 'Pending Org',
    variant: 'amber',
  },
  {
    id: '3',
    type: 'job_flag',
    label: 'Job listing #4821 flagged for spam',
    badge: 'Flagged Job',
    variant: 'red',
  },
  {
    id: '4',
    type: 'dispute',
    label: 'Incentive dispute — Acme Corp ($50)',
    badge: 'Dispute',
    variant: 'blue',
  },
];

const activityLog = [
  {
    id: '1',
    icon: 'ti-building-plus',
    color: 'text-brand-sky',
    message: 'New org registered: Acme Corp',
    time: '2 min ago',
  },
  {
    id: '2',
    icon: 'ti-user-check',
    color: 'text-brand-emerald',
    message: 'User upgraded to Premium: john@doe.com',
    time: '14 min ago',
  },
  {
    id: '3',
    icon: 'ti-alert-triangle',
    color: 'text-brand-amber',
    message: 'Job takedown requested — #4821',
    time: '1 hr ago',
  },
  {
    id: '4',
    icon: 'ti-archive',
    color: 'text-muted-foreground',
    message: 'Org archived: SpamCo (will auto-delete in 30d)',
    time: '3 hr ago',
  },
  {
    id: '5',
    icon: 'ti-coins',
    color: 'text-brand-emerald',
    message: 'Incentive paid: $50 by DataLabs',
    time: '5 hr ago',
  },
];

const BADGE_STYLES: Record<string, string> = {
  amber: 'bg-amber-500/10 text-amber-700 border border-amber-200',
  red: 'bg-red-500/10 text-red-700 border border-red-200',
  blue: 'bg-sky-500/10 text-sky-700 border border-sky-200',
};

const getDirection = (current: number, prev: number): 'up' | 'down' | 'neutral' => {
  if (current > prev) return 'up';
  if (prev < current) return 'down';
  return 'neutral';
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getTrend = (current: number, previous: number) => {
  if (previous === 0) {
    return {
      value: current === 0 ? '0.0% vs last month' : 'New',
      direction: current === 0 ? 'neutral' : 'up',
    } as const;
  }

  const percentage = ((current - previous) / previous) * 100;

  return {
    value: `${Math.abs(percentage).toFixed(1)}% vs last month`,
    direction: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral',
  } as const;
};

/* ── Variants ─────────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

function DashboardLoadingState(): React.JSX.Element {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="h-6 w-44 animate-pulse rounded-md bg-muted" />
        <div className="mt-2 h-4 w-80 animate-pulse rounded-md bg-muted/80" />
      </div>

      <div className="flex-1 space-y-5 bg-muted/30 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl border border-border bg-card"
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 h-64 animate-pulse rounded-xl border border-border bg-card" />
          <div className="h-64 animate-pulse rounded-xl border border-border bg-card" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="h-52 animate-pulse rounded-xl border border-border bg-card" />
          <div className="h-52 animate-pulse rounded-xl border border-border bg-card" />
          <div className="h-52 animate-pulse rounded-xl border border-border bg-card" />
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function AdminOverviewPage(): React.JSX.Element {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await APIKit.admin.dashboard.getStats();
      return res.data.data.stats;
    },
  });

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-1 items-center justify-center bg-muted/30 p-6">
        <div className="rounded-xl border border-border bg-card px-6 py-4 text-sm text-muted-foreground">
          Unable to load dashboard stats.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Platform Overview"
        description="Real-time platform health, revenue, and pending actions"
      />

      <div className="flex-1 overflow-y-auto bg-muted/30">
        <motion.div
          className="space-y-5 p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ── Stats row ── */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5"
          >
            <AdminStatCard
              label="Total Users"
              value={data.users.total.toLocaleString()}
              trend={{
                value: `${data.users.newThisWeek} this week`,
                direction: getDirection(data.users.newThisWeek, data.users.userPrevWeek),
              }}
              icon="ti-users"
              accent="sky"
            />
            <AdminStatCard
              label="Organizations"
              value={data.organizations.total.toLocaleString()}
              trend={{
                value: `${data.organizations.newThisWeek} this week`,
                direction: getDirection(
                  data.organizations.newThisWeek,
                  data.organizations.orgsPrevWeek,
                ),
              }}
              icon="ti-building"
              accent="purple"
            />
            <AdminStatCard
              label="Active Jobs"
              value={data.jobs.published.toLocaleString()}
              trend={{
                value: `${data.jobs.newJobThisMonth} this month`,
                direction: getDirection(data.jobs.newJobThisMonth, data.jobs.newJobPrevMonth),
              }}
              icon="ti-briefcase"
              accent="emerald"
            />
            <AdminStatCard
              label="Revenue MRR"
              value={(data.revenue.mrrCents / 100).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
              })}
              trend={getTrend(data.revenue.mrrCents, data.revenue.previousMrrCents)}
              icon="ti-trending-up"
              accent="emerald"
            />
            <AdminStatCard
              label="Pending Incentives"
              value={data.incentives.totalPendingCents.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
              })}
              trend={{
                value: `${data.incentives.totalOverdueCount} overdue`,
                direction: getDirection(
                  data.incentives.totalOverdueCount,
                  data.incentives.totalPendingCount,
                ),
              }}
              icon="ti-coin"
              accent="amber"
            />
          </motion.div>

          {/* ── Charts ── */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
            {/* Area chart */}
            <RegistrationChart />

            {/* Donut */}
            <RevenueByPlanChart />
          </motion.div>

          {/* ── Bottom row ── */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
            {/* Weekly revenue bar */}
            <RevenueTrendChart />

            {/* Pending actions */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <h2 className="text-sm font-bold text-foreground">Pending Actions</h2>
                <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500">
                  {pendingActions.length} items
                </span>
              </div>
              <ul className="divide-y divide-border" role="list">
                {pendingActions.map((a) => (
                  <li key={a.id} className="flex items-center gap-2 px-4 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium text-foreground">{a.label}</p>
                      <span
                        className={cn(
                          'mt-0.5 inline-block rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wide uppercase',
                          BADGE_STYLES[a.variant],
                        )}
                      >
                        {a.badge}
                      </span>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      {a.type === 'org_approval' && (
                        <>
                          <Button
                            size="sm"
                            className="h-6 bg-brand-emerald px-2 text-[10px] text-white hover:bg-brand-emerald/90"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 border-brand-red px-2 text-[10px] text-brand-red hover:bg-brand-red/5"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {a.type === 'job_flag' && (
                        <>
                          <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]">
                            Review
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 border-slate-400 px-2 text-[10px] text-slate-600 hover:bg-slate-50"
                          >
                            Archive
                          </Button>
                        </>
                      )}
                      {a.type === 'dispute' && (
                        <>
                          <Button
                            size="sm"
                            className="h-6 bg-brand-sky px-2 text-[10px] text-white hover:bg-brand-sky/90"
                          >
                            Resolve
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]">
                            Waive
                          </Button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Activity log */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="border-b border-border px-5 py-3">
                <h2 className="text-sm font-bold text-foreground">Recent Activity</h2>
              </div>
              <ul className="divide-y divide-border" role="list">
                {activityLog.map((e) => (
                  <li key={e.id} className="flex items-start gap-3 px-5 py-3">
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
                      <i className={cn('ti text-sm', e.icon, e.color)} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] leading-snug font-medium text-foreground">
                        {e.message}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{e.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
