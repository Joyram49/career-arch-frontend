import { PlanName } from '@app-types/auth';

export interface PlanConfig {
  name: PlanName;
  label: string;
  price: { monthly: number; yearly: number };
  description: string;
  applyLimit: number | 'Unlimited';
  savedJobLimit: number | 'Unlimited';
  badge: { label: string; className: string };
  highlight: boolean;
  highlightLabel?: string;
  borderClass: string;
  buttonClass: string;
  features: Array<{ text: string; included: boolean }>;
}

export const PLAN_HIERARCHY: Record<PlanName, number> = {
  FREE: 0,
  BASIC: 1,
  PREMIUM: 2,
};

export const plans: Record<PlanName, PlanConfig> = {
  FREE: {
    name: 'FREE',
    label: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'For getting started',
    applyLimit: 5,
    savedJobLimit: 5,
    badge: { label: 'FREE FOREVER', className: 'badge-plan-free' },
    highlight: false,
    borderClass: 'border-border',
    buttonClass: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    features: [
      { text: 'Apply to Free-tier jobs (5/month)', included: true },
      { text: '5 saved jobs', included: true },
      { text: 'Basic profile', included: true },
      { text: 'Email notifications', included: true },
      { text: 'Access to Basic/Premium jobs', included: false },
      { text: 'Application analytics', included: false },
      { text: 'Priority visibility', included: false },
      { text: 'AI resume tips', included: false },
    ],
  },
  BASIC: {
    name: 'BASIC',
    label: 'Basic',
    price: { monthly: 9.99, yearly: 7.99 },
    description: 'For active job seekers',
    applyLimit: 30,
    savedJobLimit: 50,
    badge: { label: 'MOST POPULAR', className: 'badge-plan-basic' },
    highlight: true,
    highlightLabel: 'Most Popular',
    borderClass: 'border-brand-sky',
    buttonClass: 'bg-brand-sky text-white hover:bg-brand-sky/90',
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Apply to Free + Basic jobs (30/month)', included: true },
      { text: '50 saved jobs', included: true },
      { text: 'Standard profile visibility', included: true },
      { text: 'Basic application analytics', included: true },
      { text: 'Profile badge', included: true },
      { text: 'Premium-only jobs', included: false },
      { text: 'AI resume tips', included: false },
    ],
  },
  PREMIUM: {
    name: 'PREMIUM',
    label: 'Premium',
    price: { monthly: 24.99, yearly: 19.99 },
    description: 'For serious job hunters',
    applyLimit: 'Unlimited',
    savedJobLimit: 'Unlimited',
    badge: { label: 'BEST VALUE', className: 'badge-plan-premium' },
    highlight: false,
    highlightLabel: 'Best Value',
    borderClass: 'border-brand-amber',
    buttonClass: 'bg-brand-amber text-white hover:bg-brand-amber/90',
    features: [
      { text: 'Everything in Basic', included: true },
      { text: 'Apply to ALL jobs (Unlimited)', included: true },
      { text: 'Unlimited saved jobs', included: true },
      { text: 'Featured profile in search results', included: true },
      { text: 'Advanced application analytics', included: true },
      { text: 'AI-powered resume tips', included: true },
      { text: 'Priority in recruiter searches', included: true },
      { text: 'Exclusive Premium-only jobs', included: true },
    ],
  },
};
