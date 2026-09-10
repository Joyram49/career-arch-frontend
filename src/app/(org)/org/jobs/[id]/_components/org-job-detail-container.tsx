'use client';

import { useState } from 'react';

import {
  useArchiveJob,
  useCloseJob,
  usePublishJob,
  useRestoreJob,
} from '@queries/org/use-org-jobs';
import { useOrgJobDetail } from '@queries/org/use-org-job-detail';
import Link from 'next/link';

import { type JobConfirmAction, OrgJobConfirmModal } from '../../_components/org-job-confirm-modal';
import { OrgJobApplicationFunnel } from './org-job-application-funnel';
import { OrgJobDescriptionSection } from './org-job-description-section';
import { OrgJobDetailError } from './org-job-detail-error';
import { OrgJobDetailHeader } from './org-job-detail-header';
import { OrgJobDetailSkeleton } from './org-job-detail-skeleton';
import { OrgJobDetailStats } from './org-job-detail-stats';
import { OrgJobInfoSidebar } from './org-job-info-sidebar';

interface OrgJobDetailContainerProps {
  jobId: string;
}

export default function OrgJobDetailContainer({
  jobId,
}: OrgJobDetailContainerProps): React.JSX.Element {
  const { data: job, isLoading, isError, refetch } = useOrgJobDetail(jobId);

  const [confirmAction, setConfirmAction] = useState<JobConfirmAction | null>(null);

  const publishMutation = usePublishJob();
  const closeMutation = useCloseJob();
  const archiveMutation = useArchiveJob();
  const restoreMutation = useRestoreJob();

  const isBusy =
    publishMutation.isPending ||
    closeMutation.isPending ||
    archiveMutation.isPending ||
    restoreMutation.isPending;

  const handleConfirm = (): void => {
    if (!job || !confirmAction) return;
    const mutation = confirmAction === 'close' ? closeMutation : archiveMutation;
    mutation.mutate(job.id, { onSuccess: () => setConfirmAction(null) });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
      <Link
        href="/org/jobs"
        className="flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <i className="ti ti-chevron-left text-sm" aria-hidden="true" />
        Job Listings
      </Link>

      {isLoading ? (
        <OrgJobDetailSkeleton />
      ) : isError || !job ? (
        <OrgJobDetailError onRetry={refetch} />
      ) : (
        <>
          <OrgJobDetailHeader
            job={job}
            isBusy={isBusy}
            onPublish={() => publishMutation.mutate(job.id)}
            onClose={() => setConfirmAction('close')}
            onArchive={() => setConfirmAction('archive')}
            onRestore={() => restoreMutation.mutate(job.id)}
          />

          <OrgJobDetailStats job={job} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <OrgJobDescriptionSection job={job} />
            </div>
            <div className="flex flex-col gap-4">
              <OrgJobInfoSidebar job={job} />
              <OrgJobApplicationFunnel job={job} />
            </div>
          </div>

          <OrgJobConfirmModal
            action={confirmAction}
            job={job}
            isLoading={closeMutation.isPending || archiveMutation.isPending}
            onOpenChange={(open) => !open && setConfirmAction(null)}
            onConfirm={handleConfirm}
          />
        </>
      )}
    </div>
  );
}
