import { Button } from '@ui/button';

export function UsersErrorState({ onRetry }: { onRetry: () => void }): React.JSX.Element {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-5 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <i className="ti ti-alert-circle text-xl text-destructive" aria-hidden="true" />
      </div>

      <h3 className="text-sm font-semibold text-foreground">Failed to load users</h3>

      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Something went wrong while retrieving the users. Please try again.
      </p>

      <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
        <i className="ti ti-refresh mr-1.5" aria-hidden="true" />
        Try again
      </Button>
    </div>
  );
}
