import { Button } from '@ui/button';

export function OrgApplicationsTableEmpty({
  hasFilters,
}: {
  hasFilters: boolean;
}): React.JSX.Element {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <i className="ti ti-inbox text-xl text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">
        {hasFilters ? 'No applications match your filters' : 'No applications yet'}
      </h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        {hasFilters
          ? 'Try adjusting your search or filters.'
          : 'Applications will appear here once candidates start applying to your jobs.'}
      </p>
    </div>
  );
}

export function OrgApplicationsTableError({ onRetry }: { onRetry: () => void }): React.JSX.Element {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <i className="ti ti-alert-circle text-xl text-destructive" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">Failed to load applications</h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Something went wrong while retrieving applications. Please try again.
      </p>
      <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
        <i className="ti ti-refresh mr-1.5" aria-hidden="true" />
        Try again
      </Button>
    </div>
  );
}
