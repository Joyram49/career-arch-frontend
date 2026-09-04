'use client';

import { FilterSelect, SearchFilterBar } from '../../_components/shared';

interface AdminUsersFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusValue: string;
  onStatusChange: (value: string) => void;
  planValue: string;
  onPlanChange: (value: string) => void;
}

export function AdminUsersFilters({
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
  planValue,
  onPlanChange,
}: AdminUsersFiltersProps): React.JSX.Element {
  return (
    <SearchFilterBar
      searchPlaceholder="Search by name or email…"
      searchValue={searchValue}
      onSearchChange={onSearchChange}
    >
      <FilterSelect
        value={statusValue}
        onChange={onStatusChange}
        placeholder="All Statuses"
        options={[
          { label: 'Active', value: 'active' },
          { label: 'Suspended', value: 'suspended' },
        ]}
      />
      <FilterSelect
        value={planValue}
        onChange={onPlanChange}
        placeholder="All Plans"
        options={[
          { label: 'Free', value: 'free' },
          { label: 'Basic', value: 'basic' },
          { label: 'Premium', value: 'premium' },
        ]}
      />
    </SearchFilterBar>
  );
}
