'use client';

import { motion, type Variants } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import {
  type IAdminTransactionListItem,
  type IAdminTransactionsFilters,
  type TransactionsChartRange,
} from '@app-types/admin/admin.dashboard.transactions';
import { PaginationControls } from '@components/shared/pagination-controls';
import { useDebounce } from '@hooks/use-debounce';
import { APIKit } from '@lib/axios';
import { PaginationProvider } from '@providers/pagination-provider';
import { useQueryParamsContext } from '@providers/query-params-provider';
import { useQuery } from '@tanstack/react-query';
import { type AdminTransactionsQueryParams } from '@validations/admin.dashboard.schema';

import { AdminPageHeader } from '../../_components/shared';
import { AdminTransactionDetailModal } from './admin-transactions-detail-modal';
import { AdminTransactionsFilters } from './admin-transactions-filters';
import { AdminTransactionsKpiCards } from './admin-transactions-kpi-cards';
import { AdminTransactionsRevenueChart } from './admin-transactions-revenue-chart';
import { AdminTransactionsTable } from './admin-transactions-table';

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function AdminTransactionsContainer(): React.JSX.Element {
  const [selectedTransaction, setSelectedTransaction] = useState<IAdminTransactionListItem | null>(
    null,
  );
  const [chartRange, setChartRange] = useState<TransactionsChartRange>('30d');

  const { params, setParam, setParams } = useQueryParamsContext<AdminTransactionsQueryParams>();
  const { page, limit, search, type, status, sortBy, sortOrder } = params;

  const [searchInput, setSearchInput] = useState(search ?? '');
  const isFirstSearchRender = useRef(true);
  const debouncedSearch = useDebounce(searchInput, 500);

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['admin-transactions', params],
    queryFn: async () => {
      const response = await APIKit.admin.transactions.list(params as IAdminTransactionsFilters);
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['admin-transaction-stats'],
    queryFn: async () => {
      const response = await APIKit.admin.transactions.getStats();
      return response.data;
    },
  });

  const { data: chartData, isLoading: isChartLoading } = useQuery({
    queryKey: ['admin-transaction-chart', chartRange],
    queryFn: async () => {
      const response = await APIKit.admin.transactions.getChart(chartRange);
      return response.data;
    },
  });

  const transactions = data?.data?.transactions ?? [];
  const meta = data?.meta;

  useEffect(() => {
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false;
      return;
    }
    setParams({ search: debouncedSearch || undefined, page: 1 });
  }, [debouncedSearch, setParams]);

  const hasFilters = Boolean(search) || type !== undefined || status !== undefined;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Transactions"
        description="All platform payments — subscriptions, hiring incentives, and refunds"
      />

      <AdminTransactionsKpiCards stats={statsData?.data?.stats} isLoading={isStatsLoading} />

      <AdminTransactionsRevenueChart
        data={chartData?.data?.timeline}
        isLoading={isChartLoading}
        range={chartRange}
        onRangeChange={setChartRange}
      />

      <AdminTransactionsFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        typeValue={type ?? ''}
        onTypeChange={(value) =>
          setParams({
            type: value ? (value as IAdminTransactionsFilters['type']) : undefined,
            page: 1,
          })
        }
        statusValue={status ?? ''}
        onStatusChange={(value) =>
          setParams({
            status: value ? (value as IAdminTransactionsFilters['status']) : undefined,
            page: 1,
          })
        }
      />

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
        <AdminTransactionsTable
          transactions={transactions}
          isLoading={isLoading}
          isError={isError}
          hasFilters={hasFilters}
          limit={limit}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(nextSortBy, nextSortOrder) =>
            setParams({
              sortBy: nextSortBy as IAdminTransactionsFilters['sortBy'] | undefined,
              sortOrder: nextSortOrder,
              page: 1,
            })
          }
          onRetry={refetch}
          onView={setSelectedTransaction}
        />

        {meta && (
          <PaginationProvider
            page={page}
            limit={limit}
            total={meta.total}
            onPageChange={(newPage) => setParam('page', newPage)}
            onLimitChange={(newLimit) => setParams({ limit: newLimit, page: 1 })}
          >
            {!isLoading && !isError && transactions.length > 0 && <PaginationControls />}
          </PaginationProvider>
        )}
      </motion.div>

      <AdminTransactionDetailModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
