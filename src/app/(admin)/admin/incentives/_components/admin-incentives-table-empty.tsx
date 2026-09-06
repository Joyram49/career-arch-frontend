import React from 'react';

export function IncentivesEmptyState({ hasFilters }: { hasFilters: boolean }): React.JSX.Element {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-5 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <i className="ti ti-coin-off text-xl text-muted-foreground" aria-hidden="true" />
      </div>

      <h3 className="text-sm font-semibold text-foreground">
        {hasFilters ? 'No incentives found' : 'No incentives yet'}
      </h3>

      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        {hasFilters
          ? 'Try adjusting your search or status filter to find incentives.'
          : 'Hiring incentives will appear here once organizations hire candidates.'}
      </p>
    </div>
  );
}
