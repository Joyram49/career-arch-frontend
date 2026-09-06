'use client';

import { motion, type Variants } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { type IAdminIncentiveListItem } from '@app-types/admin/admin.dashboard.incentives';
import { PaginationControls } from '@components/shared/pagination-controls';
import { useDebounce } from '@hooks/use-debounce';
import { APIKit } from '@lib/axios';
import { PaginationProvider } from '@providers/pagination-provider';
import { useQueryParamsContext } from '@providers/query-params-provider';
import {
  useResolveDispute,
  useWaiveIncentive,
  type DisputeResolution,
} from '@queries/admin/use-admin-incentives';
import { useQuery } from '@tanstack/react-query';
import { type AdminIncentivesQueryParams } from '@validations/admin.dashboard.schema';

import { AdminPageHeader } from '../../_components/shared';
import { AdminIncentiveResolveDisputeModal } from './admin-incentive-resolve-dispute-modal';
import { AdminIncentiveWaiveModal } from './admin-incentive-waive-modal';
import { AdminIncentivesFilters } from './admin-incentives-filters';
import { AdminIncentivesStats } from './admin-incentives-stats';
import { AdminIncentivesTable } from './admin-incentives-table';

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function AdminIncentivesContainer(): React.JSX.Element {
  const { params, setParam, setParams } = useQueryParamsContext<AdminIncentivesQueryParams>();
  const { page, limit, search, status } = params;

  const [searchInput, setSearchInput] = useState(search ?? '');
  const isFirstSearchRender = useRef(true);
  const debouncedSearch = useDebounce(searchInput, 500);

  const [waiveTarget, setWaiveTarget] = useState<IAdminIncentiveListItem | null>(null);
  const [resolveTarget, setResolveTarget] = useState<IAdminIncentiveListItem | null>(null);

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['admin-incentives', params],
    queryFn: async () => {
      const response = await APIKit.admin.incentives.getAll(params);
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const incentives: IAdminIncentiveListItem[] = data?.data?.incentives ?? [];
  const meta = data?.meta;

  const waiveMutation = useWaiveIncentive();
  const resolveMutation = useResolveDispute();

  useEffect(() => {
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false;
      return;
    }
    setParams({ search: debouncedSearch || undefined, page: 1 });
  }, [debouncedSearch, setParams]);

  const handleStatusChange = (value: string): void => {
    setParams({
      status: value ? (value as AdminIncentivesQueryParams['status']) : undefined,
      page: 1,
    });
  };

  const handleConfirmWaive = (reason: string): void => {
    if (!waiveTarget) return;
    waiveMutation.mutate({ id: waiveTarget.id, reason }, { onSuccess: () => setWaiveTarget(null) });
  };

  const handleConfirmResolve = (resolution: DisputeResolution, note?: string): void => {
    if (!resolveTarget) return;
    resolveMutation.mutate(
      { id: resolveTarget.id, resolution, note },
      { onSuccess: () => setResolveTarget(null) },
    );
  };

  const hasFilters = Boolean(search) || Boolean(status);
  const busyId = waiveMutation.isPending
    ? waiveMutation.variables?.id
    : resolveMutation.isPending
      ? resolveMutation.variables?.id
      : undefined;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Incentives"
        description="Monitor $50 hiring incentives — waive outstanding balances or force-resolve disputes"
      />

      <AdminIncentivesStats />

      <AdminIncentivesFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        statusValue={status ?? ''}
        onStatusChange={handleStatusChange}
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
        <AdminIncentivesTable
          incentives={incentives}
          isLoading={isLoading}
          isError={isError}
          hasFilters={hasFilters}
          limit={limit}
          onRetry={refetch}
          onWaive={setWaiveTarget}
          onResolveDispute={setResolveTarget}
          busyId={busyId}
        />

        {meta && (
          <PaginationProvider
            page={page}
            limit={limit}
            total={meta.total}
            onPageChange={(newPage) => setParam('page', newPage)}
            onLimitChange={(newLimit) => setParams({ limit: newLimit, page: 1 })}
          >
            {!isLoading && !isError && incentives.length > 0 && <PaginationControls />}
          </PaginationProvider>
        )}
      </motion.div>

      <AdminIncentiveWaiveModal
        incentive={waiveTarget}
        isLoading={waiveMutation.isPending}
        onClose={() => setWaiveTarget(null)}
        onConfirm={handleConfirmWaive}
      />

      <AdminIncentiveResolveDisputeModal
        incentive={resolveTarget}
        isLoading={resolveMutation.isPending}
        onClose={() => setResolveTarget(null)}
        onConfirm={handleConfirmResolve}
      />
    </div>
  );
}
