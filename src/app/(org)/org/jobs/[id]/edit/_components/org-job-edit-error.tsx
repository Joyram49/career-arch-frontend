import { Button } from '@ui/button';
import Link from 'next/link';

interface OrgJobEditErrorProps {
  onRetry: () => void;
  jobId: string;
}

export function OrgJobEditError({ onRetry, jobId }: OrgJobEditErrorProps): React.JSX.Element {
  return (
    <div className="flex min-h-96 flex-col items-center justify-center rounded-xl border border-border bg-card px-5 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <i className="ti ti-alert-circle text-xl text-destructive" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">Couldn&apos;t load this job</h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        It may have been removed, or something went wrong while retrieving it.
      </p>
      <div className="mt-4 flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRetry}>
          <i className="ti ti-refresh mr-1.5" aria-hidden="true" />
          Try again
        </Button>
        <Button asChild size="sm" className="bg-brand-sky text-white hover:bg-brand-sky/90">
          <Link href={`/org/jobs/${jobId}`}>Back to Job Details</Link>
        </Button>
      </div>
    </div>
  );
}
