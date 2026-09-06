'use client';

import { type IAdminTransactionListItem } from '@app-types/admin/admin.dashboard.transactions';
import { cn } from '@lib/utils';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';

import { useAdminTransactionsColumns } from './admin-transactions-columns';
import { TransactionsEmptyState } from './admin-transactions-table-empty';
import { TransactionsErrorState } from './admin-transactions-table-error';
import { TransactionsTableSkeleton } from './admin-transactions-table-skeleton';

interface AdminTransactionsTableProps {
  transactions: IAdminTransactionListItem[];
  isLoading: boolean;
  isError: boolean;
  hasFilters: boolean;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange: (sortBy: string | undefined, sortOrder: 'asc' | 'desc' | undefined) => void;
  onRetry: () => void;
  onView: (transaction: IAdminTransactionListItem) => void;
}

export function AdminTransactionsTable({
  transactions,
  isLoading,
  isError,
  hasFilters,
  limit,
  sortBy,
  sortOrder,
  onSortChange,
  onRetry,
  onView,
}: AdminTransactionsTableProps): React.JSX.Element {
  const columns = useAdminTransactionsColumns({ onView });

  const sorting: SortingState = sortBy ? [{ id: sortBy, desc: sortOrder === 'desc' }] : [];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: transactions,
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
      <table className="w-full text-left" aria-label="Transactions table">
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
            <TransactionsTableSkeleton rows={limit} />
          ) : isError ? (
            <tr>
              <td colSpan={columns.length}>
                <TransactionsErrorState onRetry={onRetry} />
              </td>
            </tr>
          ) : transactions.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <TransactionsEmptyState hasFilters={hasFilters} />
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'transition-colors hover:bg-muted/20',
                  row.original.status === 'FAILED' && 'bg-red-50/20',
                  row.original.status === 'REFUNDED' && 'bg-purple-50/20',
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
  );
}
