// src/types/admin/admin.dashboard.plans.ts

export type AdminPlanKey = 'FREE' | 'BASIC' | 'PREMIUM';

// ── Feature flags — mirrors backend IPlanFeatures / planFeaturesSchema exactly ──
export interface IAdminPlanFeatures {
  jobBrowseLimit: number; // -1 = unlimited
  applyMonthlyLimit: number; // -1 = unlimited
  saveJobsLimit: number; // -1 = unlimited
  canViewOrgProfile: boolean;
  resumeVersions: number; // -1 = unlimited
  canDownloadHistory: boolean;
  earlyJobAlerts: boolean;
  prioritySearch: boolean;
  aiResumeTips: boolean;
  badge: 'basic' | 'premium' | null;
}

export interface IAdminPlanListItem {
  id: string;
  key: AdminPlanKey;
  displayName: string;
  description: string | null;
  monthlyPriceCents: number;
  stripeProductId: string | null;
  stripePriceId: string | null;
  isActive: boolean;
  sortOrder: number;
  features: IAdminPlanFeatures;
  createdAt: string;
  updatedAt: string;
}

// ── Create — FREE is system-managed and cannot be created via admin ────────
export interface ICreatePlanPayload {
  key: 'BASIC' | 'PREMIUM';
  displayName: string;
  description?: string;
  monthlyPriceCents: number;
  features: IAdminPlanFeatures;
}

// ── Update — partial features merge server-side ─────────────────────────────
export interface IUpdatePlanPayload {
  displayName?: string;
  description?: string | null;
  monthlyPriceCents?: number;
  features?: Partial<IAdminPlanFeatures>;
}
