/* ─────────────────────────────────────────────
   Auth types - sync with backend auth types
──────────────────────────────────────────── */

export type UserRole = 'USER' | 'ORGANIZATION' | 'ADMIN';
export type PlanName = 'FREE' | 'BASIC' | 'PREMIUM';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'INACTIVE';

/* ======================= JWT payload (decoded) =========================== */

export interface IJwtPayload {
  sub: string;
  role: UserRole;
  email: string;
  plan?: PlanName;
  jti: string;
}

/* ======================= User (talent) =========================== */
export interface IUser {
  id: string;
  email: string;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  profile: IUserProfile | null;
  subscription: IUserSubscription | null;
}

export interface IUserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  headline: string | null;
  summary: string | null;
  phone: string | null;
  location: string | null;
  avatarUrl: string | null;
  resumeUrl: string | null;
  portFolioUrl: string | null;
  resumeFileName: string | null;
  githubUrl: string | null;
  skills: string[];
  experienceYear: number | null;
}

export interface IUserSubscription {
  id: string;
  plan: PlanName;
  status: SubscriptionStatus;
  applyCountThisMonth: number;
  savedJobCount: number;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

/* ======================= Organization (employer) =========================== */
export interface IOrganization {
  id: string;
  email: string;
  companyName: string;
  isEmailVerified: boolean;
  isApproved: boolean;
  isActive: boolean;
  isPaymentMethodOnFile: boolean;
  hasUnpaidIncentives: boolean;
  isTwoFactorEnabled: boolean;
  createdAt: string;
  profile: string | null;
}

export interface IOrgProfile {
  id: string;
  orgId: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  website: string | null;
  industry: string | null;
  companySize: string | null;
  foundedYear: number | null;
  location: string | null;
  country: string | null;
  linkedInUrl: string | null;
  twitterUrl: string | null;
}

/* ======================= Admin =========================== */
export interface IAdmin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

/* ======================= Auth responses =========================== */
export interface IAuthResponse {
  user?: IUser;
  organization?: IOrganization;
  admin?: IAdmin;
  requiresTwoFactor?: boolean;
  tempToken?: string;
}

export interface IMeResponse {
  user?: IUser;
  organization?: IOrganization;
  admin?: IAdmin;
}
