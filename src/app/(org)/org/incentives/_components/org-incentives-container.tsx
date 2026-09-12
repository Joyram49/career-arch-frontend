'use client';

import { useState } from 'react';

import { PaginationControls } from '@components/shared/pagination-controls';
import { PaginationProvider } from '@providers/pagination-provider';
import { useQueryParamsContext } from '@providers/query-params-provider';
import {
  useDisputeIncentive,
  useOrgIncentivesList,
  useOrgIncentiveStats,
  usePayIncentive,
} from '@queries/org/use-org-incentives';

import type { IOrgIncentiveListItem } from '@app-types/org/org.incentives';
import type { OrgIncentivesQueryParams } from '@validations/org.incentives.schema';

import { OrgPageHeader } from '../../_components/shared';
import { OrgIncentiveDisputeModal } from './org-incentive-dispute-modal';
import { OrgIncentivePayModal } from './org-incentive-pay-modal';
import { OrgIncentivesBanner } from './org-incentives-banner';
import { OrgIncentivesFilters } from './org-incentives-filters';
import { OrgIncentivesStats } from './org-incentives-stats';
import { OrgIncentivesTable } from './org-incentives-table';

export default function OrgIncentivesContainer(): React.JSX.Element {
  const { params, setParam, setParams } = useQueryParamsContext<OrgIncentivesQueryParams>();
  const { page, limit, status } = params;

  const [payTarget, setPayTarget] = useState<IOrgIncentiveListItem | null>(null);
  const [disputeTarget, setDisputeTarget] = useState<IOrgIncentiveListItem | null>(null);

  const { data, isLoading, isError, refetch } = useOrgIncentivesList(params);
  const incentives = data?.incentives ?? [];
  const meta = data?.meta;

  const { data: stats, isLoading: isStatsLoading } = useOrgIncentiveStats();

  const payMutation = usePayIncentive();
  const disputeMutation = useDisputeIncentive();

  const handleConfirmPay = (): void => {
    if (!payTarget) return;
    payMutation.mutate(payTarget.id, { onSuccess: () => setPayTarget(null) });
  };

  const handleConfirmDispute = (reason: string): void => {
    if (!disputeTarget) return;
    disputeMutation.mutate(
      { id: disputeTarget.id, reason },
      { onSuccess: () => setDisputeTarget(null) },
    );
  };

  const hasFilters = Boolean(status);
  const busyId = payMutation.isPending
    ? payMutation.variables
    : disputeMutation.isPending
      ? disputeMutation.variables?.id
      : undefined;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <OrgPageHeader
        title="Incentives"
        description="Pay or dispute the $50 hiring incentive triggered each time you mark a candidate as Hired"
      />

      <OrgIncentivesBanner stats={stats} />

      <OrgIncentivesStats stats={stats} isLoading={isStatsLoading} />

      <OrgIncentivesFilters
        statusValue={status ?? ''}
        onStatusChange={(v) =>
          setParams({ status: (v || undefined) as OrgIncentivesQueryParams['status'], page: 1 })
        }
      />

      <div className="flex flex-1 flex-col gap-4 px-6 py-4">
        <OrgIncentivesTable
          incentives={incentives}
          isLoading={isLoading}
          isError={isError}
          hasFilters={hasFilters}
          limit={limit}
          busyId={busyId}
          onRetry={refetch}
          onPay={setPayTarget}
          onDispute={setDisputeTarget}
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
      </div>

      <OrgIncentivePayModal
        incentive={payTarget}
        isLoading={payMutation.isPending}
        onClose={() => setPayTarget(null)}
        onConfirm={handleConfirmPay}
      />

      <OrgIncentiveDisputeModal
        incentive={disputeTarget}
        isLoading={disputeMutation.isPending}
        onClose={() => setDisputeTarget(null)}
        onConfirm={handleConfirmDispute}
      />
    </div>
  );
}
