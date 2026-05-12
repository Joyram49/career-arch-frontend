import { envConfig } from './envConfig';

export const siteConfig = {
  name: 'CareerArch',
  tagline: 'Find the Job That Moves You Forward',
  description: 'Search 50,000+ jobs from verified companies. Get matched, apply fast, land offers.',
  url: envConfig.siteUrl ?? 'http://localhost:3000',
  apiUrl: envConfig.apiUrl ?? 'http://localhost:5000/api/v1',
  social: {
    linkedin: 'https://linkedin.com/company/careerarch',
    twitter: 'https://twitter.com/careerarch',
    github: 'https://github.com/Joyram49/career-arch',
  },
  contact: {
    support: 'support@careerarch.com',
    hello: 'hello@careerarch.com',
  },
} as const;

/* ── Public navbar links ── */
export const publicNavLinks = [
  { label: 'Find Jobs', href: '/jobs' },
  { label: 'Companies', href: '/companies' },
  { label: 'Salary Guide', href: '/salary-guide' },
  { label: 'For Employers', href: '/register-org' },
] as const;

/* ── User dashboard sidebar links ── */
export const userSidebarLinks = [
  { label: 'Overview', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'My Applications', href: '/dashboard/applications', icon: 'ClipboardList' },
  { label: 'Saved Jobs', href: '/dashboard/saved-jobs', icon: 'Bookmark' },
  { label: 'My Profile', href: '/dashboard/profile', icon: 'UserCircle' },
  { label: 'Subscription', href: '/dashboard/subscription', icon: 'CreditCard' },
  { label: 'Notifications', href: '/dashboard/notifications', icon: 'Bell' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
] as const;

/* ── Org dashboard sidebar links ── */
export const orgSidebarLinks = [
  { label: 'Dashboard', href: '/org/dashboard', icon: 'LayoutDashboard' },
  { label: 'My Jobs', href: '/org/jobs', icon: 'Briefcase' },
  { label: 'Post a Job', href: '/org/jobs/new', icon: 'PlusCircle' },
  { label: 'Applications', href: '/org/applications', icon: 'Users' },
  { label: 'Incentives', href: '/org/incentives', icon: 'DollarSign' },
  { label: 'Company Profile', href: '/org/profile', icon: 'Building2' },
  { label: 'Billing', href: '/org/billing', icon: 'CreditCard' },
  { label: 'Settings', href: '/org/settings', icon: 'Settings' },
] as const;

/* ── Admin sidebar links ── */
export const adminSidebarLinks = [
  {
    section: 'Platform',
    links: [
      { label: 'Overview', href: '/admin/dashboard', icon: 'LayoutDashboard' },
      { label: 'Analytics', href: '/admin/analytics', icon: 'TrendingUp' },
    ],
  },
  {
    section: 'Users & Orgs',
    links: [
      { label: 'Users', href: '/admin/users', icon: 'Users' },
      { label: 'Organizations', href: '/admin/organizations', icon: 'Building2' },
    ],
  },
  {
    section: 'Content',
    links: [
      { label: 'Jobs', href: '/admin/jobs', icon: 'Briefcase' },
      { label: 'Applications', href: '/admin/applications', icon: 'ClipboardList' },
    ],
  },
  {
    section: 'Payments',
    links: [
      { label: 'Subscriptions', href: '/admin/subscriptions', icon: 'CreditCard' },
      { label: 'Incentives', href: '/admin/incentives', icon: 'DollarSign' },
      { label: 'Transactions', href: '/admin/transactions', icon: 'Receipt' },
      { label: 'Plans', href: '/admin/plans', icon: 'Package' },
    ],
  },
] as const;

/* ── User settings sidebar links ── */
export const settingsSidebarLinks = [
  { label: 'Account', href: '/dashboard/settings/account' },
  { label: 'Password', href: '/dashboard/settings/password' },
  { label: 'Notifications', href: '/dashboard/settings/notifications' },
  { label: 'Privacy', href: '/dashboard/settings/privacy' },
] as const;
