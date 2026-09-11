import { Button } from '@ui/button';
import Link from 'next/link';

import type { IOrgJobDetail } from '@app-types/org/org.job-detail';

const REASON: Record<'CLOSED' | 'ARCHIVED', string> = {
  CLOSED:
    'This job is closed and no longer accepting applications. Editing is disabled — you can still view its applications, or archive it.',
  ARCHIVED:
    'This job is archived. Restore it from the Archived tab in Job Listings before editing.',
};

interface OrgJobEditNotEditableProps {
  job: IOrgJobDetail;
}

export function OrgJobEditNotEditable({ job }: OrgJobEditNotEditableProps): React.JSX.Element {
  const reason = job.status === 'CLOSED' ? REASON.CLOSED : REASON.ARCHIVED;

  return (
    <div className="flex min-h-96 flex-col items-center justify-center rounded-xl border border-border bg-card px-5 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-amber-100">
        <i className="ti ti-lock text-xl text-amber-600" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">Can&apos;t edit this job</h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{reason}</p>
      <Button asChild size="sm" className="mt-4 bg-brand-sky text-white hover:bg-brand-sky/90">
        <Link href={`/org/jobs/${job.id}`}>Back to Job Details</Link>
      </Button>
    </div>
  );
}
