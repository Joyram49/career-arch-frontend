'use client';

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
type IncentiveStatus = 'paid' | 'pending' | 'overdue' | 'disputed' | 'waived';

interface AdminIncentive {
  id: string;
  org: string;
  candidate: string;
  job: string;
  amount: number;
  status: IncentiveStatus;
  dueDate: string;
  paidDate?: string;
  hiredDate: string;
}

const MOCK_INCENTIVES: AdminIncentive[] = [
  {
    id: '1',
    org: 'DataLabs',
    candidate: 'John Smith',
    job: 'Senior Backend Eng',
    amount: 50,
    status: 'paid',
    dueDate: '1 May 2025',
    paidDate: '28 Apr 2025',
    hiredDate: '15 Apr 2025',
  },
  {
    id: '2',
    org: 'HealthFirst',
    candidate: 'Amy Chen',
    job: 'Product Designer',
    amount: 50,
    status: 'pending',
    dueDate: '25 May 2025',
    hiredDate: '11 May 2025',
  },
  {
    id: '3',
    org: 'BuildRight',
    candidate: 'David Park',
    job: 'Site Manager',
    amount: 50,
    status: 'overdue',
    dueDate: '10 May 2025',
    hiredDate: '1 May 2025',
  },
  {
    id: '4',
    org: 'FakeJobs Ltd.',
    candidate: 'Mike Johnson',
    job: 'Sales Rep',
    amount: 50,
    status: 'disputed',
    dueDate: '5 May 2025',
    hiredDate: '22 Apr 2025',
  },
  {
    id: '5',
    org: 'DataLabs',
    candidate: 'Lisa Brown',
    job: 'DevOps Engineer',
    amount: 50,
    status: 'paid',
    dueDate: '8 May 2025',
    paidDate: '7 May 2025',
    hiredDate: '24 Apr 2025',
  },
  {
    id: '6',
    org: 'HealthFirst',
    candidate: 'Bob Martinez',
    job: 'Nurse Practitioner',
    amount: 50,
    status: 'waived',
    dueDate: '3 Apr 2025',
    hiredDate: '20 Mar 2025',
  },
  {
    id: '7',
    org: 'BuildRight',
    candidate: 'Emma Wilson',
    job: 'Project Manager',
    amount: 50,
    status: 'overdue',
    dueDate: '1 May 2025',
    hiredDate: '18 Apr 2025',
  },
];

const TAB_STATUSES = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'disputed', label: 'Disputed' },
  { value: 'paid', label: 'Paid' },
  { value: 'waived', label: 'Waived' },
];

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function AdminIncentivesPage(): React.JSX.Element {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [orgFilter, setOrg] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [waiveTarget, setWaive] = useState<AdminIncentive | null>(null);
  const [resolveTarget, setResolve] = useState<AdminIncentive | null>(null);
  const [waiveReason, setWaiveReason] = useState('');

  const filtered = useMemo(() => {
    return MOCK_INCENTIVES.filter((i) => {
      const matchTab = tab === 'all' || i.status === tab;
      const matchSearch =
        !search ||
        i.org.toLowerCase().includes(search.toLowerCase()) ||
        i.candidate.toLowerCase().includes(search.toLowerCase());
      const matchOrg = !orgFilter || i.org === orgFilter;
      return matchTab && matchSearch && matchOrg;
    });
  }, [tab, search, orgFilter]);

  const stats = useMemo(() => {
    const pending = MOCK_INCENTIVES.filter((i) => i.status === 'pending');
    const overdue = MOCK_INCENTIVES.filter((i) => i.status === 'overdue');
    const disputed = MOCK_INCENTIVES.filter((i) => i.status === 'disputed');
    const paidThisMonth = MOCK_INCENTIVES.filter((i) => i.status === 'paid');
    return {
      pendingAmt: pending.reduce((a, i) => a + i.amount, 0),
      overdueAmt: overdue.reduce((a, i) => a + i.amount, 0),
      disputedCount: disputed.length,
      paidAmt: paidThisMonth.reduce((a, i) => a + i.amount, 0),
    };
  }, []);

  const columns = useMemo<ColumnDef<AdminIncentive>[]>(
    () => [
      {
        accessorKey: 'org',
        header: 'Organization',
        cell: ({ getValue }) => (
          <span className="text-sm font-semibold text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'candidate',
        header: 'Candidate',
        cell: ({ row }) => (
          <div>
            <p className="text-sm text-foreground">{row.original.candidate}</p>
            <p className="max-w-35 truncate text-[11px] text-muted-foreground">
              {row.original.job}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ getValue }) => (
          <span className="text-sm font-bold text-foreground">${getValue<number>()}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => <StatusBadge status={getValue<IncentiveStatus>()} />,
      },
      {
        accessorKey: 'hiredDate',
        header: 'Hire Date',
        cell: ({ getValue }) => (
          <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'dueDate',
        header: 'Due Date',
        cell: ({ row }) => {
          const isOverdue = row.original.status === 'overdue';
          return (
            <span
              className={`text-xs font-medium ${isOverdue ? 'text-brand-red' : 'text-muted-foreground'}`}
            >
              {row.original.dueDate}
            </span>
          );
        },
      },
      {
        accessorKey: 'paidDate',
        header: 'Paid Date',
        cell: ({ getValue }) => (
          <span className="text-xs text-muted-foreground">
            {getValue<string | undefined>() ?? '—'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const i = row.original;
          return (
            <div className="flex items-center justify-end gap-1.5">
              {(i.status === 'pending' || i.status === 'overdue') && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs"
                  onClick={() => setWaive(i)}
                >
                  Waive
                </Button>
              )}
              {i.status === 'disputed' && (
                <>
                  <Button
                    size="sm"
                    className="h-7 bg-brand-sky px-2 text-xs text-white hover:bg-brand-sky/90"
                    onClick={() => setResolve(i)}
                  >
                    Resolve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-xs"
                    onClick={() => setWaive(i)}
                  >
                    Waive
                  </Button>
                </>
              )}
              {i.status === 'paid' && (
                <span className="text-[10px] font-medium text-brand-emerald">✓ Paid</span>
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

  const orgs = useMemo(() => [...new Set(MOCK_INCENTIVES.map((i) => i.org))], []);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Incentives"
        description="Monitor $50 hiring incentives — waive, force-resolve disputes"
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 border-b border-border bg-muted/30 px-6 py-4">
        <AdminStatCard
          label="Pending Total"
          value={`$${stats.pendingAmt}`}
          trend={{ value: 'awaiting payment', direction: 'neutral' }}
          icon="ti-coin"
          accent="amber"
        />
        <AdminStatCard
          label="Overdue Total"
          value={`$${stats.overdueAmt}`}
          trend={{ value: 'past due date', direction: 'down' }}
          icon="ti-alert-triangle"
          accent="red"
        />
        <AdminStatCard
          label="Disputed"
          value={stats.disputedCount}
          trend={{ value: 'need resolution', direction: 'neutral' }}
          icon="ti-message-report"
          accent="purple"
        />
        <AdminStatCard
          label="Paid This Month"
          value={`$${stats.paidAmt}`}
          trend={{ value: 'collected successfully', direction: 'up' }}
          icon="ti-check"
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
        searchPlaceholder="Search by org or candidate…"
        searchValue={search}
        onSearchChange={setSearch}
      >
        <FilterSelect
          value={orgFilter}
          onChange={setOrg}
          placeholder="All Orgs"
          options={orgs.map((o) => ({ label: o, value: o }))}
        />
      </SearchFilterBar>

      <motion.div
        className="flex flex-1 flex-col overflow-hidden"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left" aria-label="Incentives table">
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
                    No incentives found
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

      {/* Waive modal */}
      <Dialog
        open={waiveTarget !== null}
        onOpenChange={() => {
          setWaive(null);
          setWaiveReason('');
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Waive Incentive</DialogTitle>
            <DialogDescription>
              Waive the $50 incentive for {waiveTarget?.org} (hire: {waiveTarget?.candidate})? This
              will clear the outstanding balance and notify the org.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Reason
            </label>
            <textarea
              value={waiveReason}
              onChange={(e) => setWaiveReason(e.target.value)}
              placeholder="Admin note (required)…"
              rows={3}
              className="w-full resize-none rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setWaive(null);
                setWaiveReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-slate-700 text-white hover:bg-slate-800"
              disabled={!waiveReason.trim()}
              onClick={() => {
                setWaive(null);
                setWaiveReason('');
              }}
            >
              Waive Incentive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve dispute modal */}
      <Dialog open={resolveTarget !== null} onOpenChange={() => setResolve(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Resolve Dispute</DialogTitle>
            <DialogDescription>
              Force-resolve the disputed $50 incentive from {resolveTarget?.org}. The org will be
              charged off-session using their saved payment method.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-xs text-sky-800">
            <strong>Action:</strong> This will mark the incentive as paid and attempt off-session
            Stripe charge.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolve(null)}>
              Cancel
            </Button>
            <Button
              className="bg-brand-sky text-white hover:bg-brand-sky/90"
              onClick={() => setResolve(null)}
            >
              Force Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
