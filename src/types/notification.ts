/* ═══════════════════════════════════════
   NOTIFICATION TYPES
═══════════════════════════════════════ */

export type NotificationType =
  | 'APPLICATION_SUBMITTED'
  | 'APPLICATION_STATUS_UPDATED'
  | 'APPLICATION_WITHDRAWN'
  | 'INTERVIEW_SCHEDULED'
  | 'OFFER_RECEIVED'
  | 'JOB_MATCH'
  | 'PROFILE_VIEWED'
  | 'SUBSCRIPTION_UPDATED'
  | 'PAYMENT_SUCCEEDED'
  | 'PAYMENT_FAILED'
  | 'INCENTIVE_DUE'
  | 'INCENTIVE_PAID'
  | 'INCENTIVE_OVERDUE'
  | 'ORG_APPROVED'
  | 'ORG_REJECTED'
  | 'GENERAL';

export interface INotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
  userId?: string | null;
  orgId?: string | null;
}
