import type { ApplicationStatus } from '@app-types/org/org.applications';

export const KANBAN_COLUMNS: { status: ApplicationStatus; label: string }[] = [
  { status: 'PENDING', label: 'Applied' },
  { status: 'UNDER_REVIEW', label: 'Under Review' },
  { status: 'SHORTLISTED', label: 'Shortlisted' },
  { status: 'INTERVIEW_SCHEDULED', label: 'Interview' },
  { status: 'OFFERED', label: 'Offered' },
  { status: 'HIRED', label: 'Hired' },
  { status: 'REJECTED', label: 'Rejected' },
];

export interface StatusAction {
  label: string;
  target: ApplicationStatus;
  variant: 'default' | 'danger';
}

// WITHDRAWN is candidate-initiated, never an org action, so it's absent from
// every transition list. HIRED/REJECTED/WITHDRAWN are terminal — no actions.
const TRANSITIONS: Partial<Record<ApplicationStatus, StatusAction[]>> = {
  PENDING: [
    { label: 'Move to Under Review', target: 'UNDER_REVIEW', variant: 'default' },
    { label: 'Reject', target: 'REJECTED', variant: 'danger' },
  ],
  UNDER_REVIEW: [
    { label: 'Shortlist', target: 'SHORTLISTED', variant: 'default' },
    { label: 'Reject', target: 'REJECTED', variant: 'danger' },
  ],
  SHORTLISTED: [
    { label: 'Schedule Interview', target: 'INTERVIEW_SCHEDULED', variant: 'default' },
    { label: 'Reject', target: 'REJECTED', variant: 'danger' },
  ],
  INTERVIEW_SCHEDULED: [
    { label: 'Make Offer', target: 'OFFERED', variant: 'default' },
    { label: 'Reject', target: 'REJECTED', variant: 'danger' },
  ],
  OFFERED: [
    { label: 'Mark as Hired', target: 'HIRED', variant: 'default' },
    { label: 'Reject', target: 'REJECTED', variant: 'danger' },
  ],
};

export function getStatusActions(status: ApplicationStatus): StatusAction[] {
  return TRANSITIONS[status] ?? [];
}
