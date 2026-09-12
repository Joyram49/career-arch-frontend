'use client';

import { PaginationControls } from '@components/shared/pagination-controls';
import { useDebounce } from '@hooks/use-debounce';
import { PaginationProvider } from '@providers/pagination-provider';
import { useQueryParamsContext } from '@providers/query-params-provider';
import { useOrgApplicationsBoard, useOrgApplicationsList } from '@queries/org/use-org-applications';
import { useEffect, useRef, useState } from 'react';

import type { OrgApplicationsQueryParams } from '@validations/org.applications.schema';

import { OrgPageHeader } from '../../_components/shared';
import { OrgApplicationDetailModal } from './org-application-detail-modal';
import { OrgApplicationsFilters } from './org-applications-filters';
import { OrgApplicationsKanbanBoard } from './org-applications-kanban-board';
import { OrgApplicationsKanbanSkeleton } from './org-applications-kanban-skeleton';
import { OrgApplicationsTable } from './org-applications-table';
import { OrgApplicationsTableError } from './org-applications-table-states';
import { OrgApplicationsViewToggle } from './org-applications-view-toggle';

export default function OrgApplicationsContainer(): React.JSX.Element {
  const { params, setParam, setParams } = useQueryParamsContext<OrgApplicationsQueryParams>();
  const { view, jobId, status, search, page, limit } = params;

  const [searchInput, setSearchInput] = useState(search ?? '');
  const isFirstSearchRender = useRef(true);
  const debouncedSearch = useDebounce(searchInput, 500);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false;
      return;
    }
    setParams({ search: debouncedSearch || undefined, page: 1 });
  }, [debouncedSearch, setParams]);

  const board = useOrgApplicationsBoard(jobId, search);
  const list = useOrgApplicationsList(params);

  const hasFilters = Boolean(search) || Boolean(status);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <OrgPageHeader
        title="Applications"
        description="Review and manage every candidate who's applied to your jobs"
        actions={
          <OrgApplicationsViewToggle
            view={view}
            onChange={(v) => setParams({ view: v, page: 1 })}
          />
        }
      />

      <OrgApplicationsFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        jobId={jobId ?? ''}
        onJobChange={(v) => setParams({ jobId: v || undefined, page: 1 })}
        statusValue={status ?? ''}
        onStatusChange={(v) =>
          setParam('status', (v || undefined) as OrgApplicationsQueryParams['status'])
        }
        showStatusFilter={view === 'list'}
      />

      {view === 'kanban' ? (
        board.isLoading ? (
          <OrgApplicationsKanbanSkeleton />
        ) : board.isError ? (
          <div className="px-6 py-10">
            <OrgApplicationsTableError onRetry={board.refetch} />
          </div>
        ) : (
          <OrgApplicationsKanbanBoard
            applications={board.data ?? []}
            onCardClick={setSelectedId}
            showJobTitle={!jobId}
          />
        )
      ) : (
        <div className="flex flex-1 flex-col gap-4 px-6 py-4">
          <OrgApplicationsTable
            applications={list.data?.applications ?? []}
            isLoading={list.isLoading}
            isError={list.isError}
            hasFilters={hasFilters}
            limit={limit}
            onRetry={list.refetch}
            onView={setSelectedId}
          />

          {list.data?.meta && (
            <PaginationProvider
              page={page}
              limit={limit}
              total={list.data.meta.total}
              onPageChange={(newPage) => setParam('page', newPage)}
              onLimitChange={(newLimit) => setParams({ limit: newLimit, page: 1 })}
            >
              {!list.isLoading && !list.isError && (list.data.applications.length ?? 0) > 0 && (
                <PaginationControls />
              )}
            </PaginationProvider>
          )}
        </div>
      )}

      <OrgApplicationDetailModal applicationId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
