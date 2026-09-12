interface OrgIncentivesFiltersProps {
  statusValue: string;
  onStatusChange: (value: string) => void;
}

export function OrgIncentivesFilters({
  statusValue,
  onStatusChange,
}: OrgIncentivesFiltersProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 border-b border-border bg-card px-6 py-3">
      <select
        value={statusValue}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-9 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        <option value="PENDING">Pending</option>
        <option value="OVERDUE">Overdue</option>
        <option value="DISPUTED">Disputed</option>
        <option value="PAID">Paid</option>
        <option value="WAIVED">Waived</option>
      </select>
    </div>
  );
}
