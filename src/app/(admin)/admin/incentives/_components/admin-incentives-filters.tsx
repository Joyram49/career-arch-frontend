'use client';

import { FilterSelect, SearchFilterBar } from '../../_components/shared';

interface AdminIncentivesFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusValue: string;
  onStatusChange: (value: string) => void;
}

export function AdminIncentivesFilters({
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
}: AdminIncentivesFiltersProps): React.JSX.Element {
  return (
    <SearchFilterBar
      searchPlaceholder="Search by organization or candidate name…"
      searchValue={searchValue}
      onSearchChange={onSearchChange}
    >
      <FilterSelect
        value={statusValue}
        onChange={onStatusChange}
        placeholder="All Statuses"
        options={[
          { label: 'Pending', value: 'PENDING' },
          { label: 'Overdue', value: 'OVERDUE' },
          { label: 'Disputed', value: 'DISPUTED' },
          { label: 'Paid', value: 'PAID' },
          { label: 'Waived', value: 'WAIVED' },
        ]}
      />
    </SearchFilterBar>
  );
}
