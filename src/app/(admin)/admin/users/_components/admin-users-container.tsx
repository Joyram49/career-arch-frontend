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
import { motion, type Variants } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AdminPageHeader,
  FilterSelect,
  SearchFilterBar,
  StatusBadge,
} from '../../_components/shared';

import {
  type IAdminUserListItem,
  type IAdminUsersFilters,
} from '@app-types/admin/admin.dashboard.users';
import { type PlanName } from '@app-types/auth';
import { GeneralModal, type ModalAction } from '@components/shared/general-modal';
import { PaginationControls } from '@components/shared/pagination-controls';
import { useDebounce } from '@hooks/use-debounce';
import { APIKit } from '@lib/axios';
import { cn } from '@lib/utils';
import { PaginationProvider } from '@providers/pagination-provider';
import { useQueryParamsContext } from '@providers/query-params-provider';
import { useQuery } from '@tanstack/react-query';
import { type AdminUsersQueryParams } from '@validations/admin.dashboard.schema';
import { format } from 'date-fns';
import { UsersEmptyState } from './admin-users-table-empty';
import { UsersErrorState } from './admin-users-table-error';
import { UsersTableSkeleton } from './admin-users-table-skeleton';

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
export default function AdminUsersContainer(): React.JSX.Element {
  const [selectedUser, setSelectedUser] = useState<IAdminUserListItem | null>(null);

  const [archiveTarget, setArchiveTarget] = useState<IAdminUserListItem | null>(null);

  const [suspendTarget, setSuspendTarget] = useState<IAdminUserListItem | null>(null);

  const { params, setParam, setParams } = useQueryParamsContext<AdminUsersQueryParams>();

  const { page, limit, search, isActive, plan, sortBy, sortOrder } = params;

  const [searchInput, setSearchInput] = useState(search ?? '');

  const isFirstSearchRender = useRef(true);

  const debouncedSearch = useDebounce(searchInput, 500);

  // Fetch users data
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['admin-users', params],

    queryFn: async () => {
      const response = await APIKit.admin.users.list(params);

      return response.data;
    },

    placeholderData: (previousData) => previousData,
  });

  const users = data?.data?.users ?? [];
  const meta = data?.meta;

  // Update search query param when debounced search input changes
  useEffect(() => {
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false;
      return;
    }
    setParams({
      search: debouncedSearch || undefined,
      page: 1,
    });
  }, [debouncedSearch, setParams]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleStatusChange = (value: string) => {
    setParams({
      isActive: value === 'active' ? true : value === 'suspended' ? false : undefined,
      page: 1,
    });
  };

  const handlePlanChange = (value: string) => {
    setParams({
      plan: value ? (value.toUpperCase() as IAdminUsersFilters['plan']) : undefined,
      page: 1,
    });
  };

  // Define table columns
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

  // Define sorting state based on query params
  const sorting: SortingState = sortBy
    ? [
        {
          id: sortBy,
          desc: sortOrder === 'desc',
        },
      ]
    : [];

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
      const nextSorting = typeof updater === 'function' ? updater(sorting) : updater;

      const sort = nextSorting[0];

      setParams({
        sortBy: sort?.id as IAdminUsersFilters['sortBy'] | undefined,
        sortOrder: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
        page: 1,
      });
    },

    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: meta?.totalPages ?? 0,
    enableMultiSort: false,
  });

  const hasFilters = Boolean(search) || isActive !== undefined || Boolean(plan);

  const detailModalActions: ModalAction[] = selectedUser
    ? [
        ...(selectedUser.isActive
          ? [
              {
                label: 'Suspend',
                variant: 'outline' as const,
                className: 'border-amber-300 text-amber-700 hover:bg-amber-50',
                onClick: () => {
                  setSuspendTarget(selectedUser);
                  setSelectedUser(null);
                },
              },
            ]
          : []),
        {
          label: 'Archive Account',
          variant: 'outline' as const,
          className: 'border-slate-300 text-slate-600 hover:bg-slate-50',
          onClick: () => {
            setArchiveTarget(selectedUser);
            setSelectedUser(null);
          },
        },
      ]
    : [];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Users"
        description="Manage job seekers — suspend or archive accounts (archived users auto-delete after 30 days)"
      />

      <SearchFilterBar
        searchPlaceholder="Search by name or email…"
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
      >
        <FilterSelect
          value={isActive === true ? 'active' : isActive === false ? 'suspended' : ''}
          onChange={handleStatusChange}
          placeholder="All Statuses"
          options={[
            { label: 'Active', value: 'active' },
            { label: 'Suspended', value: 'suspended' },
          ]}
        />

        <FilterSelect
          value={plan?.toLowerCase() ?? ''}
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

        {meta && (
          <PaginationProvider
            page={page}
            limit={limit}
            total={meta.total}
            onPageChange={(newPage) => setParam('page', newPage)}
            onLimitChange={(newLimit) => {
              setParams({
                limit: newLimit,
                page: 1,
              });
            }}
          >
            {!isLoading && !isError && users.length > 0 && <PaginationControls />}
          </PaginationProvider>
        )}
      </motion.div>

      {/* User detail modal */}
      <GeneralModal
        open={selectedUser !== null}
        onOpenChange={(open) => !open && setSelectedUser(null)}
        title={
          selectedUser
            ? `${selectedUser.profile?.firstName ?? ''} ${selectedUser.profile?.lastName ?? ''}`.trim()
            : ''
        }
        size="md"
        actions={detailModalActions}
      >
        {selectedUser && (
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
        )}
      </GeneralModal>

      {/* Suspend modal */}
      <GeneralModal
        open={suspendTarget !== null}
        onOpenChange={(open) => !open && setSuspendTarget(null)}
        title={`Suspend ${suspendTarget?.profile?.firstName ?? ''}?`}
        description="This user will lose access to their account immediately. You can reactivate at any time."
        size="sm"
        actions={[
          { label: 'Cancel', variant: 'outline', onClick: () => setSuspendTarget(null) },
          {
            label: 'Suspend User',
            className: 'bg-amber-500 text-white hover:bg-amber-600',
            onClick: () => {
              // TODO: wire to suspend mutation, then setSuspendTarget(null) on success
              setSuspendTarget(null);
            },
          },
        ]}
      >
        <p className="text-sm text-muted-foreground">
          You can reactivate this account any time from the users table.
        </p>
      </GeneralModal>

      {/* Archive modal */}
      <GeneralModal
        open={archiveTarget !== null}
        onOpenChange={(open) => !open && setArchiveTarget(null)}
        title={`Archive ${archiveTarget?.profile?.firstName ?? ''}?`}
        description="The account will be archived and auto-deleted after 30 days by the background cleanup cron."
        size="sm"
        actions={[
          { label: 'Cancel', variant: 'outline', onClick: () => setArchiveTarget(null) },
          {
            label: 'Archive Account',
            variant: 'destructive',
            onClick: () => {
              // TODO: wire to archive mutation, then setArchiveTarget(null) on success
              setArchiveTarget(null);
            },
          },
        ]}
      >
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <strong>Note:</strong> This action is reversible. Archived records will be automatically
          hard-deleted by a background cron after the retention period.
        </div>
      </GeneralModal>
    </div>
  );
}
