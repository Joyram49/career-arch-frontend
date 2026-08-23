'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { Button } from '@ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@ui/dialog';
import { motion, type Variants } from 'framer-motion';
import { useMemo, useState } from 'react';
import {
  AdminPageHeader,
  AdminPagination,
  ArchiveConfirmDialog,
  FilterSelect,
  SearchFilterBar,
  StatusBadge,
} from '../_components/shared';

import { cn } from '@lib/utils';

/* ── Types ─────────────────────────────────────────────────── */
type UserStatus = 'active' | 'suspended' | 'archived';
type PlanName = 'free' | 'basic' | 'premium';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: PlanName;
  status: UserStatus;
  joined: string;
  lastLogin: string;
  applications: number;
}

/* ── Mock data ─────────────────────────────────────────────── */
const MOCK_USERS: AdminUser[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@email.com',
    plan: 'premium',
    status: 'active',
    joined: '12 Jan 2025',
    lastLogin: '2 hr ago',
    applications: 38,
  },
  {
    id: '2',
    name: 'Sarah Lee',
    email: 'sarah@email.com',
    plan: 'basic',
    status: 'active',
    joined: '3 Feb 2025',
    lastLogin: '1 day ago',
    applications: 14,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@email.com',
    plan: 'free',
    status: 'active',
    joined: '18 Mar 2025',
    lastLogin: '5 hr ago',
    applications: 4,
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma@email.com',
    plan: 'premium',
    status: 'suspended',
    joined: '5 Apr 2025',
    lastLogin: '3 days ago',
    applications: 21,
  },
  {
    id: '5',
    name: 'David Park',
    email: 'david@email.com',
    plan: 'basic',
    status: 'active',
    joined: '22 Apr 2025',
    lastLogin: '10 min ago',
    applications: 9,
  },
  {
    id: '6',
    name: 'Amy Chen',
    email: 'amy@email.com',
    plan: 'free',
    status: 'active',
    joined: '1 May 2025',
    lastLogin: '2 days ago',
    applications: 2,
  },
  {
    id: '7',
    name: 'Bob Martinez',
    email: 'bob@email.com',
    plan: 'basic',
    status: 'archived',
    joined: '15 Jan 2025',
    lastLogin: '30 days ago',
    applications: 7,
  },
  {
    id: '8',
    name: 'Lisa Brown',
    email: 'lisa@email.com',
    plan: 'premium',
    status: 'active',
    joined: '9 Feb 2025',
    lastLogin: '1 hr ago',
    applications: 45,
  },
];

/* ── Variants ─────────────────────────────────────────────── */
const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

/* ── Plan badge ─────────────────────────────────────────────── */
const PLAN_STYLES: Record<PlanName, string> = {
  free: 'bg-slate-100 text-slate-500 border border-slate-200',
  basic: 'bg-sky-50 text-sky-700 border border-sky-200',
  premium: 'bg-amber-50 text-amber-700 border border-amber-200',
};

/* ── Page ─────────────────────────────────────────────────── */
export default function AdminUsersPage(): React.JSX.Element {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatus] = useState('');
  const [planFilter, setPlan] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<AdminUser | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<AdminUser | null>(null);

  const filtered = useMemo(() => {
    return MOCK_USERS.filter((u) => {
      const matchSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || u.status === statusFilter;
      const matchPlan = !planFilter || u.plan === planFilter;
      return matchSearch && matchStatus && matchPlan;
    });
  }, [search, statusFilter, planFilter]);

  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'User',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-brand-sky/15 text-xs font-bold text-brand-sky">
              {row.original.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{row.original.name}</p>
              <p className="text-[11px] text-muted-foreground">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'plan',
        header: 'Plan',
        cell: ({ getValue }) => {
          const plan = getValue<PlanName>();
          return (
            <span
              className={cn(
                'rounded px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase',
                PLAN_STYLES[plan],
              )}
            >
              {plan}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => <StatusBadge status={getValue<UserStatus>()} />,
      },
      {
        accessorKey: 'joined',
        header: 'Joined',
        cell: ({ getValue }) => (
          <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'lastLogin',
        header: 'Last Login',
        cell: ({ getValue }) => (
          <span className="text-xs text-muted-foreground">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'applications',
        header: 'Applications',
        cell: ({ getValue }) => (
          <span className="text-sm font-semibold text-foreground">{getValue<number>()}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => setSelectedUser(u)}
              >
                View
              </Button>
              {u.status === 'active' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-amber-300 px-2 text-xs text-amber-700 hover:bg-amber-50"
                  onClick={() => setSuspendTarget(u)}
                >
                  Suspend
                </Button>
              )}
              {u.status === 'suspended' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-emerald-300 px-2 text-xs text-emerald-700 hover:bg-emerald-50"
                  onClick={() => {}}
                >
                  Activate
                </Button>
              )}
              {u.status !== 'archived' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-slate-300 px-2 text-xs text-slate-500 hover:bg-slate-50"
                  onClick={() => setArchiveTarget(u)}
                >
                  Archive
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
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Users"
        description="Manage job seekers — suspend or archive accounts (archived users auto-delete after 30 days)"
      />

      <SearchFilterBar
        searchPlaceholder="Search by name or email…"
        searchValue={search}
        onSearchChange={setSearch}
      >
        <FilterSelect
          value={statusFilter}
          onChange={setStatus}
          placeholder="All Statuses"
          options={[
            { label: 'Active', value: 'active' },
            { label: 'Suspended', value: 'suspended' },
            { label: 'Archived', value: 'archived' },
          ]}
        />
        <FilterSelect
          value={planFilter}
          onChange={setPlan}
          placeholder="All Plans"
          options={[
            { label: 'Free', value: 'free' },
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
          <table className="w-full text-left" aria-label="Users table">
            <thead className="border-b border-border bg-muted/40">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase"
                      onClick={h.column.getToggleSortingHandler()}
                      style={{ cursor: h.column.getCanSort() ? 'pointer' : 'default' }}
                    >
                      <span className="flex items-center gap-1">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getIsSorted() === 'asc' && (
                          <i className="ti ti-chevron-up text-xs" aria-hidden="true" />
                        )}
                        {h.column.getIsSorted() === 'desc' && (
                          <i className="ti ti-chevron-down text-xs" aria-hidden="true" />
                        )}
                      </span>
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
                    No users found
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

      {/* User detail modal */}
      <Dialog open={selectedUser !== null} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">{selectedUser?.name}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Email</span>
                  <p className="font-medium text-foreground">{selectedUser.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Plan</span>
                  <p className="font-medium text-foreground capitalize">{selectedUser.plan}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <p className="mt-0.5">
                    <StatusBadge status={selectedUser.status} />
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Applications</span>
                  <p className="font-medium text-foreground">{selectedUser.applications}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Joined</span>
                  <p className="font-medium text-foreground">{selectedUser.joined}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Login</span>
                  <p className="font-medium text-foreground">{selectedUser.lastLogin}</p>
                </div>
              </div>
              <div className="flex gap-2 border-t border-border pt-3">
                {selectedUser.status === 'active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    onClick={() => {
                      setSuspendTarget(selectedUser);
                      setSelectedUser(null);
                    }}
                  >
                    Suspend
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-300 text-slate-600 hover:bg-slate-50"
                  onClick={() => {
                    setArchiveTarget(selectedUser);
                    setSelectedUser(null);
                  }}
                >
                  Archive Account
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Suspend dialog */}
      <ArchiveConfirmDialog
        open={suspendTarget !== null}
        onOpenChange={() => setSuspendTarget(null)}
        title={`Suspend ${suspendTarget?.name}?`}
        description="This user will lose access to their account immediately. You can reactivate at any time."
        confirmLabel="Suspend User"
        variant="suspend"
        onConfirm={() => setSuspendTarget(null)}
      />

      {/* Archive dialog */}
      <ArchiveConfirmDialog
        open={archiveTarget !== null}
        onOpenChange={() => setArchiveTarget(null)}
        title={`Archive ${archiveTarget?.name}?`}
        description="The account will be archived and auto-deleted after 30 days by the background cleanup cron."
        confirmLabel="Archive Account"
        variant="archive"
        onConfirm={() => setArchiveTarget(null)}
      />
    </div>
  );
}
