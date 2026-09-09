// ─────────────────────────────────────────────────────────────
// Shared org-dashboard UI sub-components
// All use CSS vars — no dark: prefixes. Mirrors admin/_components/shared.tsx
// so future org pages (Job Listings, Applications, Incentives) stay
// visually consistent with the admin dashboard family.
// ─────────────────────────────────────────────────────────────

import { cn } from '@lib/utils';

// ── OrgPageHeader ─────────────────────────────────────────────
interface OrgPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}
export function OrgPageHeader({
  title,
  description,
  actions,
}: OrgPageHeaderProps): React.JSX.Element {
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

// ── OrgStatCard ───────────────────────────────────────────────
type AccentKey = 'sky' | 'emerald' | 'amber' | 'red' | 'purple' | 'slate';

const ACCENT: Record<AccentKey, { icon: string; text: string }> = {
  sky: { icon: 'bg-brand-sky/15', text: 'text-brand-sky' },
  emerald: { icon: 'bg-brand-emerald/15', text: 'text-brand-emerald' },
  amber: { icon: 'bg-brand-amber/15', text: 'text-brand-amber' },
  red: { icon: 'bg-brand-red/15', text: 'text-brand-red' },
  purple: { icon: 'bg-purple-500/15', text: 'text-purple-500' },
  slate: { icon: 'bg-slate-500/15', text: 'text-slate-400' },
};

interface OrgStatCardProps {
  label: string;
  value: string | number;
  trend?: { value: string; direction: 'up' | 'down' | 'neutral' };
  icon?: string;
  accent?: AccentKey;
  className?: string;
}
export function OrgStatCard({
  label,
  value,
  trend,
  icon,
  accent = 'sky',
  className,
}: OrgStatCardProps): React.JSX.Element {
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
type StatusType = 'published' | 'draft' | 'closed' | 'archived';

const STATUS_STYLES: Record<StatusType, string> = {
  published: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  draft: 'bg-slate-500/10 text-slate-500 border-slate-200',
  closed: 'bg-red-500/10 text-red-700 border-red-200',
  archived: 'bg-slate-500/10 text-slate-500 border-slate-200',
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

// ── PlanBadge ─────────────────────────────────────────────────
type PlanType = 'free' | 'basic' | 'premium';

const PLAN_STYLES: Record<PlanType, string> = {
  free: 'bg-slate-100 text-slate-500 border border-slate-200',
  basic: 'bg-sky-50 text-sky-700 border border-sky-200',
  premium: 'bg-amber-50 text-amber-700 border border-amber-200',
};

interface PlanBadgeProps {
  plan: PlanType;
  className?: string;
}
export function PlanBadge({ plan, className }: PlanBadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'rounded px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase',
        PLAN_STYLES[plan],
        className,
      )}
    >
      {plan}
    </span>
  );
}

// ── SearchFilterBar ───────────────────────────────────────────
interface SearchFilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (v: string) => void;
  children?: React.ReactNode;
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
