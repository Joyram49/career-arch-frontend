// ─────────────────────────────────────────────────────────────
// Shared admin UI sub-components
// All use CSS vars — no dark: prefixes
// ─────────────────────────────────────────────────────────────

import { cn } from '@lib/utils';
import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';

// ── AdminPageHeader ───────────────────────────────────────────
interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}
export function AdminPageHeader({
  title,
  description,
  actions,
}: AdminPageHeaderProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div>
        <h1 className="text-base font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ── AdminStatCard ─────────────────────────────────────────────
type AccentKey = 'sky' | 'emerald' | 'amber' | 'red' | 'purple' | 'slate';

const ACCENT: Record<AccentKey, { icon: string; text: string }> = {
  sky: { icon: 'bg-brand-sky/15', text: 'text-brand-sky' },
  emerald: { icon: 'bg-brand-emerald/15', text: 'text-brand-emerald' },
  amber: { icon: 'bg-brand-amber/15', text: 'text-brand-amber' },
  red: { icon: 'bg-brand-red/15', text: 'text-brand-red' },
  purple: { icon: 'bg-purple-500/15', text: 'text-purple-500' },
  slate: { icon: 'bg-slate-500/15', text: 'text-slate-400' },
};

interface AdminStatCardProps {
  label: string;
  value: string | number;
  trend?: { value: string; direction: 'up' | 'down' | 'neutral' };
  icon?: string;
  accent?: AccentKey;
  className?: string;
}
export function AdminStatCard({
  label,
  value,
  trend,
  icon,
  accent = 'sky',
  className,
}: AdminStatCardProps): React.JSX.Element {
  const c = ACCENT[accent];
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-card',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{value}</p>
          {trend && (
            <p
              className={cn(
                'mt-0.5 text-[11px] font-medium',
                trend.direction === 'up' && 'text-status-hired',
                trend.direction === 'down' && 'text-status-rejected',
                trend.direction === 'neutral' && 'text-muted-foreground',
              )}
            >
              {trend.direction === 'up' && '↑ '}
              {trend.direction === 'down' && '↓ '}
              {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', c.icon)}
          >
            <i className={cn('ti text-[18px]', icon, c.text)} aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
}

// ── StatusBadge ───────────────────────────────────────────────
type StatusType =
  | 'active'
  | 'suspended'
  | 'archived'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'draft'
  | 'closed'
  | 'paid'
  | 'overdue'
  | 'disputed'
  | 'waived'
  | 'basic'
  | 'premium'
  | 'free'
  | 'succeeded'
  | 'failed'
  | 'refunded';

const STATUS_STYLES: Record<StatusType, string> = {
  active: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  approved: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  published: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  paid: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  succeeded: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  suspended: 'bg-red-500/10 text-red-700 border-red-200',
  rejected: 'bg-red-500/10 text-red-700 border-red-200',
  overdue: 'bg-red-500/10 text-red-700 border-red-200',
  failed: 'bg-red-500/10 text-red-700 border-red-200',
  pending: 'bg-amber-500/10 text-amber-700 border-amber-200',
  disputed: 'bg-amber-500/10 text-amber-700 border-amber-200',
  archived: 'bg-slate-500/10 text-slate-500 border-slate-200',
  closed: 'bg-slate-500/10 text-slate-500 border-slate-200',
  draft: 'bg-slate-500/10 text-slate-500 border-slate-200',
  waived: 'bg-slate-500/10 text-slate-500 border-slate-200',
  refunded: 'bg-purple-500/10 text-purple-700 border-purple-200',
  basic: 'bg-sky-500/10 text-sky-700 border-sky-200',
  premium: 'bg-amber-500/10 text-amber-700 border-amber-200',
  free: 'bg-slate-500/10 text-slate-500 border-slate-200',
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}
export function StatusBadge({ status, className }: StatusBadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
        STATUS_STYLES[status],
        className,
      )}
    >
      {status}
    </span>
  );
}

// ── ArchiveConfirmDialog ──────────────────────────────────────
interface ArchiveConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: 'archive' | 'suspend' | 'danger';
}
export function ArchiveConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Archive',
  onConfirm,
  isLoading,
  variant = 'archive',
}: ArchiveConfirmDialogProps): React.JSX.Element {
  const btnClass =
    variant === 'danger'
      ? 'bg-brand-red text-white hover:bg-brand-red/90'
      : variant === 'suspend'
        ? 'bg-amber-500 text-white hover:bg-amber-600'
        : 'bg-slate-700 text-white hover:bg-slate-800';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>
        {variant === 'archive' && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            <strong>Note:</strong> This action is reversible. Archived records will be automatically
            hard-deleted by a background cron after the retention period.
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            className={cn('cursor-pointer', btnClass)}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing…
              </span>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── SearchFilterBar ───────────────────────────────────────────
interface SearchFilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (v: string) => void;
  children?: React.ReactNode; // additional filter selects
}
export function SearchFilterBar({
  searchPlaceholder = 'Search…',
  searchValue,
  onSearchChange,
  children,
}: SearchFilterBarProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border bg-card px-6 py-3">
      <div className="relative flex-1">
        <i
          className="ti ti-search pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 w-full min-w-45 rounded-lg border border-border bg-input pr-3 pl-8 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
        />
      </div>
      {children}
    </div>
  );
}

// ── FilterSelect ──────────────────────────────────────────────
interface FilterSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
}
export function FilterSelect({
  value,
  onChange,
  options,
  placeholder = 'All',
}: FilterSelectProps): React.JSX.Element {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
      aria-label={placeholder}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ── Pagination ────────────────────────────────────────────────
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  total: number;
  perPage: number;
}
export function AdminPagination({
  page,
  totalPages,
  onPageChange,
  total,
  perPage,
}: PaginationProps): React.JSX.Element {
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  return (
    <div className="flex items-center justify-between border-t border-border px-6 py-3">
      <span className="text-xs text-muted-foreground">
        Showing {from}–{to} of {total} results
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-sm text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <i className="ti ti-chevron-left text-sm" aria-hidden="true" />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={cn(
                'flex size-8 items-center justify-center rounded-lg border text-sm font-medium transition',
                p === page
                  ? 'border-brand-sky bg-brand-sky text-white'
                  : 'border-border bg-card text-foreground hover:bg-muted',
              )}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-sm text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <i className="ti ti-chevron-right text-sm" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
