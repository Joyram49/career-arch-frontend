'use client';

import { cn } from '@lib/utils';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@ui/tabs';
import { motion, type Variants } from 'framer-motion';
import { useMemo, useState } from 'react';
import {
  AdminPageHeader,
  AdminPagination,
  AdminStatCard,
  FilterSelect,
  SearchFilterBar,
  StatusBadge,
} from '../_components/shared';

/* ── Types ─────────────────────────────────────────────────── */
type SubStatus = 'active' | 'cancelled' | 'past_due';
type PlanName = 'basic' | 'premium';

interface AdminSubscription {
  id: string;
  user: string;
  email: string;
  plan: PlanName;
  status: SubStatus;
  started: string;
  renewal: string;
  amount: number;
  stripeId: string;
}

const MOCK_SUBS: AdminSubscription[] = [
  {
    id: '1',
    user: 'John Smith',
    email: 'john@email.com',
    plan: 'premium',
    status: 'active',
    started: '1 Jan 2025',
    renewal: '1 Jun 2025',
    amount: 24.99,
    stripeId: 'sub_abc123',
  },
  {
    id: '2',
    user: 'Sarah Lee',
    email: 'sarah@email.com',
    plan: 'basic',
    status: 'active',
    started: '3 Feb 2025',
    renewal: '3 Jun 2025',
    amount: 9.99,
    stripeId: 'sub_def456',
  },
  {
    id: '3',
    user: 'Lisa Brown',
    email: 'lisa@email.com',
    plan: 'premium',
    status: 'active',
    started: '9 Feb 2025',
    renewal: '9 Jun 2025',
    amount: 24.99,
    stripeId: 'sub_ghi789',
  },
  {
    id: '4',
    user: 'Emma Wilson',
    email: 'emma@email.com',
    plan: 'basic',
    status: 'past_due',
    started: '5 Apr 2025',
    renewal: '5 May 2025',
    amount: 9.99,
    stripeId: 'sub_jkl012',
  },
  {
    id: '5',
    user: 'David Park',
    email: 'david@email.com',
    plan: 'basic',
    status: 'active',
    started: '22 Apr 2025',
    renewal: '22 Jun 2025',
    amount: 9.99,
    stripeId: 'sub_mno345',
  },
  {
    id: '6',
    user: 'Bob Martinez',
    email: 'bob@email.com',
    plan: 'basic',
    status: 'cancelled',
    started: '15 Jan 2025',
    renewal: '—',
    amount: 9.99,
    stripeId: 'sub_pqr678',
  },
];

const PLAN_STYLES: Record<PlanName, string> = {
  basic: 'bg-sky-50 text-sky-700 border border-sky-200',
  premium: 'bg-amber-50 text-amber-700 border border-amber-200',
};

const STATUS_LABEL: Record<SubStatus, string> = {
  active: 'active',
  cancelled: 'archived', // mapped to grey archived badge
  past_due: 'pending',
};

const TAB_STATUSES = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'past_due', label: 'Past Due' },
  { value: 'cancelled', label: 'Cancelled' },
];

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function AdminSubscriptionsPage(): React.JSX.Element {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [planFilter, setPlan] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [cancelTarget, setCancel] = useState<AdminSubscription | null>(null);
  const [refundTarget, setRefund] = useState<AdminSubscription | null>(null);

  const filtered = useMemo(() => {
    return MOCK_SUBS.filter((s) => {
      const matchTab = tab === 'all' || s.status === tab;
      const matchSearch =
        !search ||
        s.user.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      const matchPlan = !planFilter || s.plan === planFilter;
      return matchTab && matchSearch && matchPlan;
    });
  }, [tab, search, planFilter]);

  const stats = useMemo(() => {
    const active = MOCK_SUBS.filter((s) => s.status === 'active');
    const basic = active.filter((s) => s.plan === 'basic');
    const premium = active.filter((s) => s.plan === 'premium');
    const mrr = active.reduce((acc, s) => acc + s.amount, 0);
    const pastDue = MOCK_SUBS.filter((s) => s.status === 'past_due');
    return {
      active: active.length,
      basic: basic.length,
      premium: premium.length,
      mrr,
      pastDue: pastDue.length,
    };
  }, []);

  const columns = useMemo<ColumnDef<AdminSubscription>[]>(
    () => [
      {
        accessorKey: 'user',
        header: 'User',
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-semibold text-foreground">{row.original.user}</p>
            <p className="text-[11px] text-muted-foreground">{row.original.email}</p>
          </div>
        ),
      },
      {
        accessorKey: 'plan',
        header: 'Plan',
        cell: ({ getValue }) => {
          const p = getValue<PlanName>();
          return (
            <span
              className={cn(
                'rounded px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase',
                PLAN_STYLES[p],
              )}
            >
              {p}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const s = getValue<SubStatus>();
          return <StatusBadge status={STATUS_LABEL[s] as 'active' | 'archived' | 'pending'} />;
        },
      },
      {
        accessorKey: 'started',
        header: 'Started',
        cell: ({ getValue }) => (
          <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'renewal',
        header: 'Renewal',
        cell: ({ getValue }) => (
          <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ getValue }) => (
          <span className="text-sm font-semibold text-foreground">
            ${getValue<number>().toFixed(2)}/mo
          </span>
        ),
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
        cell: ({ row }) => {
          const s = row.original;
          return (
            <div className="flex items-center justify-end gap-1.5">
              {s.status === 'active' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-red-300 px-2 text-xs text-red-600 hover:bg-red-50"
                  onClick={() => setCancel(s)}
                >
                  Cancel
                </Button>
              )}
              {s.status !== 'cancelled' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  onClick={() => setRefund(s)}
                >
                  Refund
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Subscriptions"
        description="Monitor plan status, override cancellations, and issue refunds"
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 border-b border-border bg-muted/30 px-6 py-4">
        <AdminStatCard
          label="Active Subs"
          value={stats.active}
          trend={{ value: 'all plans', direction: 'neutral' }}
          icon="ti-users"
          accent="sky"
        />
        <AdminStatCard
          label="Basic Active"
          value={stats.basic}
          trend={{ value: `$${(stats.basic * 9.99).toFixed(0)} MRR`, direction: 'up' }}
          icon="ti-credit-card"
          accent="sky"
        />
        <AdminStatCard
          label="Premium Active"
          value={stats.premium}
          trend={{ value: `$${(stats.premium * 24.99).toFixed(0)} MRR`, direction: 'up' }}
          icon="ti-star"
          accent="amber"
        />
        <AdminStatCard
          label="Total MRR"
          value={`$${stats.mrr.toFixed(2)}`}
          trend={{
            value: stats.pastDue > 0 ? `${stats.pastDue} past due` : 'all paid',
            direction: stats.pastDue > 0 ? 'down' : 'up',
          }}
          icon="ti-trending-up"
          accent="emerald"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-card px-6 pt-3">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="h-9 gap-1 bg-transparent p-0">
            {TAB_STATUSES.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="h-9 rounded-none border-b-2 border-transparent px-4 text-xs font-medium data-[state=active]:border-brand-sky data-[state=active]:text-brand-sky"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <SearchFilterBar
        searchPlaceholder="Search by user or email…"
        searchValue={search}
        onSearchChange={setSearch}
      >
        <FilterSelect
          value={planFilter}
          onChange={setPlan}
          placeholder="All Plans"
          options={[
            { label: 'Basic', value: 'basic' },
            { label: 'Premium', value: 'premium' },
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
          <table className="w-full text-left" aria-label="Subscriptions table">
            <thead className="border-b border-border bg-muted/40">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-5 py-12 text-center text-sm text-muted-foreground"
                  >
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-muted/20">
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
          perPage={8}
        />
      </motion.div>

      {/* Cancel dialog */}
      <Dialog open={cancelTarget !== null} onOpenChange={() => setCancel(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Cancel Subscription</DialogTitle>
            <DialogDescription>
              Cancel {cancelTarget?.user}&apos;s {cancelTarget?.plan} plan? They&apos;ll be
              downgraded to Free at the end of the current period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancel(null)}>
              Cancel
            </Button>
            <Button
              className="bg-brand-red text-white hover:bg-brand-red/90"
              onClick={() => setCancel(null)}
            >
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund dialog */}
      <Dialog open={refundTarget !== null} onOpenChange={() => setRefund(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">Issue Refund</DialogTitle>
            <DialogDescription>
              Refund ${refundTarget?.amount.toFixed(2)} to {refundTarget?.user} via Stripe? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefund(null)}>
              Cancel
            </Button>
            <Button
              className="bg-brand-sky text-white hover:bg-brand-sky/90"
              onClick={() => setRefund(null)}
            >
              Issue Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
