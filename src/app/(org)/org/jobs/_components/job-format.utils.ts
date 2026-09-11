import type { IOrgJobListItem, OrgJobType } from '@app-types/org/org.jobs';
import { formatDistanceToNow } from 'date-fns';

const JOB_TYPE_LABELS: Record<OrgJobType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  FREELANCE: 'Freelance',
  REMOTE: 'Remote',
};

export function jobTypeLabel(type: OrgJobType): string {
  return JOB_TYPE_LABELS[type];
}

// ── Currency — single source of truth for the salary currency <select> and
// for symbol lookup in formatSalaryRange, so the two can never drift apart. ──
export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'USD', symbol: '$', label: 'USD' },
  { code: 'EUR', symbol: '€', label: 'EUR' },
  { code: 'GBP', symbol: '£', label: 'GBP' },
  { code: 'INR', symbol: '₹', label: 'INR' },
  { code: 'BDT', symbol: '৳', label: 'BDT' },
];

function currencySymbol(code: string): string {
  return CURRENCY_OPTIONS.find((c) => c.code === code)?.symbol ?? `${code} `;
}

/**
 * Compacts a raw amount for display. Previously this always divided by 1000
 * and rounded to a whole number — so 500 -> 0.5 -> "1" and 600 -> 0.6 -> "1",
 * both displaying as "$1k". Fixed: show the real number below 1,000, and
 * one decimal place above it (1200 -> "$1.2k", not "$1k").
 */
function formatCompactAmount(amount: number): string {
  if (amount < 1000) return amount.toLocaleString();
  const thousands = amount / 1000;
  const formatted = Number.isInteger(thousands) ? thousands.toFixed(0) : thousands.toFixed(1);
  return `${formatted}k`;
}

export function formatSalaryRange(job: {
  salaryMin: number | null | undefined;
  salaryMax: number | null | undefined;
  salaryCurrency: string;
}): string {
  const { salaryMin, salaryMax, salaryCurrency } = job;
  const symbol = currencySymbol(salaryCurrency);
  const hasMin = salaryMin !== null && salaryMin !== undefined;
  const hasMax = salaryMax !== null && salaryMax !== undefined;

  if (!hasMin && !hasMax) return 'Not specified';

  if (hasMin && hasMax) {
    return `${symbol}${formatCompactAmount(salaryMin as number)} – ${symbol}${formatCompactAmount(salaryMax as number)}`;
  }

  return `${symbol}${formatCompactAmount((salaryMin ?? salaryMax) as number)}+`;
}

export function deadlineLabel(job: IOrgJobListItem): { text: string; isUrgent: boolean } {
  if (job.status === 'DRAFT') return { text: 'Not published yet', isUrgent: false };

  if (job.status === 'ARCHIVED' && job.deleteAt) {
    return {
      text: `Permanently deletes ${formatDistanceToNow(new Date(job.deleteAt), { addSuffix: true })}`,
      isUrgent: true,
    };
  }

  if (!job.deadline) return { text: 'No deadline set', isUrgent: false };

  const isPast = new Date(job.deadline) < new Date();
  return {
    text: `${isPast ? 'Closed' : 'Closes'} ${formatDistanceToNow(new Date(job.deadline), { addSuffix: true })}`,
    isUrgent: isPast,
  };
}
