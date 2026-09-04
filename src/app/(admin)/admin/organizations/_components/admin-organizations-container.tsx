'use client';

import { motion, type Variants } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { AdminPageHeader } from '../../_components/shared';

import {
  type IAdminOrganizationsFilters,
  type IAdminOrgListItem,
} from '@app-types/admin/admin.dashboard.orgs';
import { PaginationControls } from '@components/shared/pagination-controls';
import { useDebounce } from '@hooks/use-debounce';
import { APIKit } from '@lib/axios';
import { PaginationProvider } from '@providers/pagination-provider';
import { useQueryParamsContext } from '@providers/query-params-provider';
import {
  useActivateOrganization,
  useApproveOrganization,
  useSuspendOrganization,
} from '@queries/admin/use-admin-orgs';
import { useQuery } from '@tanstack/react-query';
import { type AdminOrganizationsQueryParams } from '@validations/admin.dashboard.schema';

import { AdminOrganizationActivateModal } from './admin-organizations-activate-modal';
import { AdminOrganizationApproveModal } from './admin-organizations-approve-modal';
import { AdminOrganizationDetailModal } from './admin-organizations-detail-modal';
import { AdminOrganizationsFilters } from './admin-organizations-filters';
import { AdminOrganizationSuspendModal } from './admin-organizations-suspend-modal';
import { AdminOrganizationsTable } from './admin-organizations-table';

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function AdminOrganizationsContainer(): React.JSX.Element {
  const [selectedOrg, setSelectedOrg] = useState<IAdminOrgListItem | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<IAdminOrgListItem | null>(null);
  const [approveTarget, setApproveTarget] = useState<IAdminOrgListItem | null>(null);
  const [activateTarget, setActivateTarget] = useState<IAdminOrgListItem | null>(null);

  const { params, setParam, setParams } = useQueryParamsContext<AdminOrganizationsQueryParams>();
  const { page, limit, search, isApproved, isActive, hasUnpaidIncentives, sortBy, sortOrder } =
    params;

  console.log(params);

  const [searchInput, setSearchInput] = useState(search ?? '');
  const isFirstSearchRender = useRef(true);
  const debouncedSearch = useDebounce(searchInput, 500);

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['admin-organizations', params],
    queryFn: async () => {
      const response = await APIKit.admin.organizations.list(params);
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const organizations = data?.data?.organizations ?? [];
  const meta = data?.meta;

  const approveMutation = useApproveOrganization();
  const suspendMutation = useSuspendOrganization();
  const activateMutation = useActivateOrganization();

  useEffect(() => {
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false;
      return;
    }
    setParams({ search: debouncedSearch || undefined, page: 1 });
  }, [debouncedSearch, setParams]);

  const openApproveModal = (org: IAdminOrgListItem): void => {
    setApproveTarget(org);
    setSelectedOrg(null);
  };

  const openSuspendModal = (org: IAdminOrgListItem): void => {
    setSuspendTarget(org);
    setSelectedOrg(null);
  };

  const openActivateModal = (org: IAdminOrgListItem): void => {
    setActivateTarget(org);
    setSelectedOrg(null);
  };

  const hasFilters =
    Boolean(search) ||
    isApproved !== undefined ||
    isActive !== undefined ||
    hasUnpaidIncentives !== undefined;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Organizations"
        description="Approve, suspend, or reactivate employer accounts."
      />

      <AdminOrganizationsFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        isApproved={isApproved}
        onApprovalChange={(value) =>
          setParams({
            isApproved: value === 'approved' ? true : value === 'pending' ? false : undefined,
            page: 1,
          })
        }
        isActive={isActive}
        onStatusChange={(value) =>
          setParams({
            isActive: value === 'active' ? true : value === 'suspended' ? false : undefined,
            page: 1,
          })
        }
        hasUnpaidIncentives={hasUnpaidIncentives}
        onIncentivesChange={(value) =>
          setParams({ hasUnpaidIncentives: value === 'unpaid' ? true : undefined, page: 1 })
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
        <AdminOrganizationsTable
          organizations={organizations}
          isLoading={isLoading}
          isError={isError}
          hasFilters={hasFilters}
          limit={limit}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(nextSortBy, nextSortOrder) =>
            setParams({
              sortBy: nextSortBy as IAdminOrganizationsFilters['sortBy'] | undefined,
              sortOrder: nextSortOrder,
              page: 1,
            })
          }
          onRetry={refetch}
          onView={setSelectedOrg}
          onRequestSuspend={openSuspendModal}
          onRequestApprove={openApproveModal}
          onRequestActivate={openActivateModal}
        />

        {meta && (
          <PaginationProvider
            page={page}
            limit={limit}
            total={meta.total}
            onPageChange={(newPage) => setParam('page', newPage)}
            onLimitChange={(newLimit) => setParams({ limit: newLimit, page: 1 })}
          >
            {!isLoading && !isError && organizations.length > 0 && <PaginationControls />}
          </PaginationProvider>
        )}
      </motion.div>

      <AdminOrganizationDetailModal
        organization={selectedOrg}
        onClose={() => setSelectedOrg(null)}
        onRequestApprove={openApproveModal}
        onRequestSuspend={openSuspendModal}
        onRequestActivate={openActivateModal}
      />

      <AdminOrganizationSuspendModal
        organization={suspendTarget}
        isSubmitting={suspendMutation.isPending}
        onClose={() => setSuspendTarget(null)}
        onConfirm={(id) => suspendMutation.mutate(id, { onSuccess: () => setSuspendTarget(null) })}
      />
      <AdminOrganizationApproveModal
        organization={approveTarget}
        isSubmitting={approveMutation.isPending}
        onClose={() => setApproveTarget(null)}
        onConfirm={(id) => approveMutation.mutate(id, { onSuccess: () => setApproveTarget(null) })}
      />
      <AdminOrganizationActivateModal
        organization={activateTarget}
        isSubmitting={activateMutation.isPending}
        onClose={() => setActivateTarget(null)}
        onConfirm={(id) =>
          activateMutation.mutate(id, { onSuccess: () => setActivateTarget(null) })
        }
      />
    </div>
  );
}
