'use client';

import type { IOrgJobListItem, OrgJobStatus } from '@app-types/org/org.jobs';

import { OrgJobCard } from './org-job-card';
import { OrgJobsListEmpty } from './org-jobs-list-empty';
import { OrgJobsListError } from './org-jobs-list-error';
import { OrgJobsListSkeleton } from './org-jobs-list-skeleton';

interface OrgJobsListProps {
  jobs: IOrgJobListItem[];
  isLoading: boolean;
  isError: boolean;
  activeStatus?: OrgJobStatus;
  hasFilters: boolean;
  limit: number;
  busyId?: string;
  onRetry: () => void;
  onPublish: (job: IOrgJobListItem) => void;
  onClose: (job: IOrgJobListItem) => void;
  onArchive: (job: IOrgJobListItem) => void;
  onRestore: (job: IOrgJobListItem) => void;
}

export function OrgJobsList({
  jobs,
  isLoading,
  isError,
  activeStatus,
  hasFilters,
  limit,
  busyId,
  onRetry,
  onPublish,
  onClose,
  onArchive,
  onRestore,
}: OrgJobsListProps): React.JSX.Element {
  if (isLoading) return <OrgJobsListSkeleton count={limit} />;
  if (isError) return <OrgJobsListError onRetry={onRetry} />;
  if (jobs.length === 0) return <OrgJobsListEmpty status={activeStatus} hasFilters={hasFilters} />;

  return (
    <div className="grid grid-cols-1 gap-3 px-6 lg:grid-cols-2">
      {jobs.map((job) => (
        <OrgJobCard
          key={job.id}
          job={job}
          isBusy={busyId === job.id}
          onPublish={onPublish}
          onClose={onClose}
          onArchive={onArchive}
          onRestore={onRestore}
        />
      ))}
    </div>
  );
}
