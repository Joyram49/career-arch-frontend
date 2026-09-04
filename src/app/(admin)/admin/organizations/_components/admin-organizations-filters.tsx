'use client';

import { FilterSelect, SearchFilterBar } from '../../_components/shared';

interface AdminOrganizationsFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  isApproved: boolean | undefined;
  onApprovalChange: (value: string) => void;
  isActive: boolean | undefined;
  onStatusChange: (value: string) => void;
  hasUnpaidIncentives: boolean | undefined;
  onIncentivesChange: (value: string) => void;
}

export function AdminOrganizationsFilters({
  searchValue,
  onSearchChange,
  isApproved,
  onApprovalChange,
  isActive,
  onStatusChange,
  hasUnpaidIncentives,
  onIncentivesChange,
}: AdminOrganizationsFiltersProps): React.JSX.Element {
  return (
    <SearchFilterBar
      searchPlaceholder="Search by name, email, or location…"
      searchValue={searchValue}
      onSearchChange={onSearchChange}
    >
      <FilterSelect
        value={isApproved === true ? 'approved' : isApproved === false ? 'pending' : ''}
        onChange={onApprovalChange}
        placeholder="All Approval"
        options={[
          { label: 'Approved', value: 'approved' },
          { label: 'Pending', value: 'pending' },
        ]}
      />

      <FilterSelect
        value={isActive === true ? 'active' : isActive === false ? 'suspended' : ''}
        onChange={onStatusChange}
        placeholder="All Statuses"
        options={[
          { label: 'Active', value: 'active' },
          { label: 'Suspended', value: 'suspended' },
        ]}
      />

      <FilterSelect
        value={hasUnpaidIncentives ? 'unpaid' : ''}
        onChange={onIncentivesChange}
        placeholder="All Incentives"
        options={[{ label: 'Has Unpaid Incentives', value: 'unpaid' }]}
      />
    </SearchFilterBar>
  );
}
