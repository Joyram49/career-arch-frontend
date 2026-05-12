/* ═══════════════════════════════════════
   PAYMENT TYPES
═══════════════════════════════════════ */

export type PaymentType = 'SUBSCRIPTION' | 'INCENTIVE' | 'REFUND' | 'OTHER';
export type PaymentStatus = 'SUCCEEDED' | 'FAILED' | 'PENDING' | 'REFUNDED';

export interface IPayment {
  id: string;
  type: PaymentType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripePaymentIntentId: string | null;
  stripeInvoiceId: string | null;
  receiptUrl: string | null;
  createdAt: string;
  userId?: string | null;
  orgId?: string | null;
}
