import Link from 'next/link';
import { Button } from '@ui/button';

export function JobsPerformanceEmpty(): React.JSX.Element {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <i className="ti ti-briefcase-off text-xl text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">No job listings yet</h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Post your first job to start receiving applications from candidates.
      </p>
      <Button asChild size="sm" className="mt-4 bg-brand-sky text-white hover:bg-brand-sky/90">
        <Link href="/org/jobs/new">
          <i className="ti ti-plus mr-1.5" aria-hidden="true" />
          Post a Job
        </Link>
      </Button>
    </div>
  );
}
