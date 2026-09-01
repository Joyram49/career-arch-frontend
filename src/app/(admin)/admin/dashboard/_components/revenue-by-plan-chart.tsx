'use client';

import type { ChartRange, PlanKey } from '@app-types/admin/admin.dashboard';
import { APIKit } from '@lib/axios';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/select';
import { Skeleton } from '@ui/skeleton';
import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const RANGE_OPTIONS: Array<{ value: ChartRange; label: string }> = [
  { value: '30d', label: 'Last 30 days' },
  { value: '2m', label: 'Last 2 months' },
  { value: '3m', label: 'Last 3 months' },
  { value: '6m', label: 'Last 6 months' },
  { value: '1y', label: 'Last 1 year' },
  { value: '2y', label: 'Last 2 years' },
  { value: '3y', label: 'Last 3 years' },
  { value: '5y', label: 'Last 5 years' },
];

const PLAN_COLORS: Record<PlanKey, string> = {
  FREE: '#94a3b8',
  BASIC: '#0ea5e9',
  PREMIUM: '#f59e0b',
};

export function RevenueByPlanChart(): React.JSX.Element {
  const [range, setRange] = useState<ChartRange>('30d');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'stats', 'revenue-by-plan', range],
    queryFn: async () => {
      const response = await APIKit.admin.dashboard.getRevenueByPlan(range);
      return response.data.data.revenueByPlan;
    },
    staleTime: 1000 * 60 * 5,
  });

  console.log('RevenueByPlanChart data:', data);

  const chartData = (data?.breakdown ?? []).map((b: { plan: PlanKey; amountCents: number }) => ({
    name: b.plan,
    value: b.amountCents / 100,
    color: PLAN_COLORS[b.plan],
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-foreground">Revenue by Plan</h2>
          <p className="text-xs text-muted-foreground">Collected revenue breakdown</p>
        </div>
        <Select value={range} onValueChange={(v) => setRange(v as ChartRange)}>
          <SelectTrigger className="h-7 w-28 text-[11px]">
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
          Failed to load revenue data.
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={68}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((e: { name: string; value: number; color: string }) => (
                  <Cell key={e.name} fill={e.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  typeof value === 'number'
                    ? value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                    : value
                }
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {chartData.map((p: { name: string; value: number; color: string }) => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block size-2 rounded-full"
                    style={{ background: p.color }}
                  />
                  <span className="text-muted-foreground">{p.name}</span>
                </div>
                <span className="font-semibold text-foreground">
                  {p.value.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
