import React from 'react';

export function OrganizationsEmptyState({
  hasFilters,
}: {
  hasFilters: boolean;
}): React.JSX.Element {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-5 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <i className="ti ti-building-off text-xl text-muted-foreground" aria-hidden="true" />
      </div>

      <h3 className="text-sm font-semibold text-foreground">
        {hasFilters ? 'No organizations found' : 'No organizations yet'}
      </h3>

      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        {hasFilters
          ? 'Try adjusting your search or filters to find organizations.'
          : 'There are currently no organizations in the system.'}
      </p>
    </div>
  );
}
