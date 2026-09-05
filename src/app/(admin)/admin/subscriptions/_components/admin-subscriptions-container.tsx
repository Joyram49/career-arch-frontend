'use client';

import { motion, type Variants } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { type IAdminSubscriptionListItem } from '@app-types/admin/admin.dashboard.subscriptions';
import { PaginationControls } from '@components/shared/pagination-controls';
import { useDebounce } from '@hooks/use-debounce';
import { APIKit } from '@lib/axios';
import { PaginationProvider } from '@providers/pagination-provider';
import { useQueryParamsContext } from '@providers/query-params-provider';
import {
  useCancelSubscription,
  useRefundSubscription,
  type RefundReason,
} from '@queries/admin/use-admin-subscriptions';
import { useQuery } from '@tanstack/react-query';
import { type AdminSubscriptionsQueryParams } from '@validations/admin.dashboard.schema';

import { AdminPageHeader } from '../../_components/shared';
import { AdminSubscriptionCancelModal } from './admin-subscription-cancel-modal';
import { AdminSubscriptionRefundModal } from './admin-subscription-refund-modal';
import { AdminSubscriptionsFilters } from './admin-subscriptions-filters';
import { AdminSubscriptionsTable } from './admin-subscriptions-table';

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function AdminSubscriptionsContainer(): React.JSX.Element {
  const { params, setParam, setParams } = useQueryParamsContext<AdminSubscriptionsQueryParams>();
  const { page, limit, search, status, plan } = params;

  const [searchInput, setSearchInput] = useState(search ?? '');
  const isFirstSearchRender = useRef(true);
  const debouncedSearch = useDebounce(searchInput, 500);

  const [cancelTarget, setCancelTarget] = useState<IAdminSubscriptionListItem | null>(null);
  const [refundTarget, setRefundTarget] = useState<IAdminSubscriptionListItem | null>(null);

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['admin-subscriptions', params],
    queryFn: async () => {
      const response = await APIKit.admin.subscriptions.getAll(params);
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const subscriptions: IAdminSubscriptionListItem[] = data?.data?.subscriptions ?? [];
  const meta = data?.meta;

  const cancelMutation = useCancelSubscription();
  const refundMutation = useRefundSubscription();

  useEffect(() => {
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false;
      return;
    }
    setParams({ search: debouncedSearch || undefined, page: 1 });
  }, [debouncedSearch, setParams]);

  const handleStatusChange = (value: string): void => {
    setParams({
      status: value ? (value as AdminSubscriptionsQueryParams['status']) : undefined,
      page: 1,
    });
  };

  const handlePlanChange = (value: string): void => {
    setParams({
      plan: value ? (value as AdminSubscriptionsQueryParams['plan']) : undefined,
      page: 1,
    });
  };

  const handleConfirmCancel = (): void => {
    if (!cancelTarget) return;
    cancelMutation.mutate({ id: cancelTarget.id }, { onSuccess: () => setCancelTarget(null) });
  };

  const handleConfirmRefund = (reason?: RefundReason): void => {
    if (!refundTarget) return;
    refundMutation.mutate(
      { id: refundTarget.id, reason },
      { onSuccess: () => setRefundTarget(null) },
    );
  };

  const hasFilters = Boolean(search) || Boolean(status) || Boolean(plan);
  const busyId = cancelMutation.isPending
    ? cancelMutation.variables?.id
    : refundMutation.isPending
      ? refundMutation.variables?.id
      : undefined;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Subscriptions"
        description="Monitor plan status, override cancellations, and issue refunds"
      />

      <AdminSubscriptionsFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        statusValue={status ?? ''}
        onStatusChange={handleStatusChange}
        planValue={plan ?? ''}
        onPlanChange={handlePlanChange}
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
        <AdminSubscriptionsTable
          subscriptions={subscriptions}
          isLoading={isLoading}
          isError={isError}
          hasFilters={hasFilters}
          limit={limit}
          onRetry={refetch}
          onCancel={setCancelTarget}
          onRefund={setRefundTarget}
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
            {!isLoading && !isError && subscriptions.length > 0 && <PaginationControls />}
          </PaginationProvider>
        )}
      </motion.div>

      <AdminSubscriptionCancelModal
        subscription={cancelTarget}
        isLoading={cancelMutation.isPending}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
      />

      <AdminSubscriptionRefundModal
        subscription={refundTarget}
        isLoading={refundMutation.isPending}
        onClose={() => setRefundTarget(null)}
        onConfirm={handleConfirmRefund}
      />
    </div>
  );
}
