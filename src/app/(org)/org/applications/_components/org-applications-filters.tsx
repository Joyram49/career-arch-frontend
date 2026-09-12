'use client';

import { useOrgJobOptions } from '@queries/org/use-org-applications';

import type { ApplicationStatus } from '@app-types/org/org.applications';

const STATUS_OPTIONS: { label: string; value: ApplicationStatus }[] = [
  { label: 'Applied', value: 'PENDING' },
  { label: 'Under Review', value: 'UNDER_REVIEW' },
  { label: 'Shortlisted', value: 'SHORTLISTED' },
  { label: 'Interview', value: 'INTERVIEW_SCHEDULED' },
  { label: 'Offered', value: 'OFFERED' },
  { label: 'Hired', value: 'HIRED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Withdrawn', value: 'WITHDRAWN' },
];

interface OrgApplicationsFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  jobId: string;
  onJobChange: (value: string) => void;
  statusValue: string;
  onStatusChange: (value: string) => void;
  showStatusFilter: boolean;
}

export function OrgApplicationsFilters({
  searchValue,
  onSearchChange,
  jobId,
  onJobChange,
  statusValue,
  onStatusChange,
  showStatusFilter,
}: OrgApplicationsFiltersProps): React.JSX.Element {
  const { data: jobs } = useOrgJobOptions();

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border bg-card px-6 py-3">
      <div className="relative flex-1">
        <i
          className="ti ti-search pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search by candidate name…"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 w-full min-w-45 rounded-lg border border-border bg-input pr-3 pl-8 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
        />
      </div>

      <select
        value={jobId}
        onChange={(e) => onJobChange(e.target.value)}
        className="h-9 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
        aria-label="Filter by job"
      >
        <option value="">All Jobs</option>
        {jobs?.map((j) => (
          <option key={j.id} value={j.id}>
            {j.title}
          </option>
        ))}
      </select>

      {showStatusFilter && (
        <select
          value={statusValue}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-9 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
