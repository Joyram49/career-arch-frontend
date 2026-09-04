'use client';

import { motion, type Variants } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import {
  type IAdminUserListItem,
  type IAdminUsersFilters,
} from '@app-types/admin/admin.dashboard.users';
import { PaginationControls } from '@components/shared/pagination-controls';
import { useDebounce } from '@hooks/use-debounce';
import { APIKit } from '@lib/axios';
import { PaginationProvider } from '@providers/pagination-provider';
import { useQueryParamsContext } from '@providers/query-params-provider';
import { useActivateUser, useSuspendUser } from '@queries/admin/use-admin-users';
import { useQuery } from '@tanstack/react-query';
import { type AdminUsersQueryParams } from '@validations/admin.dashboard.schema';

import { AdminPageHeader } from '../../_components/shared';
import { AdminUserArchiveModal } from './admin-user-archive-modal';
import { AdminUserDetailModal } from './admin-user-detail-modal';
import { AdminUserStatusModal, type UserStatusAction } from './admin-user-status-modal';
import { AdminUsersFilters } from './admin-users-filters';
import { AdminUsersTable } from './admin-users-table';

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function AdminUsersContainer(): React.JSX.Element {
  const [selectedUser, setSelectedUser] = useState<IAdminUserListItem | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<IAdminUserListItem | null>(null);
  const [statusTarget, setStatusTarget] = useState<IAdminUserListItem | null>(null);
  const [statusAction, setStatusAction] = useState<UserStatusAction | null>(null);

  const { params, setParam, setParams } = useQueryParamsContext<AdminUsersQueryParams>();
  const { page, limit, search, isActive, plan, sortBy, sortOrder } = params;

  const [searchInput, setSearchInput] = useState(search ?? '');
  const isFirstSearchRender = useRef(true);
  const debouncedSearch = useDebounce(searchInput, 500);

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

  const suspendMutation = useSuspendUser();
  const activateMutation = useActivateUser();

  useEffect(() => {
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false;
      return;
    }
    setParams({ search: debouncedSearch || undefined, page: 1 });
  }, [debouncedSearch, setParams]);

  const handleStatusFilterChange = (value: string): void => {
    setParams({
      isActive: value === 'active' ? true : value === 'suspended' ? false : undefined,
      page: 1,
    });
  };

  const handlePlanChange = (value: string): void => {
    setParams({
      plan: value ? (value.toUpperCase() as IAdminUsersFilters['plan']) : undefined,
      page: 1,
    });
  };

  const handleSortChange = (
    nextSortBy: IAdminUsersFilters['sortBy'] | undefined,
    nextSortOrder: 'asc' | 'desc' | undefined,
  ): void => {
    setParams({ sortBy: nextSortBy, sortOrder: nextSortOrder, page: 1 });
  };

  const openStatusModal = (user: IAdminUserListItem, action: UserStatusAction): void => {
    setStatusTarget(user);
    setStatusAction(action);
    setSelectedUser(null);
  };

  const closeStatusModal = (): void => {
    setStatusTarget(null);
    setStatusAction(null);
  };

  const handleConfirmStatusChange = (reason?: string): void => {
    if (!statusTarget || !statusAction) return;

    const mutation = statusAction === 'suspend' ? suspendMutation : activateMutation;
    mutation.mutate({ id: statusTarget.id, reason }, { onSuccess: closeStatusModal });
  };

  const hasFilters = Boolean(search) || isActive !== undefined || Boolean(plan);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Users"
        description="Manage job seekers — suspend or archive accounts (archived users auto-delete after 30 days)"
      />

      <AdminUsersFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        statusValue={isActive === true ? 'active' : isActive === false ? 'suspended' : ''}
        onStatusChange={handleStatusFilterChange}
        planValue={plan?.toLowerCase() ?? ''}
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
        <AdminUsersTable
          users={users}
          isLoading={isLoading}
          isError={isError}
          hasFilters={hasFilters}
          limit={limit}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onRetry={refetch}
          onView={setSelectedUser}
          onSuspend={(user) => openStatusModal(user, 'suspend')}
          onActivate={(user) => openStatusModal(user, 'activate')}
          onArchive={setArchiveTarget}
          activatingId={activateMutation.isPending ? activateMutation.variables?.id : undefined}
        />

        {meta && (
          <PaginationProvider
            page={page}
            limit={limit}
            total={meta.total}
            onPageChange={(newPage) => setParam('page', newPage)}
            onLimitChange={(newLimit) => setParams({ limit: newLimit, page: 1 })}
          >
            {!isLoading && !isError && users.length > 0 && <PaginationControls />}
          </PaginationProvider>
        )}
      </motion.div>

      <AdminUserDetailModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onSuspend={(user) => openStatusModal(user, 'suspend')}
        onArchive={setArchiveTarget}
      />

      <AdminUserStatusModal
        action={statusAction}
        userName={statusTarget?.profile?.firstName ?? ''}
        isLoading={suspendMutation.isPending || activateMutation.isPending}
        onOpenChange={(open) => !open && closeStatusModal()}
        onConfirm={handleConfirmStatusChange}
      />

      <AdminUserArchiveModal
        user={archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={() => {
          // TODO: wire once a backend archive endpoint exists for users
          setArchiveTarget(null);
        }}
      />
    </div>
  );
}
