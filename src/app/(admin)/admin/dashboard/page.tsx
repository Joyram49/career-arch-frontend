'use client';

import { cn } from '@lib/utils';
import { Button } from '@ui/button';
import { motion, type Variants } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AdminPageHeader, AdminStatCard } from '../_components/shared';

/* ── Mock data ─────────────────────────────────────────────── */
const registrationData = [
  { day: '1 May', users: 62, orgs: 4 },
  { day: '5 May', users: 89, orgs: 7 },
  { day: '10 May', users: 74, orgs: 3 },
  { day: '15 May', users: 143, orgs: 12 },
  { day: '20 May', users: 108, orgs: 9 },
  { day: '25 May', users: 161, orgs: 14 },
  { day: '30 May', users: 134, orgs: 11 },
];

const revenueByPlan = [
  { name: 'Free', value: 0, color: '#94a3b8' },
  { name: 'Basic', value: 18420, color: '#0ea5e9' },
  { name: 'Premium', value: 29870, color: '#f59e0b' },
];

const weeklyRevenue = [
  { week: 'W1', revenue: 9800 },
  { week: 'W2', revenue: 11200 },
  { week: 'W3', revenue: 10400 },
  { week: 'W4', revenue: 13600 },
  { week: 'W5', revenue: 12100 },
  { week: 'W6', revenue: 14800 },
  { week: 'W7', revenue: 13290 },
];

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

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}): React.JSX.Element | null {
  if (!active || !payload?.length) return null;
  return (
    <div className="shadow-dropdown rounded-lg border border-border bg-card px-3 py-2">
      <p className="mb-1 text-[10px] font-semibold text-muted-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-bold" style={{ color: p.color }}>
          {p.name}: {p.name === 'revenue' ? `$${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function AdminOverviewPage(): React.JSX.Element {
  // const { data, isLoading } = useQuery({
  //   queryKey: ['admin-profile'],
  //   queryFn: () => APIKit.admin.me.getMe().then((res) => res.data.data),
  // });
  // if (isLoading) {
  //   return <div>Profile is fetching</div>;
  // }
  // console.log(data);
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
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6"
          >
            <AdminStatCard
              label="Total Users"
              value="24,847"
              trend={{ value: '143 this week', direction: 'up' }}
              icon="ti-users"
              accent="sky"
            />
            <AdminStatCard
              label="Organizations"
              value="1,204"
              trend={{ value: '8 pending approval', direction: 'neutral' }}
              icon="ti-building"
              accent="purple"
            />
            <AdminStatCard
              label="Active Jobs"
              value="5,842"
              trend={{ value: '12% this month', direction: 'up' }}
              icon="ti-briefcase"
              accent="emerald"
            />
            <AdminStatCard
              label="Revenue MRR"
              value="$48,290"
              trend={{ value: '7.4% vs last month', direction: 'up' }}
              icon="ti-trending-up"
              accent="emerald"
            />
            <AdminStatCard
              label="Pending Incentives"
              value="$2,400"
              trend={{ value: '4 overdue', direction: 'down' }}
              icon="ti-coin"
              accent="amber"
            />
            <AdminStatCard
              label="Churn Rate"
              value="3.2%"
              trend={{ value: '0.3% vs last month', direction: 'down' }}
              icon="ti-chart-arrows-vertical"
              accent="red"
            />
          </motion.div>

          {/* ── Charts ── */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
            {/* Area chart */}
            <div className="col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-bold text-foreground">User Registrations</h2>
              <p className="mb-4 text-xs text-muted-foreground">Last 30 days — users &amp; orgs</p>
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart
                  data={registrationData}
                  margin={{ top: 0, right: 4, left: -24, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="og" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area
                    type="monotone"
                    dataKey="users"
                    name="users"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fill="url(#ug)"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="orgs"
                    name="orgs"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#og)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Donut */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-bold text-foreground">Revenue by Plan</h2>
              <p className="mb-2 text-xs text-muted-foreground">MRR breakdown</p>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={revenueByPlan}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {revenueByPlan.map((e) => (
                      <Cell key={e.name} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      typeof value === 'number' ? `$${value.toLocaleString()}` : value
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {revenueByPlan.map((p) => (
                  <div key={p.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="inline-block size-2 rounded-full"
                        style={{ background: p.color }}
                      />
                      <span className="text-muted-foreground">{p.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      ${p.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Bottom row ── */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
            {/* Weekly revenue bar */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-bold text-foreground">Weekly Revenue</h2>
              <p className="mb-4 text-xs text-muted-foreground">Last 7 weeks</p>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={weeklyRevenue} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value) =>
                      typeof value === 'number'
                        ? [`$${value.toLocaleString()}`, 'Revenue']
                        : [value, 'Revenue']
                    }
                  />
                  <Bar dataKey="revenue" name="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

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
