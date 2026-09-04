'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { Button } from '@ui/button';
import { useMemo } from 'react';
import { StatusBadge } from '../../_components/shared';

import {
  type IAdminUserListItem,
  type IAdminUsersFilters,
} from '@app-types/admin/admin.dashboard.users';
import { type PlanName } from '@app-types/auth';
import { cn } from '@lib/utils';
import { UsersEmptyState } from './admin-users-table-empty';
import { UsersErrorState } from './admin-users-table-error';
import { UsersTableSkeleton } from './admin-users-table-skeleton';

const PLAN_STYLES: Record<PlanName, string> = {
  FREE: 'bg-slate-100 text-slate-500 border border-slate-200',
  BASIC: 'bg-sky-50 text-sky-700 border border-sky-200',
  PREMIUM: 'bg-amber-50 text-amber-700 border border-amber-200',
};

interface AdminUsersTableProps {
  users: IAdminUserListItem[];
  isLoading: boolean;
  isError: boolean;
  hasFilters: boolean;
  limit: number;
  sortBy: IAdminUsersFilters['sortBy'];
  sortOrder: IAdminUsersFilters['sortOrder'];
  onSortChange: (
    sortBy: IAdminUsersFilters['sortBy'] | undefined,
    sortOrder: 'asc' | 'desc' | undefined,
  ) => void;
  onRetry: () => void;
  onView: (user: IAdminUserListItem) => void;
  onSuspend: (user: IAdminUserListItem) => void;
  onActivate: (user: IAdminUserListItem) => void;
  onArchive: (user: IAdminUserListItem) => void;
  /** id of the user currently being activated, to show a busy state on its row */
  activatingId?: string;
}

export function AdminUsersTable({
  users,
  isLoading,
  isError,
  hasFilters,
  limit,
  sortBy,
  sortOrder,
  onSortChange,
  onRetry,
  onView,
  onSuspend,
  onActivate,
  onArchive,
  activatingId,
}: AdminUsersTableProps): React.JSX.Element {
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
          const isBusy = activatingId === u.id;
          return (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={() => onView(u)}
              >
                View
              </Button>
              {u.isActive ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-amber-300 px-2 text-xs text-amber-700 hover:bg-amber-50"
                  onClick={() => onSuspend(u)}
                >
                  Suspend
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-emerald-300 px-2 text-xs text-emerald-700 hover:bg-emerald-50"
                  disabled={isBusy}
                  onClick={() => onActivate(u)}
                >
                  {isBusy ? 'Activating…' : 'Activate'}
                </Button>
              )}
              {!u.isEmailVerified && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 border-slate-300 px-2 text-xs text-slate-500 hover:bg-slate-50"
                  onClick={() => onArchive(u)}
                >
                  Archive
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [activatingId, onActivate, onArchive, onSuspend, onView],
  );

  const sorting: SortingState = sortBy ? [{ id: sortBy, desc: sortOrder === 'desc' }] : [];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: users,
    columns,
    state: { sorting },
    onSortingChange: (updater) => {
      const nextSorting = typeof updater === 'function' ? updater(sorting) : updater;
      const sort = nextSorting[0];
      onSortChange(
        sort?.id as IAdminUsersFilters['sortBy'] | undefined,
        sort ? (sort.desc ? 'desc' : 'asc') : undefined,
      );
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    enableMultiSort: false,
  });

  return (
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
                <UsersErrorState onRetry={onRetry} />
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
  );
}
