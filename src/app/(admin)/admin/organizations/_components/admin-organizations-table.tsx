'use client';

import { type IAdminOrgListItem } from '@app-types/admin/admin.dashboard.orgs';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';

import { useAdminOrganizationsColumns } from './admin-organizations-columns';
import { OrganizationsEmptyState } from './admin-organizations-table-empty';
import { OrganizationsErrorState } from './admin-organizations-table-error';
import { OrganizationsTableSkeleton } from './admin-organizations-table-skeleton';

interface AdminOrganizationsTableProps {
  organizations: IAdminOrgListItem[];
  isLoading: boolean;
  isError: boolean;
  hasFilters: boolean;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange: (sortBy: string | undefined, sortOrder: 'asc' | 'desc' | undefined) => void;
  onRetry: () => void;
  onView: (org: IAdminOrgListItem) => void;
  onRequestSuspend: (org: IAdminOrgListItem) => void;
  onRequestApprove: (org: IAdminOrgListItem) => void;
  onRequestActivate: (org: IAdminOrgListItem) => void;
}

export function AdminOrganizationsTable({
  organizations,
  isLoading,
  isError,
  hasFilters,
  limit,
  sortBy,
  sortOrder,
  onSortChange,
  onRetry,
  onView,
  onRequestSuspend,
  onRequestApprove,
  onRequestActivate,
}: AdminOrganizationsTableProps): React.JSX.Element {
  const columns = useAdminOrganizationsColumns({
    onView,
    onRequestSuspend,
    onRequestApprove,
    onRequestActivate,
  });

  const sorting: SortingState = sortBy ? [{ id: sortBy, desc: sortOrder === 'desc' }] : [];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: organizations,
    columns,
    state: { sorting },
    onSortingChange: (updater) => {
      const nextSorting = typeof updater === 'function' ? updater(sorting) : updater;
      const sort = nextSorting[0];
      onSortChange(sort?.id, sort ? (sort.desc ? 'desc' : 'asc') : undefined);
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    enableMultiSort: false,
  });

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left" aria-label="Organizations table">
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
            <OrganizationsTableSkeleton rows={limit} />
          ) : isError ? (
            <tr>
              <td colSpan={columns.length}>
                <OrganizationsErrorState onRetry={onRetry} />
              </td>
            </tr>
          ) : organizations.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <OrganizationsEmptyState hasFilters={hasFilters} />
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
