'use client';

import { motion, type Variants } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import type {
  AdminJobDeadlineStatus,
  AdminJobStatus,
  AdminJobType,
  IAdminJobListItem,
} from '@app-types/admin/admin.dashboard.jobs';
import { PaginationControls } from '@components/shared/pagination-controls';
import { useDebounce } from '@hooks/use-debounce';
import { APIKit } from '@lib/axios';
import { PaginationProvider } from '@providers/pagination-provider';
import { useQueryParamsContext } from '@providers/query-params-provider';
import { useArchiveJob, useRepublishJob, useTakedownJob } from '@queries/admin/use-admin-jobs';
import { useQuery } from '@tanstack/react-query';
import type { AdminJobsQueryParams } from '@validations/admin.dashboard.schema';

import { AdminPageHeader } from '../../_components/shared';
import { AdminJobActionModal, type JobAction } from './admin-job-action-modal';
import { AdminJobDetailModal } from './admin-job-detail-modal';
import { AdminJobsFilters } from './admin-jobs-filters';
import { AdminJobsTable } from './admin-jobs-table';

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function AdminJobsContainer(): React.JSX.Element {
  const [selectedJob, setSelectedJob] = useState<IAdminJobListItem | null>(null);
  const [actionTarget, setActionTarget] = useState<IAdminJobListItem | null>(null);
  const [action, setAction] = useState<JobAction | null>(null);

  const { params, setParam, setParams } = useQueryParamsContext<AdminJobsQueryParams>();
  const {
    page,
    limit,
    search,
    status,
    jobType,
    category,
    salaryMin,
    salaryMax,
    deadlineStatus,
    sortBy,
    sortOrder,
  } = params;

  const [searchInput, setSearchInput] = useState(search ?? '');
  const isFirstSearchRender = useRef(true);
  const debouncedSearch = useDebounce(searchInput, 500);

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['admin-jobs', params],
    queryFn: async () => {
      const response = await APIKit.admin.jobs.getAll(params);
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const jobs = data?.data?.jobs ?? [];
  const meta = data?.meta;

  const takedownMutation = useTakedownJob();
  const republishMutation = useRepublishJob();
  const archiveMutation = useArchiveJob();

  useEffect(() => {
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false;
      return;
    }
    setParams({ search: debouncedSearch || undefined, page: 1 });
  }, [debouncedSearch, setParams]);

  const handleStatusChange = (value: string): void => {
    setParams({ status: (value || undefined) as AdminJobStatus | undefined, page: 1 });
  };

  const handleJobTypeChange = (value: string): void => {
    setParams({ jobType: (value || undefined) as AdminJobType | undefined, page: 1 });
  };

  const handleCategoryChange = (value: string): void => {
    setParams({ category: value || undefined, page: 1 });
  };

  const handleDeadlineChange = (value: string): void => {
    setParams({ deadlineStatus: (value || 'all') as AdminJobDeadlineStatus, page: 1 });
  };

  const handleSalaryMinChange = (value: number): void => {
    setParams({ salaryMin: value, page: 1 });
  };

  const handleSalaryMaxChange = (value: number): void => {
    setParams({ salaryMax: value, page: 1 });
  };

  const handleSortChange = (
    nextSortBy: AdminJobsQueryParams['sortBy'] | undefined,
    nextSortOrder: 'asc' | 'desc' | undefined,
  ): void => {
    setParams({
      sortBy: nextSortBy ?? 'createdAt',
      sortOrder: nextSortOrder ?? 'desc',
      page: 1,
    });
  };

  const openAction = (job: IAdminJobListItem, nextAction: JobAction): void => {
    setActionTarget(job);
    setAction(nextAction);
    setSelectedJob(null);
  };

  const closeAction = (): void => {
    setActionTarget(null);
    setAction(null);
  };

  const handleConfirmAction = (reason?: string): void => {
    if (!actionTarget || !action) return;

    if (action === 'takedown') {
      // reason is required and validated in the modal before this fires
      takedownMutation.mutate(
        { id: actionTarget.id, reason: reason ?? '' },
        { onSuccess: closeAction },
      );
    } else if (action === 'republish') {
      republishMutation.mutate(actionTarget.id, { onSuccess: closeAction });
    } else {
      archiveMutation.mutate({ id: actionTarget.id, reason }, { onSuccess: closeAction });
    }
  };

  const hasFilters =
    Boolean(search) ||
    status !== undefined ||
    jobType !== undefined ||
    Boolean(category) ||
    deadlineStatus !== 'all' ||
    salaryMin > 0 ||
    salaryMax < 10_000_000;

  const isActionLoading =
    takedownMutation.isPending || republishMutation.isPending || archiveMutation.isPending;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Jobs"
        description="Review and moderate job listings. Archived jobs are soft-deleted and auto-purged after 30 days."
      />

      <AdminJobsFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        statusValue={status ?? ''}
        onStatusChange={handleStatusChange}
        jobTypeValue={jobType ?? ''}
        onJobTypeChange={handleJobTypeChange}
        categoryValue={category ?? ''}
        onCategoryChange={handleCategoryChange}
        deadlineValue={deadlineStatus}
        onDeadlineChange={handleDeadlineChange}
        salaryMin={salaryMin}
        salaryMax={salaryMax}
        onSalaryMinChange={handleSalaryMinChange}
        onSalaryMaxChange={handleSalaryMaxChange}
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
        <AdminJobsTable
          jobs={jobs}
          isLoading={isLoading}
          isError={isError}
          hasFilters={hasFilters}
          limit={limit}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onRetry={refetch}
          onView={setSelectedJob}
          onTakedown={(job) => openAction(job, 'takedown')}
          onRepublish={(job) => openAction(job, 'republish')}
          onArchive={(job) => openAction(job, 'archive')}
          republishingId={republishMutation.isPending ? republishMutation.variables : undefined}
        />

        {meta && (
          <PaginationProvider
            page={page}
            limit={limit}
            total={meta.total}
            onPageChange={(newPage) => setParam('page', newPage)}
            onLimitChange={(newLimit) => setParams({ limit: newLimit, page: 1 })}
          >
            {!isLoading && !isError && jobs.length > 0 && <PaginationControls />}
          </PaginationProvider>
        )}
      </motion.div>

      <AdminJobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />

      <AdminJobActionModal
        action={action}
        job={actionTarget}
        isLoading={isActionLoading}
        onOpenChange={(open) => !open && closeAction()}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
