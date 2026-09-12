import { Button } from '@ui/button';

export function OrgIncentivesTableEmpty({
  hasFilters,
}: {
  hasFilters: boolean;
}): React.JSX.Element {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <i className="ti ti-coin-off text-xl text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">
        {hasFilters ? 'No incentives match this filter' : 'No incentives yet'}
      </h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        {hasFilters
          ? 'Try a different status filter.'
          : "A $50 incentive is created automatically each time you mark a candidate as Hired — you'll see it here."}
      </p>
    </div>
  );
}

export function OrgIncentivesTableError({ onRetry }: { onRetry: () => void }): React.JSX.Element {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <i className="ti ti-alert-circle text-xl text-destructive" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">Failed to load incentives</h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Something went wrong while retrieving your incentives. Please try again.
      </p>
      <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
        <i className="ti ti-refresh mr-1.5" aria-hidden="true" />
        Try again
      </Button>
    </div>
  );
}
