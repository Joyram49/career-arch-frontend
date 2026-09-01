'use client';

import type { RevenueTrendRange } from '@app-types/admin/admin.dashboard';
import { APIKit } from '@lib/axios';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/select';
import { Skeleton } from '@ui/skeleton';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const RANGE_OPTIONS: Array<{ value: RevenueTrendRange; label: string }> = [
  { value: '7w', label: 'Last 7 weeks' },
  { value: '30d', label: 'Last 30 days' },
  { value: '2m', label: 'Last 2 months' },
  { value: '3m', label: 'Last 3 months' },
  { value: '6m', label: 'Last 6 months' },
  { value: '1y', label: 'Last 1 year' },
  { value: '2y', label: 'Last 2 years' },
  { value: '3y', label: 'Last 3 years' },
  { value: '5y', label: 'Last 5 years' },
];

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function RevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}): React.JSX.Element | null {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, p) => sum + p.value, 0);
  return (
    <div className="shadow-dropdown rounded-lg border border-border bg-card px-3 py-2">
      <p className="mb-1 text-[10px] font-semibold text-muted-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs font-semibold" style={{ color: p.color }}>
          {p.name}: ${p.value.toLocaleString()}
        </p>
      ))}
      <p className="mt-1 border-t border-border pt-1 text-xs font-bold text-foreground">
        Total: ${total.toLocaleString()}
      </p>
    </div>
  );
}

export function RevenueTrendChart(): React.JSX.Element {
  const [range, setRange] = useState<RevenueTrendRange>('7w');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'stats', 'revenue-trend', range],
    queryFn: async () => {
      const response = await APIKit.admin.dashboard.getRevenueTrend(range);
      return response.data.data.revenueTrend;
    },
    staleTime: 1000 * 60 * 5,
  });

  const buckets = (data?.buckets ?? []).map((b) => ({
    label: b.label,
    subscriptions: b.subscriptionRevenueCents / 100,
    incentives: b.incentiveRevenueCents / 100,
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-foreground">Weekly Revenue</h2>
          <p className="text-xs text-muted-foreground">Subscriptions + hiring incentives</p>
        </div>
        <Select value={range} onValueChange={(v) => setRange(v as RevenueTrendRange)}>
          <SelectTrigger className="h-7 w-30 text-[11px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-37.5 w-full rounded-lg" />
      ) : isError ? (
        <div className="flex h-37.5 items-center justify-center text-xs text-muted-foreground">
          Failed to load revenue trend.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={buckets} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
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
            <Tooltip content={<RevenueTooltip />} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="subscriptions" name="subscriptions" stackId="rev" fill="#0ea5e9" />
            <Bar
              dataKey="incentives"
              name="incentives"
              stackId="rev"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
