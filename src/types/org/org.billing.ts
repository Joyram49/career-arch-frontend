export interface IOrgBillingCard {
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
}

export interface IOrgBillingInfo {
  isPaymentMethodOnFile: boolean;
  hasUnpaidIncentives: boolean;
  card: IOrgBillingCard | null;
}

export interface IOrgSetupIntentResponse {
  clientSecret: string;
  customerId: string;
}
