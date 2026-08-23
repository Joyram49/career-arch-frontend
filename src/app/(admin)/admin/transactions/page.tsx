'use client';

import { useState, useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getPaginationRowModel, flexRender,
  type ColumnDef, type SortingState,
} from '@tanstack/react-table';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  AdminPageHeader, StatusBadge, AdminStatCard,
  SearchFilterBar, FilterSelect, AdminPagination,
} from '../_components/shared';
import { Button } from '@ui/button';
import { cn } from '@lib/utils';

/* ── Types ─────────────────────────────────────────────────── */
type TxType   = 'subscription' | 'incentive' | 'refund';
type TxStatus = 'succeeded' | 'failed' | 'refunded';

interface AdminTransaction {
  id: string;
  date: string;
  type: TxType;
  description: string;
  user: string;
  amount: number;
  status: TxStatus;
  stripeId: string;
}

/* ── Mock data ─────────────────────────────────────────────── */
const MOCK_TX: AdminTransaction[] = [
  { id: '1',  date: '18 May 2025', type: 'subscription', description: 'Premium plan — monthly',    user: 'John Smith',   amount:  24.99, status: 'succeeded', stripeId: 'pi_abc001' },
  { id: '2',  date: '17 May 2025', type: 'incentive',    description: 'Hire incentive — DataLabs', user: 'DataLabs',     amount:  50.00, status: 'succeeded', stripeId: 'pi_abc002' },
  { id: '3',  date: '16 May 2025', type: 'subscription', description: 'Basic plan — monthly',      user: 'Sarah Lee',    amount:   9.99, status: 'succeeded', stripeId: 'pi_abc003' },
  { id: '4',  date: '15 May 2025', type: 'subscription', description: 'Premium plan — monthly',    user: 'Lisa Brown',   amount:  24.99, status: 'succeeded', stripeId: 'pi_abc004' },
  { id: '5',  date: '14 May 2025', type: 'refund',       description: 'Refund — Basic plan',       user: 'Bob Martinez', amount:  -9.99, status: 'refunded',  stripeId: 'pi_abc005' },
  { id: '6',  date: '13 May 2025', type: 'subscription', description: 'Basic plan — monthly',      user: 'David Park',   amount:   9.99, status: 'failed',    stripeId: 'pi_abc006' },
  { id: '7',  date: '12 May 2025', type: 'incentive',    description: 'Hire incentive — HealthFirst', user: 'HealthFirst', amount: 50.00, status: 'succeeded', stripeId: 'pi_abc007' },
  { id: '8',  date: '11 May 2025', type: 'subscription', description: 'Premium plan — monthly',    user: 'Emma Wilson',  amount:  24.99, status: 'succeeded', stripeId: 'pi_abc008' },
  { id: '9',  date: '10 May 2025', type: 'incentive',    description: 'Hire incentive — BuildRight', user: 'BuildRight', amount:  50.00, status: 'succeeded', stripeId: 'pi_abc009' },
  { id: '10', date: '9 May 2025',  type: 'subscription', description: 'Basic plan — monthly',      user: 'Amy Chen',     amount:   9.99, status: 'succeeded', stripeId: 'pi_abc010' },
  { id: '11', date: '8 May 2025',  type: 'refund',       description: 'Refund — Premium plan',     user: 'Mike Johnson', amount: -24.99, status: 'refunded',  stripeId: 'pi_abc011' },
  { id: '12', date: '7 May 2025',  type: 'incentive',    description: 'Hire incentive — DataLabs', user: 'DataLabs',     amount:  50.00, status: 'succeeded', stripeId: 'pi_abc012' },
];

const revenueChartData = [
  { date: '1 May',  subscription: 120, incentive: 50  },
  { date: '5 May',  subscription: 240, incentive: 100 },
  { date: '9 May',  subscription: 180, incentive: 50  },
  { date: '12 May', subscription: 310, incentive: 150 },
  { date: '15 May', subscription: 270, incentive: 50  },
  { date: '18 May', subscription: 390, incentive: 100 },
];

/* ── Helpers ─────────────────────────────────────────────────── */
const TX_TYPE_STYLES: Record<TxType, string> = {
  subscription: 'bg-sky-50 text-sky-700 border border-sky-200',
  incentive:    'bg-amber-50 text-amber-700 border border-amber-200',
  refund:       'bg-purple-50 text-purple-700 border border-purple-200',
};

const TX_TYPE_ICONS: Record<TxType, string> = {
  subscription: 'ti-credit-card',
  incentive:    'ti-coin',
  refund:       'ti-arrow-back-up',
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
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-dropdown">
      <p className="mb-1 text-[10px] font-semibold text-muted-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-bold" style={{ color: p.color }}>
          {p.name}: ${p.value}
        </p>
      ))}
    </div>
  );
}

/* ── Variants ─────────────────────────────────────────────────── */
const pageVariants: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

/* ── Page ─────────────────────────────────────────────────────── */
export default function AdminTransactionsPage(): React.JSX.Element {
  const [search,     setSearch]  = useState('');
  const [typeFilter, setType]    = useState('');
  const [statusFilter, setStatus] = useState('');
  const [sorting,    setSorting] = useState<SortingState>([]);

  const filtered = useMemo(() => {
    return MOCK_TX.filter((t) => {
      const matchSearch = !search || t.user.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()) || t.stripeId.includes(search);
      const matchType   = !typeFilter   || t.type === typeFilter;
      const matchStatus = !statusFilter || t.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [search, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    const succeeded = MOCK_TX.filter((t) => t.status === 'succeeded');
    const today     = MOCK_TX.filter((t) => t.date === '18 May 2025' && t.status === 'succeeded');
    const thisMonth = succeeded.reduce((a, t) => a + t.amount, 0);
    const todayAmt  = today.reduce((a, t) => a + t.amount, 0);
    const failed    = MOCK_TX.filter((t) => t.status === 'failed').length;
    const refunded  = MOCK_TX.filter((t) => t.status === 'refunded').reduce((a, t) => a + Math.abs(t.amount), 0);
    return { thisMonth, todayAmt, failed, refunded };
  }, []);

  const columns = useMemo<ColumnDef<AdminTransaction>[]>(() => [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ getValue }) => (
        <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ getValue }) => {
        const t = getValue<TxType>();
        return (
          <span className={cn('inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold capitalize', TX_TYPE_STYLES[t])}>
            <i className={cn('ti text-xs', TX_TYPE_ICONS[t])} aria-hidden="true" />
            {t}
          </span>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div>
          <p className="text-sm text-foreground">{row.original.description}</p>
          <p className="text-[11px] text-muted-foreground">{row.original.user}</p>
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ getValue }) => {
        const v = getValue<number>();
        return (
          <span className={cn('text-sm font-bold', v < 0 ? 'text-brand-red' : 'text-foreground')}>
            {v < 0 ? `-$${Math.abs(v).toFixed(2)}` : `$${v.toFixed(2)}`}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => <StatusBadge status={getValue<TxStatus>()} />,
    },
    {
      accessorKey: 'stripeId',
      header: 'Stripe ID',
      cell: ({ getValue }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {getValue<string>()}
        </code>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2 text-xs"
            aria-label={`View receipt for ${row.original.stripeId}`}
          >
            <i className="ti ti-receipt text-xs" aria-hidden="true" />
            Receipt
          </Button>
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Transactions"
        description="All platform payments — subscriptions, hiring incentives, and refunds"
        actions={
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            aria-label="Export transactions as CSV"
          >
            <i className="ti ti-download text-sm" aria-hidden="true" />
            Export CSV
          </Button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 border-b border-border bg-muted/30 px-6 py-4">
        <AdminStatCard
          label="This Month"
          value={`$${stats.thisMonth.toFixed(2)}`}
          trend={{ value: 'all collected', direction: 'up' }}
          icon="ti-trending-up"
          accent="emerald"
        />
        <AdminStatCard
          label="Today"
          value={`$${stats.todayAmt.toFixed(2)}`}
          trend={{ value: 'so far today', direction: 'up' }}
          icon="ti-calendar"
          accent="sky"
        />
        <AdminStatCard
          label="Failed Payments"
          value={stats.failed}
          trend={{ value: 'need follow-up', direction: stats.failed > 0 ? 'down' : 'neutral' }}
          icon="ti-alert-circle"
          accent="red"
        />
        <AdminStatCard
          label="Refunded"
          value={`$${stats.refunded.toFixed(2)}`}
          trend={{ value: 'this period', direction: 'neutral' }}
          icon="ti-arrow-back-up"
          accent="purple"
        />
      </div>

      {/* Revenue chart */}
      <div className="border-b border-border bg-card px-6 py-4">
        <h2 className="mb-3 text-sm font-bold text-foreground">Revenue Timeline</h2>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={revenueChartData} margin={{ top: 0, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v}`} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="subscription" name="subscription" stroke="#0ea5e9" strokeWidth={2} fill="url(#subGrad)" dot={false} />
            <Area type="monotone" dataKey="incentive"    name="incentive"    stroke="#f59e0b" strokeWidth={2} fill="url(#incGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block size-2.5 rounded-full bg-brand-sky" />
            Subscriptions
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block size-2.5 rounded-full bg-brand-amber" />
            Incentives
          </div>
        </div>
      </div>

      <SearchFilterBar
        searchPlaceholder="Search by user, description or Stripe ID…"
        searchValue={search}
        onSearchChange={setSearch}
      >
        <FilterSelect
          value={typeFilter}
          onChange={setType}
          placeholder="All Types"
          options={[
            { label: 'Subscription', value: 'subscription' },
            { label: 'Incentive',    value: 'incentive'    },
            { label: 'Refund',       value: 'refund'       },
          ]}
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStatus}
          placeholder="All Statuses"
          options={[
            { label: 'Succeeded', value: 'succeeded' },
            { label: 'Failed',    value: 'failed'    },
            { label: 'Refunded',  value: 'refunded'  },
          ]}
        />
      </SearchFilterBar>

      <motion.div
        className="flex flex-1 flex-col overflow-hidden"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left" aria-label="Transactions table">
            <thead className="border-b border-border bg-muted/40">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                      onClick={h.column.getToggleSortingHandler()}
                      style={{ cursor: h.column.getCanSort() ? 'pointer' : 'default' }}
                    >
                      <span className="flex items-center gap-1">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getIsSorted() === 'asc'  && <i className="ti ti-chevron-up text-xs"   aria-hidden="true" />}
                        {h.column.getIsSorted() === 'desc' && <i className="ti ti-chevron-down text-xs" aria-hidden="true" />}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-16 text-center">
                    <i className="ti ti-receipt-off mb-2 block text-3xl text-muted-foreground" aria-hidden="true" />
                    <p className="text-sm text-muted-foreground">No transactions found</p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      'transition-colors hover:bg-muted/20',
                      row.original.status === 'failed'   && 'bg-red-50/20',
                      row.original.status === 'refunded' && 'bg-purple-50/20',
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          page={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          onPageChange={(p) => table.setPageIndex(p - 1)}
          total={filtered.length}
          perPage={10}
        />
      </motion.div>
    </div>
  );
}
