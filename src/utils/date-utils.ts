/** Formats a Date as a local (not UTC) YYYY-MM-DD string, safe for <input type="date"> comparisons. */
export function toISODateString(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function todayISODate(): string {
  return toISODateString(new Date());
}

/** Earliest selectable deadline — one day after today, since deadlines must be strictly in the future. */
export function tomorrowISODate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toISODateString(d);
}
