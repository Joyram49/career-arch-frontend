'use client';

import type { ChartRange } from '@app-types/admin/admin.dashboard';
import { APIKit } from '@lib/axios';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/select';
import { Skeleton } from '@ui/skeleton';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}): React.JSX.Element | null {
  if (!active || !payload?.length) return null;
  return (
    <div className="shadow-dropdown rounded-lg border border-border bg-card px-3 py-2">
      <p className="mb-1 text-[10px] font-semibold text-muted-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-bold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export function RegistrationChart(): React.JSX.Element {
  const [range, setRange] = useState<ChartRange>('30d');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'stats', 'registrations', range],
    queryFn: async () => {
      const res = await APIKit.admin.dashboard.getRegistrationChartData(range);
      return res.data.data.chartData;
    },
    staleTime: 1000 * 60 * 5, // 5 min — registration counts don't change second-to-second
    enabled: !!range,
  });

  const buckets = data?.buckets ?? [];
  const rangeLabel = RANGE_OPTIONS.find((r) => r.value === range)?.label ?? 'Last 30 days';

  return (
    <div className="col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-foreground">User Registrations</h2>
          <p className="text-xs text-muted-foreground">{rangeLabel} — users &amp; orgs</p>
        </div>
        <Select value={range} onValueChange={(v) => setRange(v as ChartRange)}>
          <SelectTrigger className="h-8 w-36 text-xs">
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
        <Skeleton className="h-47.5 w-full rounded-lg" />
      ) : isError ? (
        <div className="flex h-47.5 items-center justify-center text-xs text-muted-foreground">
          Failed to load registration data.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={190}>
          <AreaChart data={buckets} margin={{ top: 0, right: 4, left: -24, bottom: 0 }}>
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
              dataKey="label"
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
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
      )}
    </div>
  );
}
