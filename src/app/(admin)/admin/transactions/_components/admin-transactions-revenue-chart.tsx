'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  type IRevenueTimelineData,
  type TransactionsChartRange,
} from '@app-types/admin/admin.dashboard.transactions';
import { FilterSelect } from '../../_components/shared';

interface AdminTransactionsRevenueChartProps {
  data: IRevenueTimelineData | undefined;
  isLoading: boolean;
  range: TransactionsChartRange;
  onRangeChange: (range: TransactionsChartRange) => void;
}

const RANGE_OPTIONS: Array<{ label: string; value: string }> = [
  { label: '7 Weeks', value: '7w' },
  { label: '30 Days', value: '30d' },
  { label: '2 Months', value: '2m' },
  { label: '3 Months', value: '3m' },
  { label: '6 Months', value: '6m' },
  { label: '1 Year', value: '1y' },
  { label: '2 Years', value: '2y' },
  { label: '3 Years', value: '3y' },
  { label: '5 Years', value: '5y' },
];

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
          {p.name}: ${(p.value / 100).toFixed(2)}
        </p>
      ))}
    </div>
  );
}

export function AdminTransactionsRevenueChart({
  data,
  isLoading,
  range,
  onRangeChange,
}: AdminTransactionsRevenueChartProps): React.JSX.Element {
  const chartData = (data?.buckets ?? []).map((b) => ({
    date: b.label,
    subscription: b.subscriptionRevenueCents,
    incentive: b.incentiveRevenueCents,
    refunded: b.refundedCents,
  }));

  return (
    <div className="border-b border-border bg-card px-6 py-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">Revenue Timeline</h2>
        <FilterSelect
          value={range}
          onChange={(v) => onRangeChange(v as TransactionsChartRange)}
          options={RANGE_OPTIONS}
          placeholder="Range"
        />
      </div>

      {isLoading ? (
        <div className="flex h-30 items-center justify-center text-xs text-muted-foreground">
          Loading chart…
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={chartData} margin={{ top: 0, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="refGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `$${(v / 100).toFixed(0)}`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="subscription"
                name="Subscriptions"
                stroke="#0ea5e9"
                strokeWidth={2}
                fill="url(#subGrad)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="incentive"
                name="Incentives"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#incGrad)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="refunded"
                name="Refunded"
                stroke="#a855f7"
                strokeWidth={2}
                fill="url(#refGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block size-2.5 rounded-full bg-brand-sky" />
              Subscriptions
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block size-2.5 rounded-full bg-brand-amber" />
              Incentives
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block size-2.5 rounded-full bg-purple-500" />
              Refunded
            </div>
          </div>
        </>
      )}
    </div>
  );
}
