/* ═══════════════════════════════════════
   INCENTIVE TYPES
═══════════════════════════════════════ */

import { IOrganization, IUser } from './auth';
import { IJob } from './job';

export type IncentiveStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'WAIVED' | 'DISPUTED';

export interface IHiringIncentive {
  id: string;
  orgId: string;
  jobId: string;
  applicationId: string;
  amount: number;
  currency: string;
  status: IncentiveStatus;
  dueAt: string;
  paidAt: string | null;
  waivedAt: string | null;
  waivedReason: string | null;
  disputedAt: string | null;
  disputeReason: string | null;
  createdAt: string;
  organization?: Pick<IOrganization, 'id' | 'companyName'>;
  job?: Pick<IJob, 'id' | 'title'>;
  application?: {
    id: string;
    user: Pick<IUser, 'id' | 'firstName' | 'lastName' | 'email'>;
  };
}
