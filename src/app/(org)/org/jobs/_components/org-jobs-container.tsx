'use client';

import { useEffect, useRef, useState } from 'react';

import { PaginationControls } from '@components/shared/pagination-controls';
import { useDebounce } from '@hooks/use-debounce';
import { PaginationProvider } from '@providers/pagination-provider';
import { useQueryParamsContext } from '@providers/query-params-provider';
import {
  useArchiveJob,
  useCloseJob,
  useOrgJobsList,
  usePublishJob,
  useRestoreJob,
} from '@queries/org/use-org-jobs';
import { Button } from '@ui/button';
import Link from 'next/link';

import type { IOrgJobListItem } from '@app-types/org/org.jobs';
import type { OrgJobsQueryParams } from '@validations/org.jobs.schema';

import { OrgPageHeader } from '../../_components/shared';
import { type JobConfirmAction, OrgJobConfirmModal } from './org-job-confirm-modal';
import { OrgJobsFilters } from './org-jobs-filters';
import { OrgJobsList } from './org-jobs-list';
import { OrgJobsTabs } from './org-jobs-tabs';

export default function OrgJobsContainer(): React.JSX.Element {
  const { params, setParam, setParams } = useQueryParamsContext<OrgJobsQueryParams>();
  const { page, limit, search, status, jobType } = params;

  const [searchInput, setSearchInput] = useState(search ?? '');
  const isFirstSearchRender = useRef(true);
  const debouncedSearch = useDebounce(searchInput, 500);

  const [confirmTarget, setConfirmTarget] = useState<IOrgJobListItem | null>(null);
  const [confirmAction, setConfirmAction] = useState<JobConfirmAction | null>(null);

  const { data, isLoading, isFetching, isError, refetch } = useOrgJobsList(params);
  const jobs = data?.jobs ?? [];
  const meta = data?.meta;

  const publishMutation = usePublishJob();
  const closeMutation = useCloseJob();
  const archiveMutation = useArchiveJob();
  const restoreMutation = useRestoreJob();

  useEffect(() => {
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false;
      return;
    }
    setParams({ search: debouncedSearch || undefined, page: 1 });
  }, [debouncedSearch, setParams]);

  const openConfirm = (job: IOrgJobListItem, action: JobConfirmAction): void => {
    setConfirmTarget(job);
    setConfirmAction(action);
  };

  const closeConfirm = (): void => {
    setConfirmTarget(null);
    setConfirmAction(null);
  };

  const handleConfirm = (): void => {
    if (!confirmTarget || !confirmAction) return;
    const mutation = confirmAction === 'close' ? closeMutation : archiveMutation;
    mutation.mutate(confirmTarget.id, { onSuccess: closeConfirm });
  };

  const hasFilters = Boolean(search) || Boolean(jobType);
  const busyId = publishMutation.isPending
    ? publishMutation.variables
    : restoreMutation.isPending
      ? restoreMutation.variables
      : closeMutation.isPending
        ? closeMutation.variables
        : archiveMutation.isPending
          ? archiveMutation.variables
          : undefined;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <OrgPageHeader
        title="Job Listings"
        description="Manage every job you've posted — publish, close, or archive"
        actions={
          <Button asChild size="sm" className="bg-brand-sky text-white hover:bg-brand-sky/90">
            <Link href="/org/jobs/new">
              <i className="ti ti-plus mr-1.5" aria-hidden="true" />
              Post a Job
            </Link>
          </Button>
        }
      />

      <OrgJobsTabs activeStatus={status} onChange={(s) => setParams({ status: s, page: 1 })} />

      <OrgJobsFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        jobTypeValue={jobType ?? ''}
        onJobTypeChange={(v) =>
          setParams({ jobType: (v || undefined) as OrgJobsQueryParams['jobType'], page: 1 })
        }
      />

      <div className="flex h-8 items-center justify-end px-6 py-2">
        {isFetching && !isLoading && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <i className="ti ti-loader-2 animate-spin" aria-hidden="true" />
            Updating...
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 pb-6">
        <OrgJobsList
          jobs={jobs}
          isLoading={isLoading}
          isError={isError}
          activeStatus={status}
          hasFilters={hasFilters}
          limit={limit}
          busyId={busyId}
          onRetry={refetch}
          onPublish={(job) => publishMutation.mutate(job.id)}
          onClose={(job) => openConfirm(job, 'close')}
          onArchive={(job) => openConfirm(job, 'archive')}
          onRestore={(job) => restoreMutation.mutate(job.id)}
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
      </div>

      <OrgJobConfirmModal
        action={confirmAction}
        job={confirmTarget}
        isLoading={closeMutation.isPending || archiveMutation.isPending}
        onOpenChange={(open) => !open && closeConfirm()}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
