'use client';

import { FilterSelect, SearchFilterBar } from '../../_components/shared';

interface AdminSubscriptionsFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusValue: string;
  onStatusChange: (value: string) => void;
  planValue: string;
  onPlanChange: (value: string) => void;
}

export function AdminSubscriptionsFilters({
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
  planValue,
  onPlanChange,
}: AdminSubscriptionsFiltersProps): React.JSX.Element {
  return (
    <SearchFilterBar
      searchPlaceholder="Search by user name or email…"
      searchValue={searchValue}
      onSearchChange={onSearchChange}
    >
      <FilterSelect
        value={statusValue}
        onChange={onStatusChange}
        placeholder="All Statuses"
        options={[
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Past Due', value: 'PAST_DUE' },
          { label: 'Cancelled', value: 'CANCELLED' },
          { label: 'Inactive', value: 'INACTIVE' },
        ]}
      />
      <FilterSelect
        value={planValue}
        onChange={onPlanChange}
        placeholder="All Plans"
        options={[
          { label: 'Basic', value: 'BASIC' },
          { label: 'Premium', value: 'PREMIUM' },
        ]}
      />
    </SearchFilterBar>
  );
}
