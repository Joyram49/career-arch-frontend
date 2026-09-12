export interface IOrgProfile {
  id: string;
  orgId: string;
  companyName: string;
  logoUrl: string | null;
  website: string | null;
  industry: string | null;
  companySize: string | null;
  foundedYear: number | null;
  description: string | null;
  location: string | null;
  country: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  email: string;
  isApproved: boolean;
  isPaymentMethodOnFile: boolean;
  hasUnpaidIncentives: boolean;
  createdAt: string;
  updatedAt: string;
}
