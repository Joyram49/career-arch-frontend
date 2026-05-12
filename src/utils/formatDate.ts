import { format, formatDistanceToNow, isValid } from 'date-fns';

/* ── Date formatting ── */
export function formatDate(date: string | Date, pattern = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(d)) return '—';
  return format(d, pattern);
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'MMM d, yyyy · h:mm a');
}

export function formatRelative(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!isValid(d)) return '—';
  return formatDistanceToNow(d, { addSuffix: true });
}
