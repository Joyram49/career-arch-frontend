'use client';

import { FilterSelect, SearchFilterBar } from '../../_components/shared';

interface AdminTransactionsFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  typeValue: string;
  onTypeChange: (value: string) => void;
  statusValue: string;
  onStatusChange: (value: string) => void;
}

export function AdminTransactionsFilters({
  searchValue,
  onSearchChange,
  typeValue,
  onTypeChange,
  statusValue,
  onStatusChange,
}: AdminTransactionsFiltersProps): React.JSX.Element {
  return (
    <SearchFilterBar
      searchPlaceholder="Search by name, email, or description…"
      searchValue={searchValue}
      onSearchChange={onSearchChange}
    >
      <FilterSelect
        value={typeValue}
        onChange={onTypeChange}
        placeholder="All Types"
        options={[
          { label: 'Subscription', value: 'SUBSCRIPTION' },
          { label: 'Incentive', value: 'INCENTIVE' },
          { label: 'Refund', value: 'REFUND' },
          { label: 'Other', value: 'OTHER' },
        ]}
      />
      <FilterSelect
        value={statusValue}
        onChange={onStatusChange}
        placeholder="All Statuses"
        options={[
          { label: 'Succeeded', value: 'SUCCEEDED' },
          { label: 'Pending', value: 'PENDING' },
          { label: 'Failed', value: 'FAILED' },
          { label: 'Refunded', value: 'REFUNDED' },
        ]}
      />
    </SearchFilterBar>
  );
}
