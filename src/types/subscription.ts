/* =======================  SUBSCRIPTION TYPES =========================== */

import { PlanName, SubscriptionStatus } from './auth';

export interface PlanCatalogue {
  id: string;
  name: PlanName;
  displayName: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  stripePriceIdMonthly: string | null;
  stripePriceIdYearly: string | null;
  features: IPlanFeatures;
  isActive: boolean;
}

export interface IPlanFeatures {
  applyMonthlyLimit: number;
  savedJobLimit: number;
  canViewOrgProfile: boolean;
  hasApplicationAnalytics: boolean;
  hasPriorityVisibility: boolean;
  hasAiResumeTips: boolean;
  hasEarlyAlerts: boolean;
  hasResumeVersions: boolean;
}

export interface ISubscription {
  id: string;
  userId: string;
  plan: PlanName;
  status: SubscriptionStatus;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  applyCountThisMonth: number;
  savedJobCount: number;
  applyCountResetAt: string | null;
}
