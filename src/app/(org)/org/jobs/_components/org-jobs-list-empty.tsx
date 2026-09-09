import { Button } from '@ui/button';
import Link from 'next/link';

import type { OrgJobStatus } from '@app-types/org/org.jobs';

const COPY: Record<'default' | OrgJobStatus, { title: string; body: string }> = {
  default: {
    title: 'No job listings found',
    body: 'Try adjusting your search or filters.',
  },
  DRAFT: {
    title: 'No drafts yet',
    body: 'Start creating a job — it will be saved here until you publish it.',
  },
  PUBLISHED: {
    title: 'No published jobs',
    body: 'Publish a draft or post a new job to start receiving applications.',
  },
  CLOSED: {
    title: 'No closed jobs',
    body: 'Jobs you close after their hiring round ends will show up here.',
  },
  ARCHIVED: {
    title: 'Trash is empty',
    body: 'Archived job listings will appear here before they auto-delete.',
  },
};

interface OrgJobsListEmptyProps {
  status?: OrgJobStatus;
  hasFilters: boolean;
}

export function OrgJobsListEmpty({ status, hasFilters }: OrgJobsListEmptyProps): React.JSX.Element {
  const copy = hasFilters ? COPY.default : status ? COPY[status] : COPY.PUBLISHED;

  return (
    <div className="mx-6 flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border px-5 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <i className="ti ti-briefcase-off text-xl text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{copy.title}</h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{copy.body}</p>
      {!hasFilters && status !== 'ARCHIVED' && (
        <Button asChild size="sm" className="mt-4 bg-brand-sky text-white hover:bg-brand-sky/90">
          <Link href="/org/jobs/new">
            <i className="ti ti-plus mr-1.5" aria-hidden="true" />
            Post a Job
          </Link>
        </Button>
      )}
    </div>
  );
}
