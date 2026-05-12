import { PlanName } from '@app-types/auth';
import { PLAN_HIERARCHY, PlanConfig, plans } from '@constants/plans';

export function getPlanConfig(plan: string): PlanConfig {
  return plans[(plan as PlanName) ?? 'FREE'] ?? plans.FREE;
}

export function canUserApplyToJob(userPlan: string, requiredPlan: string): boolean {
  const userLevel = PLAN_HIERARCHY[userPlan as PlanName] ?? 0;
  const requiredLevel = PLAN_HIERARCHY[requiredPlan as PlanName] ?? 0;
  return userLevel >= requiredLevel;
}
