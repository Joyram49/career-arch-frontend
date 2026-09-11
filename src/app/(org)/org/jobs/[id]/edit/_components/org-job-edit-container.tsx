'use client';

import { useOrgJobDetail } from '@queries/org/use-org-job-detail';
import Link from 'next/link';

import { OrgPageHeader } from '../../../../_components/shared';
import { mapJobDetailToFormInput } from '../../../_components/job-form/map-job-detail-to-form';
import { OrgJobForm } from '../../../_components/job-form/org-job-form';
import { OrgJobEditError } from './org-job-edit-error';
import { OrgJobEditNotEditable } from './org-job-edit-not-editable';
import { OrgJobEditSkeleton } from './org-job-edit-skeleton';

const EDITABLE_STATUSES = ['DRAFT', 'PUBLISHED'] as const;

function isEditable(status: string): status is 'DRAFT' | 'PUBLISHED' {
  return (EDITABLE_STATUSES as readonly string[]).includes(status);
}

interface OrgJobEditContainerProps {
  jobId: string;
}

export default function OrgJobEditContainer({
  jobId,
}: OrgJobEditContainerProps): React.JSX.Element {
  const { data: job, isLoading, isError, refetch } = useOrgJobDetail(jobId);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <OrgPageHeader
        title="Edit Job"
        description={job ? `Editing "${job.title}"` : 'Loading job details…'}
      />

      <div className="flex flex-1 flex-col overflow-hidden p-6">
        <Link
          href={`/org/jobs/${jobId}`}
          className="mb-4 flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <i className="ti ti-chevron-left text-sm" aria-hidden="true" />
          Back to Job Details
        </Link>

        {isLoading ? (
          <OrgJobEditSkeleton />
        ) : isError || !job ? (
          <OrgJobEditError onRetry={refetch} jobId={jobId} />
        ) : !isEditable(job.status) ? (
          <OrgJobEditNotEditable job={job} />
        ) : (
          <OrgJobForm
            mode="edit"
            jobId={jobId}
            currentStatus={job.status}
            initialValues={mapJobDetailToFormInput(job)}
          />
        )}
      </div>
    </div>
  );
}
