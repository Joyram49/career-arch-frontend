'use client';

import { FilterSelect, SearchFilterBar } from '../../_components/shared';
import { jobTypeLabel } from './job-format.utils';

import type { OrgJobType } from '@app-types/org/org.jobs';

const JOB_TYPE_OPTIONS: OrgJobType[] = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'INTERNSHIP',
  'FREELANCE',
  'REMOTE',
];

interface OrgJobsFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  jobTypeValue: string;
  onJobTypeChange: (value: string) => void;
}

export function OrgJobsFilters({
  searchValue,
  onSearchChange,
  jobTypeValue,
  onJobTypeChange,
}: OrgJobsFiltersProps): React.JSX.Element {
  return (
    <SearchFilterBar
      searchPlaceholder="Search by job title…"
      searchValue={searchValue}
      onSearchChange={onSearchChange}
    >
      <FilterSelect
        value={jobTypeValue}
        onChange={onJobTypeChange}
        placeholder="All Job Types"
        options={JOB_TYPE_OPTIONS.map((t) => ({ label: jobTypeLabel(t), value: t }))}
      />
    </SearchFilterBar>
  );
}
