'use client';

import type {
  AdminJobDeadlineStatus,
  AdminJobStatus,
  AdminJobType,
} from '@app-types/admin/admin.dashboard.jobs';
import { FilterSelect, SearchFilterBar } from '../../_components/shared';

interface AdminJobsFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusValue: AdminJobStatus | '';
  onStatusChange: (value: string) => void;
  jobTypeValue: AdminJobType | '';
  onJobTypeChange: (value: string) => void;
  categoryValue: string;
  onCategoryChange: (value: string) => void;
  deadlineValue: AdminJobDeadlineStatus;
  onDeadlineChange: (value: string) => void;
  salaryMin: number;
  salaryMax: number;
  onSalaryMinChange: (value: number) => void;
  onSalaryMaxChange: (value: number) => void;
}

export function AdminJobsFilters({
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
  jobTypeValue,
  onJobTypeChange,
  categoryValue,
  onCategoryChange,
  deadlineValue,
  onDeadlineChange,
  salaryMin,
  salaryMax,
  onSalaryMinChange,
  onSalaryMaxChange,
}: AdminJobsFiltersProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2 border-b border-border bg-card px-6 py-3">
      <SearchFilterBar
        searchPlaceholder="Search by title, company, or category…"
        searchValue={searchValue}
        onSearchChange={onSearchChange}
      >
        <FilterSelect
          value={statusValue}
          onChange={onStatusChange}
          placeholder="All Statuses"
          options={[
            { label: 'Draft', value: 'DRAFT' },
            { label: 'Published', value: 'PUBLISHED' },
            { label: 'Closed', value: 'CLOSED' },
            { label: 'Archived', value: 'ARCHIVED' },
          ]}
        />
        <FilterSelect
          value={jobTypeValue}
          onChange={onJobTypeChange}
          placeholder="All Job Types"
          options={[
            { label: 'Full Time', value: 'FULL_TIME' },
            { label: 'Part Time', value: 'PART_TIME' },
            { label: 'Contract', value: 'CONTRACT' },
            { label: 'Internship', value: 'INTERNSHIP' },
            { label: 'Freelance', value: 'FREELANCE' },
            { label: 'Remote', value: 'REMOTE' },
          ]}
        />
        <FilterSelect
          value={deadlineValue === 'all' ? '' : deadlineValue}
          onChange={(v) => onDeadlineChange(v || 'all')}
          placeholder="All Deadlines"
          options={[
            { label: 'Active (not expired)', value: 'active' },
            { label: 'Expired', value: 'expired' },
          ]}
        />
      </SearchFilterBar>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Category…"
          value={categoryValue}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="h-9 w-40 rounded-lg border border-border bg-input px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
        />

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">Salary</span>
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={salaryMin || ''}
            onChange={(e) => onSalaryMinChange(Number(e.target.value) || 0)}
            className="h-9 w-24 rounded-lg border border-border bg-input px-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
          />
          <span className="text-xs text-muted-foreground">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={salaryMax === 10_000_000 ? '' : salaryMax}
            onChange={(e) =>
              onSalaryMaxChange(e.target.value ? Number(e.target.value) : 10_000_000)
            }
            className="h-9 w-24 rounded-lg border border-border bg-input px-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
