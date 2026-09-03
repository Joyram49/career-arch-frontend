/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';

import {
  flexRender,
  getCoreRowModel,
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

import {
  type IAdminUserListItem,
  type IAdminUsersFilters,
} from '@app-types/admin/admin.dashboard.users';
import { type PlanName } from '@app-types/auth';
import { useDebounce } from '@hooks/use-debounce';
import { APIKit } from '@lib/axios';
import { cn } from '@lib/utils';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { UsersEmptyState } from './_components/admin-users-table-empty';
import { UsersErrorState } from './_components/admin-users-table-error';
import { UsersTableSkeleton } from './_components/admin-users-table-skeleton';

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
  FREE: 'bg-slate-100 text-slate-500 border border-slate-200',
  BASIC: 'bg-sky-50 text-sky-700 border border-sky-200',
  PREMIUM: 'bg-amber-50 text-amber-700 border border-amber-200',
};

/* ── Page ─────────────────────────────────────────────────── */
export default function AdminUsersPage(): React.JSX.Element {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatus] = useState('');
  const [planFilter, setPlan] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [selectedUser, setSelectedUser] = useState<IAdminUserListItem | null>(null);

  const [archiveTarget, setArchiveTarget] = useState<IAdminUserListItem | null>(null);

  const [suspendTarget, setSuspendTarget] = useState<IAdminUserListItem | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const queryParams = useMemo<IAdminUsersFilters>(
    () => ({
      page,
      limit,
      search: debouncedSearch || undefined,

      isActive: statusFilter === 'active' ? true : statusFilter === 'suspended' ? false : undefined,

      plan: planFilter ? (planFilter.toUpperCase() as IAdminUsersFilters['plan']) : undefined,

      sortBy: sorting[0]?.id as IAdminUsersFilters['sortBy'] | undefined,

      sortOrder: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
    }),
    [page, limit, debouncedSearch, statusFilter, planFilter, sorting],
  );

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['admin-users', queryParams],

    queryFn: async () => {
      const response = await APIKit.admin.users.list(queryParams);

      return response.data;
    },

    placeholderData: (previousData) => previousData,
  });

  const users = data?.data?.users ?? [];
  const meta = data?.meta;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handlePlanChange = (value: string) => {
    setPlan(value);
    setPage(1);
  };

  const columns = useMemo<ColumnDef<IAdminUserListItem>[]>(
    () => [
      {
        id: 'user',
        header: 'User',
        enableSorting: false,
        cell: ({ row }) => {
          const user = row.original;

          const name = user.profile
            ? `${user.profile.firstName} ${user.profile.lastName}`
            : 'Unknown User';

          return (
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-brand-sky/15 text-xs font-bold text-brand-sky">
                {name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">{name}</p>

                <p className="text-[11px] text-muted-foreground">{user.email}</p>
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: 'subscription.plan',
        header: 'Plan',
        enableSorting: false,
        cell: ({ row }) => {
          const plan = row.original.subscription?.plan ?? 'FREE';

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
        id: 'status',
        header: 'Status',
        enableSorting: false,
        cell: ({ row }) => <StatusBadge status={row.original.isActive ? 'active' : 'suspended'} />,
      },

      {
        accessorKey: 'createdAt',
        header: 'Joined',
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
      },

      {
        accessorKey: 'lastLoginAt',
        header: 'Last Login',
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground">
            {row.original.lastLoginAt
              ? new Date(row.original.lastLoginAt).toLocaleDateString()
              : 'Never'}
          </span>
        ),
      },

      {
        id: 'applications',
        header: 'Applications',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-foreground">
            {row.original._count.applications}
          </span>
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
              {u.isActive === true && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-amber-300 px-2 text-xs text-amber-700 hover:bg-amber-50"
                  onClick={() => setSuspendTarget(u)}
                >
                  Suspend
                </Button>
              )}
              {u.isActive === false && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-emerald-300 px-2 text-xs text-emerald-700 hover:bg-emerald-50"
                  onClick={() => {}}
                >
                  Activate
                </Button>
              )}
              {u.isEmailVerified === false && (
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

  // TanStack Table returns an intentionally mutable table instance; React
  // Compiler must not attempt to memoize this hook call.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
    },
    onSortingChange: (updater) => {
      setSorting(updater);
      setPage(1);
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: meta?.totalPages ?? 0,
    enableMultiSort: false,
  });

  const hasFilters = Boolean(debouncedSearch) || Boolean(statusFilter) || Boolean(planFilter);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Users"
        description="Manage job seekers — suspend or archive accounts (archived users auto-delete after 30 days)"
      />

      <SearchFilterBar
        searchPlaceholder="Search by name or email…"
        searchValue={search}
        onSearchChange={handleSearchChange}
      >
        <FilterSelect
          value={statusFilter}
          onChange={handleStatusChange}
          placeholder="All Statuses"
          options={[
            { label: 'Active', value: 'active' },
            { label: 'Suspended', value: 'suspended' },
          ]}
        />

        <FilterSelect
          value={planFilter}
          onChange={handlePlanChange}
          placeholder="All Plans"
          options={[
            { label: 'Free', value: 'free' },
            { label: 'Basic', value: 'basic' },
            { label: 'Premium', value: 'premium' },
          ]}
        />
      </SearchFilterBar>

      <div className="flex h-8 items-center justify-end px-5 py-2">
        {isFetching && !isLoading && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <i className="ti ti-loader-2 animate-spin" aria-hidden="true" />
            Updating...
          </div>
        )}
      </div>

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
              {isLoading ? (
                <UsersTableSkeleton rows={limit} />
              ) : isError ? (
                <tr>
                  <td colSpan={columns.length}>
                    <UsersErrorState onRetry={refetch} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <UsersEmptyState hasFilters={hasFilters} />
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

        {!isLoading && !isError && users.length > 0 && meta && (
          <AdminPagination
            page={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
            total={meta.total}
            perPage={limit}
          />
        )}
      </motion.div>

      {/* User detail modal */}
      <Dialog open={selectedUser !== null} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedUser?.profile?.firstName} {selectedUser?.profile?.lastName}
            </DialogTitle>
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
                  <p className="font-medium text-foreground capitalize">
                    {selectedUser.subscription?.plan}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <p className="mt-0.5">
                    <StatusBadge status={selectedUser.isActive ? 'active' : 'suspended'} />
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Applications</span>
                  <p className="font-medium text-foreground">{selectedUser._count.applications}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Joined</span>
                  <p className="font-medium text-foreground">
                    {' '}
                    {selectedUser.createdAt
                      ? format(new Date(selectedUser.createdAt), 'dd, MMM yyyy')
                      : 'Never'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Login</span>
                  <p className="font-medium text-foreground">
                    {selectedUser.lastLoginAt
                      ? format(new Date(selectedUser.lastLoginAt), 'dd, MMM yyyy')
                      : 'Never'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 border-t border-border pt-3">
                {selectedUser.isActive === true && (
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
        title={`Suspend ${suspendTarget?.profile?.firstName}?`}
        description="This user will lose access to their account immediately. You can reactivate at any time."
        confirmLabel="Suspend User"
        variant="suspend"
        onConfirm={() => setSuspendTarget(null)}
      />

      {/* Archive dialog */}
      <ArchiveConfirmDialog
        open={archiveTarget !== null}
        onOpenChange={() => setArchiveTarget(null)}
        title={`Archive ${archiveTarget?.profile?.firstName}?`}
        description="The account will be archived and auto-deleted after 30 days by the background cleanup cron."
        confirmLabel="Archive Account"
        variant="archive"
        onConfirm={() => setArchiveTarget(null)}
      />
    </div>
  );
}
