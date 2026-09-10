import type { IOrgJobListItem } from './org.jobs';

export type ApplicationStatusKey =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'OFFERED'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface IOrgJobDetail extends IOrgJobListItem {
  description: string | undefined;
  requirements: string | null;
  responsibilities: string | null;
  skills: string[];
  category: string | null;
  applicationsByStatus: Record<ApplicationStatusKey, number>;
}
