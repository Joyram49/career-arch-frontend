# ⚡ CareerArch — Frontend Setup & Architecture Guide

> **Version:** 1.0.0 | **Phase:** 4 — Frontend (Next.js 16)
> **Repo:** https://github.com/Joyram49/career-arch
> **Backend API:** https://career-arch.onrender.com/api/v1

---

## 1. Project Overview

CareerArch frontend is a **production-grade Next.js 16 SaaS application** with three distinct dashboard experiences — Job Seeker, Organization (Employer), and Admin — all sharing a common design system built with Tailwind CSS v4 and shadcn/ui.

### Guiding Principles

- **Server-first by default** — use React Server Components wherever possible; add `"use client"` only when necessary (event handlers, hooks, browser APIs)
- **Type safety end to end** — strict TypeScript with inferred types from Zod schemas, shared with the backend where possible
- **Theme without re-renders** — CSS custom properties handle light/dark mode; no `dark:` Tailwind class prefixes in component code
- **Data fetching hierarchy** — Server Components fetch directly; Client Components use TanStack Query with Axios

---

## 2. Tech Stack

### Core

| Package      | Version   | Purpose                                      |
| ------------ | --------- | -------------------------------------------- |
| `next`       | `^16.2.x` | React framework (App Router, Turbopack, RSC) |
| `react`      | `^19.2.x` | UI library                                   |
| `react-dom`  | `^19.2.x` | DOM renderer                                 |
| `typescript` | `^5.8.x`  | Type safety (strict mode)                    |

### Styling & UI

| Package                    | Version    | Purpose                                         |
| -------------------------- | ---------- | ----------------------------------------------- |
| `tailwindcss`              | `^4.x`     | Utility CSS (no config file — CSS-first)        |
| `@tailwindcss/vite`        | `^4.x`     | Tailwind v4 Vite/Turbopack integration          |
| `shadcn/ui`                | latest CLI | Headless component library on top of Radix      |
| `@radix-ui/*`              | latest     | Primitive components (auto-installed by shadcn) |
| `lucide-react`             | `^0.511.x` | Icon library (used by shadcn)                   |
| `class-variance-authority` | `^0.7.x`   | Variant-based component styling (cva)           |
| `clsx`                     | `^2.x`     | Conditional class merging                       |
| `tailwind-merge`           | `^3.x`     | Tailwind class deduplication                    |

### Forms & Validation

| Package               | Version | Purpose                                  |
| --------------------- | ------- | ---------------------------------------- |
| `react-hook-form`     | `^7.x`  | Performant, uncontrolled form state      |
| `zod`                 | `^3.x`  | Schema validation (aligned with backend) |
| `@hookform/resolvers` | `^5.x`  | Bridge: react-hook-form ↔ zod            |

### Data Fetching

| Package                          | Version | Purpose                                  |
| -------------------------------- | ------- | ---------------------------------------- |
| `@tanstack/react-query`          | `^5.x`  | Async state management, caching, refetch |
| `@tanstack/react-query-devtools` | `^5.x`  | Dev UI for query inspection              |
| `axios`                          | `^1.x`  | HTTP client with interceptors            |

### Animation

| Package         | Version | Purpose                              |
| --------------- | ------- | ------------------------------------ |
| `framer-motion` | `^12.x` | Page transitions, micro-interactions |
| `motion`        | `^12.x` | Lightweight motion primitives        |

### State Management

| Package   | Version | Purpose                                    |
| --------- | ------- | ------------------------------------------ |
| `zustand` | `^5.x`  | Lightweight global state (auth, theme, UI) |

### Real-Time

| Package            | Version | Purpose                         |
| ------------------ | ------- | ------------------------------- |
| `socket.io-client` | `^4.x`  | WebSocket connection to backend |

### Payments

| Package                   | Version | Purpose                         |
| ------------------------- | ------- | ------------------------------- |
| `@stripe/stripe-js`       | `^5.x`  | Stripe.js browser SDK           |
| `@stripe/react-stripe-js` | `^3.x`  | React hooks for Stripe Elements |

### Utilities

| Package                       | Version  | Purpose                                 |
| ----------------------------- | -------- | --------------------------------------- |
| `date-fns`                    | `^4.x`   | Date formatting and manipulation        |
| `nuqs`                        | `^2.x`   | URL search param state (type-safe)      |
| `next-themes`                 | `^0.4.x` | Theme provider for dark/light switching |
| `sonner`                      | `^2.x`   | Toast notifications (used with shadcn)  |
| `recharts`                    | `^2.x`   | Admin dashboard charts                  |
| `@tanstack/react-table`       | `^8.x`   | Headless data tables                    |
| `react-dropzone`              | `^14.x`  | File upload (resume, avatar)            |
| `react-intersection-observer` | `^9.x`   | Infinite scroll, lazy loading           |
| `@tiptap/react`               | `^2.x`   | Rich text editor (job descriptions)     |
| `qrcode.react`                | `^4.x`   | QR code display for 2FA setup           |

### Dev Tools

| Package                            | Version  | Purpose                    |
| ---------------------------------- | -------- | -------------------------- |
| `eslint`                           | `^9.x`   | Linting (flat config)      |
| `@eslint/eslintrc`                 | `^3.x`   | ESLint compat utilities    |
| `eslint-config-next`               | `^16.x`  | Next.js lint rules         |
| `eslint-plugin-react`              | `^7.x`   | React-specific rules       |
| `eslint-plugin-react-hooks`        | `^5.x`   | Hooks rules                |
| `@typescript-eslint/eslint-plugin` | `^8.x`   | TypeScript lint rules      |
| `@typescript-eslint/parser`        | `^8.x`   | TypeScript ESLint parser   |
| `prettier`                         | `^3.x`   | Code formatter             |
| `prettier-plugin-tailwindcss`      | `^0.6.x` | Sorts Tailwind class order |
| `@types/node`                      | `^22.x`  | Node type definitions      |
| `@types/react`                     | `^19.x`  | React type definitions     |
| `@types/react-dom`                 | `^19.x`  | ReactDOM type definitions  |

---

## 3. Folder Structure

```
career-arch-frontend/
├── .github/
│   └── workflows/
│       └── ci.yml                        # Lint → Type check → Build → Deploy
│
├── public/
│   ├── fonts/                            # Self-hosted Inter / Plus Jakarta Sans
│   ├── images/
│   │   ├── logo.svg
│   │   ├── logo-white.svg
│   │   └── og-image.png                  # Open Graph default image
│   └── favicon.ico
│
├── src/
│   ├── app/                              # Next.js 16 App Router
│   │   ├── layout.tsx                    # Root layout (providers, fonts, metadata)
│   │   ├── globals.css                   # Tailwind v4 + CSS custom properties (theme vars)
│   │   ├── not-found.tsx                 # Global 404
│   │   ├── error.tsx                     # Global error boundary
│   │   │
│   │   ├── (public)/                     # Public routes (no auth required)
│   │   │   ├── layout.tsx                # Public layout (navbar + footer)
│   │   │   ├── page.tsx                  # Landing page (/)
│   │   │   ├── jobs/
│   │   │   │   ├── page.tsx              # Job search & listing (/jobs)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx          # Job detail (/jobs/:slug)
│   │   │   ├── companies/
│   │   │   │   ├── page.tsx              # Companies directory (/companies)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx          # Company detail (/companies/:id)
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx              # Pricing page (/pricing)
│   │   │   └── salary-guide/
│   │   │       └── page.tsx              # Salary guide (/salary-guide)
│   │   │
│   │   ├── (auth)/                       # Auth routes (redirect if logged in)
│   │   │   ├── layout.tsx                # Split-screen auth layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx              # User registration
│   │   │   ├── register-org/
│   │   │   │   └── page.tsx              # Organization registration
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   ├── verify-email/
│   │   │   │   └── page.tsx
│   │   │   └── 2fa/
│   │   │       ├── verify/
│   │   │       │   └── page.tsx          # OTP entry
│   │   │       └── setup/
│   │   │           └── page.tsx          # QR code + backup codes
│   │   │
│   │   ├── (dashboard)/                  # Protected: Job Seeker dashboard
│   │   │   ├── layout.tsx                # Sidebar layout (USER role)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx              # Overview
│   │   │   ├── dashboard/applications/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/saved-jobs/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/profile/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/subscription/
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/notifications/
│   │   │   │   └── page.tsx
│   │   │   └── dashboard/settings/
│   │   │       ├── page.tsx              # Redirect to /settings/account
│   │   │       ├── account/page.tsx
│   │   │       ├── password/page.tsx
│   │   │       ├── notifications/page.tsx
│   │   │       └── privacy/page.tsx
│   │   │
│   │   ├── (org)/                        # Protected: Organization dashboard
│   │   │   ├── layout.tsx                # Sidebar layout (ORGANIZATION role)
│   │   │   ├── org/dashboard/page.tsx
│   │   │   ├── org/jobs/page.tsx
│   │   │   ├── org/jobs/new/page.tsx     # Post a job (multi-step)
│   │   │   ├── org/jobs/[id]/edit/page.tsx
│   │   │   ├── org/jobs/[id]/applications/page.tsx
│   │   │   ├── org/incentives/page.tsx
│   │   │   ├── org/profile/page.tsx
│   │   │   ├── org/billing/page.tsx
│   │   │   └── org/settings/page.tsx
│   │   │
│   │   └── (admin)/                      # Protected: Admin dashboard
│   │       ├── layout.tsx                # Sidebar layout (ADMIN role)
│   │       ├── admin/dashboard/page.tsx
│   │       ├── admin/users/page.tsx
│   │       ├── admin/users/[id]/page.tsx
│   │       ├── admin/organizations/page.tsx
│   │       ├── admin/organizations/[id]/page.tsx
│   │       ├── admin/jobs/page.tsx
│   │       ├── admin/subscriptions/page.tsx
│   │       ├── admin/incentives/page.tsx
│   │       ├── admin/transactions/page.tsx
│   │       └── admin/plans/page.tsx
│   │
│   ├── components/
│   │   ├── ui/                           # shadcn/ui base components (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── ...                       # All shadcn components live here
│   │   │
│   │   ├── layout/                       # Structural layout components
│   │   │   ├── public-navbar.tsx
│   │   │   ├── public-footer.tsx
│   │   │   ├── auth-split-layout.tsx
│   │   │   ├── dashboard-sidebar.tsx     # USER sidebar
│   │   │   ├── org-sidebar.tsx
│   │   │   ├── admin-sidebar.tsx
│   │   │   ├── mobile-bottom-nav.tsx
│   │   │   └── theme-toggle.tsx
│   │   │
│   │   ├── shared/                       # Reusable across all sections
│   │   │   ├── job-card.tsx
│   │   │   ├── company-card.tsx
│   │   │   ├── application-card.tsx
│   │   │   ├── stat-card.tsx
│   │   │   ├── plan-badge.tsx
│   │   │   ├── status-badge.tsx
│   │   │   ├── avatar-upload.tsx
│   │   │   ├── resume-upload.tsx
│   │   │   ├── data-table.tsx            # TanStack Table wrapper
│   │   │   ├── pagination.tsx
│   │   │   ├── search-input.tsx
│   │   │   ├── filter-sidebar.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── error-state.tsx
│   │   │   ├── loading-skeleton.tsx
│   │   │   ├── confirm-dialog.tsx
│   │   │   ├── page-header.tsx
│   │   │   └── rich-text-editor.tsx      # TipTap wrapper
│   │   │
│   │   ├── landing/                      # Public landing page sections
│   │   │   ├── hero-section.tsx
│   │   │   ├── stats-bar.tsx
│   │   │   ├── featured-jobs.tsx
│   │   │   ├── how-it-works.tsx
│   │   │   ├── pricing-section.tsx
│   │   │   ├── top-companies.tsx
│   │   │   └── testimonials.tsx
│   │   │
│   │   ├── auth/                         # Auth page components
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── register-org-form.tsx
│   │   │   ├── forgot-password-form.tsx
│   │   │   ├── reset-password-form.tsx
│   │   │   ├── otp-input.tsx             # 6-box digit input
│   │   │   ├── password-strength-meter.tsx
│   │   │   └── oauth-buttons.tsx
│   │   │
│   │   ├── dashboard/                    # Job seeker dashboard components
│   │   │   ├── overview/
│   │   │   │   ├── welcome-banner.tsx
│   │   │   │   ├── stats-row.tsx
│   │   │   │   ├── application-pipeline.tsx   # Kanban
│   │   │   │   ├── activity-feed.tsx
│   │   │   │   └── recommended-jobs.tsx
│   │   │   ├── applications/
│   │   │   │   ├── application-table.tsx
│   │   │   │   ├── application-drawer.tsx
│   │   │   │   └── application-status-stepper.tsx
│   │   │   ├── profile/
│   │   │   │   ├── profile-preview.tsx
│   │   │   │   └── profile-edit-form.tsx
│   │   │   └── subscription/
│   │   │       ├── current-plan-card.tsx
│   │   │       ├── payment-history-table.tsx
│   │   │       └── upgrade-prompt.tsx
│   │   │
│   │   ├── org/                          # Organization dashboard components
│   │   │   ├── overview/
│   │   │   │   ├── org-stats-row.tsx
│   │   │   │   ├── jobs-performance-table.tsx
│   │   │   │   └── recent-applications.tsx
│   │   │   ├── post-job/
│   │   │   │   ├── post-job-stepper.tsx
│   │   │   │   ├── step-basics.tsx
│   │   │   │   ├── step-details.tsx
│   │   │   │   ├── step-requirements.tsx
│   │   │   │   └── step-review.tsx
│   │   │   ├── applications/
│   │   │   │   ├── kanban-board.tsx
│   │   │   │   ├── kanban-column.tsx
│   │   │   │   ├── candidate-card.tsx
│   │   │   │   └── application-panel.tsx  # Side panel
│   │   │   └── incentives/
│   │   │       ├── incentive-table.tsx
│   │   │       └── pay-incentive-modal.tsx
│   │   │
│   │   └── admin/                        # Admin dashboard components
│   │       ├── overview/
│   │       │   ├── platform-stats.tsx
│   │       │   ├── charts-row.tsx
│   │       │   ├── pending-actions-table.tsx
│   │       │   └── activity-log.tsx
│   │       ├── users/
│   │       │   ├── users-table.tsx
│   │       │   └── user-detail-modal.tsx
│   │       ├── organizations/
│   │       │   ├── orgs-table.tsx
│   │       │   └── org-detail-modal.tsx
│   │       └── plans/
│   │           ├── plans-table.tsx
│   │           └── plan-form-modal.tsx
│   │
│   ├── hooks/                            # Custom React hooks
│   │   ├── use-auth.ts                   # Auth state from Zustand
│   │   ├── use-theme.ts                  # Theme toggle (wraps next-themes)
│   │   ├── use-socket.ts                 # Socket.IO connection + event subscription
│   │   ├── use-debounce.ts               # Debounce search inputs
│   │   ├── use-media-query.ts            # Responsive breakpoint detection
│   │   ├── use-infinite-scroll.ts        # IntersectionObserver for infinite lists
│   │   ├── use-local-storage.ts          # Type-safe localStorage hook
│   │   └── use-copy-to-clipboard.ts
│   │
│   ├── lib/
│   │   ├── axios.ts                      # Axios instance + interceptors
│   │   ├── query-client.ts               # TanStack Query client config
│   │   ├── socket.ts                     # Socket.IO client singleton
│   │   ├── stripe.ts                     # loadStripe singleton
│   │   └── utils.ts                      # cn() helper (clsx + tailwind-merge)
│   │
│   ├── services/                         # API call functions (used by TanStack Query)
│   │   ├── auth.service.ts               # login, register, logout, refresh, 2fa
│   │   ├── user.service.ts               # profile, avatar, resume, saved jobs
│   │   ├── jobs.service.ts               # public search, detail, categories
│   │   ├── application.service.ts        # apply, list, withdraw
│   │   ├── subscription.service.ts       # plans, checkout, cancel, invoices
│   │   ├── org.service.ts                # org profile, billing, jobs CRUD
│   │   ├── org-application.service.ts    # Org: list apps, update status, hire
│   │   ├── incentive.service.ts          # pay, dispute
│   │   ├── notification.service.ts       # list, mark read
│   │   └── admin/
│   │       ├── admin-users.service.ts
│   │       ├── admin-orgs.service.ts
│   │       ├── admin-jobs.service.ts
│   │       ├── admin-plans.service.ts
│   │       ├── admin-subscriptions.service.ts
│   │       ├── admin-incentives.service.ts
│   │       └── admin-stats.service.ts
│   │
│   ├── queries/                          # TanStack Query hooks (useQuery / useMutation)
│   │   ├── keys.ts                       # All query key factories
│   │   ├── use-jobs.ts
│   │   ├── use-applications.ts
│   │   ├── use-profile.ts
│   │   ├── use-subscription.ts
│   │   ├── use-notifications.ts
│   │   ├── use-org-jobs.ts
│   │   ├── use-org-applications.ts
│   │   ├── use-incentives.ts
│   │   └── admin/
│   │       ├── use-admin-users.ts
│   │       ├── use-admin-orgs.ts
│   │       ├── use-admin-jobs.ts
│   │       ├── use-admin-plans.ts
│   │       └── use-admin-stats.ts
│   │
│   ├── store/                            # Zustand stores
│   │   ├── auth.store.ts                 # User/Org/Admin auth state + actions
│   │   ├── ui.store.ts                   # Sidebar open/close, modals
│   │   └── notification.store.ts         # Unread notification count
│   │
│   ├── validations/                      # Zod schemas for all forms
│   │   ├── auth.schema.ts
│   │   ├── profile.schema.ts
│   │   ├── job.schema.ts
│   │   ├── application.schema.ts
│   │   └── admin.schema.ts
│   │
│   ├── types/
│   │   ├── api.ts                        # API response wrapper types
│   │   ├── auth.ts                       # User, Org, Admin interfaces
│   │   ├── job.ts
│   │   ├── application.ts
│   │   ├── subscription.ts
│   │   ├── incentive.ts
│   │   ├── notification.ts
│   │   └── index.ts                      # Re-exports
│   │
│   └── config/
│       ├── site.ts                       # Site metadata, nav links, social URLs
│       ├── plans.ts                      # Plan display config (labels, colors, limits)
│       └── routes.ts                     # Type-safe route constants
│
├── proxy.ts                              # Next.js 16 proxy (replaces middleware.ts)
│                                         # Auth guard: redirect unauthenticated users
│
├── next.config.ts                        # Next.js config (images, env, headers)
├── tsconfig.json                         # TypeScript strict config
├── eslint.config.mjs                     # ESLint 9 flat config
├── .prettierrc                           # Prettier config
├── .prettierignore
├── .gitignore
├── .env.local                            # Local env vars (gitignored)
├── .env.example                          # Env var template (committed)
├── components.json                       # shadcn/ui config
└── package.json
```

---

## 4. Environment Variables

```env
# .env.example

# API
NEXT_PUBLIC_API_URL=https://career-arch.onrender.com/api/v1
NEXT_PUBLIC_SOCKET_URL=https://career-arch.onrender.com

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App
NEXT_PUBLIC_APP_NAME=CareerArch
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OAuth (Phase 5)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
```

> All frontend secrets are prefixed `NEXT_PUBLIC_` — nothing sensitive lives here.
> The backend handles all Stripe secret keys and JWT secrets.

---

## 5. global.css — Theme System

Tailwind v4 is CSS-first: no `tailwind.config.js`. All theme tokens are declared
as CSS custom properties. shadcn/ui reads from these variables automatically.
Switching theme = toggling `:root` vs `[data-theme="dark"]` on `<html>`.

**You never write `dark:` prefixes** in component code.

```css
/* src/app/globals.css */

@import 'tailwindcss';

/* ─────────────────────────────────────────────
   CareerArch Design Tokens — Light Mode (default)
   ──────────────────────────────────────────── */
:root {
  /* Brand colors */
  --color-brand-navy: #1a1a2e;
  --color-brand-sky: #0ea5e9;
  --color-brand-emerald: #10b981;
  --color-brand-amber: #f59e0b;
  --color-brand-red: #ef4444;

  /* shadcn/ui semantic tokens — Light */
  --background: #f8fafc;
  --foreground: #0f172a;
  --card: #ffffff;
  --card-foreground: #0f172a;
  --popover: #ffffff;
  --popover-foreground: #0f172a;
  --primary: #1a1a2e;
  --primary-foreground: #ffffff;
  --secondary: #f1f5f9;
  --secondary-foreground: #0f172a;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --accent: #e0f2fe;
  --accent-foreground: #0369a1;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #e2e8f0;
  --input: #f1f5f9;
  --ring: #0ea5e9;

  /* Sidebar */
  --sidebar-background: #1a1a2e;
  --sidebar-foreground: #e2e8f0;
  --sidebar-active-bg: #0ea5e9;
  --sidebar-active-fg: #ffffff;
  --sidebar-muted: #94a3b8;
  --sidebar-border: #2d2d4e;

  /* Status badges */
  --status-hired: #10b981;
  --status-rejected: #ef4444;
  --status-pending: #f59e0b;
  --status-review: #3b82f6;
  --status-shortlisted: #8b5cf6;

  /* Plan badge colors */
  --plan-free: #94a3b8;
  --plan-basic: #0ea5e9;
  --plan-premium: #f59e0b;

  /* Typography scale */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Radius */
  --radius: 0.5rem; /* Base = 8px; shadcn uses this */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-dropdown: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-modal: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

/* ─────────────────────────────────────────────
   Dark Mode — toggled via [data-theme="dark"] on <html>
   next-themes sets this attribute automatically.
   ──────────────────────────────────────────── */
[data-theme='dark'] {
  --background: #0f172a;
  --foreground: #f1f5f9;
  --card: #1e293b;
  --card-foreground: #f1f5f9;
  --popover: #1e293b;
  --popover-foreground: #f1f5f9;
  --primary: #0ea5e9;
  --primary-foreground: #ffffff;
  --secondary: #1e293b;
  --secondary-foreground: #f1f5f9;
  --muted: #1e293b;
  --muted-foreground: #94a3b8;
  --accent: #0c1a2e;
  --accent-foreground: #7dd3fc;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #334155;
  --input: #1e293b;
  --ring: #0ea5e9;

  --sidebar-background: #0f172a;
  --sidebar-border: #1e293b;

  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4);
  --shadow-dropdown: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4);
  --shadow-modal: 0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5);
}

/* ─────────────────────────────────────────────
   Base styles
   ──────────────────────────────────────────── */
* {
  border-color: var(--border);
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* Smooth theme transition */
*,
*::before,
*::after {
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

/* Focus ring */
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: var(--muted);
}
::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--muted-foreground);
}
```

---

## 6. TypeScript Configuration

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@ui/*": ["./src/components/ui/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@lib/*": ["./src/lib/*"],
      "@services/*": ["./src/services/*"],
      "@queries/*": ["./src/queries/*"],
      "@store/*": ["./src/store/*"],
      "@validations/*": ["./src/validations/*"],
      "@types-app/*": ["./src/types/*"],
      "@config/*": ["./src/config/*"],
    },
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"],
}
```

---

## 7. ESLint Configuration

```js
// eslint.config.mjs — ESLint 9 flat config
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  ...compat.extends('next/core-web-vitals'),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: './tsconfig.json' },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],

      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
    },
  },
  {
    ignores: ['.next/', 'node_modules/', 'dist/', 'public/'],
  },
];
```

---

## 8. Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always",
  "bracketSpacing": true,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/app/globals.css"
}
```

```
# .prettierignore
.next/
node_modules/
public/
*.md
```

---

## 9. Next.js Configuration

```ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack is default in Next.js 16 — no flag needed

  // React Compiler (stable in Next.js 16)
  reactCompiler: true,

  images: {
    remotePatterns: [
      { hostname: 'res.cloudinary.com' },   // User avatars + org logos
      { hostname: 'lh3.googleusercontent.com' }, // Google OAuth avatars (Phase 5)
    ],
  },

  // Typed route support
  experimental: {
    typedRoutes: true,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=()' },
        ],
      },
    ];
  },

  // Redirect /dashboard → appropriate dashboard based on role (handled in proxy.ts)
};

export default nextConfig;
```

---

## 10. Auth Guard — proxy.ts

```ts
// proxy.ts (Next.js 16 — replaces middleware.ts)
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/jobs', '/companies', '/pricing', '/salary-guide'];
const AUTH_PATHS = ['/login', '/register', '/register-org', '/forgot-password', '/reset-password', '/verify-email', '/2fa'];
const ROLE_PATHS = {
  USER: '/dashboard',
  ORGANIZATION: '/org',
  ADMIN: '/admin',
};

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;
  const role = request.cookies.get('userRole')?.value as keyof typeof ROLE_PATHS | undefined;

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isProtected = Object.values(ROLE_PATHS).some((p) => pathname.startsWith(p));

  // Redirect logged-in users away from auth pages
  if (isAuthPage && token !== undefined) {
    const home = role !== undefined ? ROLE_PATHS[role] : '/dashboard';
    return NextResponse.redirect(new URL(home, request.url));
  }

  // Redirect unauthenticated users from protected pages
  if (isProtected && token === undefined) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access: USER cannot access /org or /admin, etc.
  if (token !== undefined && role !== undefined) {
    const allowed = ROLE_PATHS[role];
    const accessing = Object.entries(ROLE_PATHS).find(([, path]) => pathname.startsWith(path));
    if (accessing !== undefined && accessing[0] !== role) {
      return NextResponse.redirect(new URL(allowed, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
```

---

## 11. Axios Instance

```ts
// src/lib/axios.ts
import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,          // Send HttpOnly cookies (JWT)
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — no need to attach Authorization header
// JWT rides in the HttpOnly cookie automatically
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor — handle 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest._retry !== true) {
      originalRequest._retry = true;
      try {
        // Attempt silent refresh
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/user/refresh-token`,
          {},
          { withCredentials: true },
        );
        return api(originalRequest);
      } catch {
        // Refresh failed — redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
```

---

## 12. TanStack Query Setup

```ts
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,        // 2 minutes
      gcTime: 1000 * 60 * 10,          // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

```tsx
// src/app/layout.tsx (simplified providers section)
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { queryClient } from '@lib/query-client';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="data-theme"      // Sets [data-theme="dark"] on <html>
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="top-right" richColors />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## 13. Query Key Factories

```ts
// src/queries/keys.ts
export const queryKeys = {
  jobs: {
    all: () => ['jobs'] as const,
    list: (filters: Record<string, unknown>) => ['jobs', 'list', filters] as const,
    detail: (slug: string) => ['jobs', 'detail', slug] as const,
    categories: () => ['jobs', 'categories'] as const,
  },
  applications: {
    all: () => ['applications'] as const,
    list: (filters?: Record<string, unknown>) => ['applications', 'list', filters] as const,
    detail: (id: string) => ['applications', 'detail', id] as const,
  },
  profile: {
    me: () => ['profile', 'me'] as const,
  },
  subscription: {
    my: () => ['subscription', 'my'] as const,
    plans: () => ['subscription', 'plans'] as const,
    invoices: () => ['subscription', 'invoices'] as const,
  },
  notifications: {
    all: () => ['notifications'] as const,
  },
  org: {
    jobs: (filters?: Record<string, unknown>) => ['org', 'jobs', filters] as const,
    applications: (jobId: string) => ['org', 'applications', jobId] as const,
    incentives: () => ['org', 'incentives'] as const,
    profile: () => ['org', 'profile'] as const,
    billing: () => ['org', 'billing'] as const,
  },
  admin: {
    users: (filters?: Record<string, unknown>) => ['admin', 'users', filters] as const,
    orgs: (filters?: Record<string, unknown>) => ['admin', 'orgs', filters] as const,
    jobs: (filters?: Record<string, unknown>) => ['admin', 'jobs', filters] as const,
    plans: () => ['admin', 'plans'] as const,
    stats: () => ['admin', 'stats'] as const,
    incentives: (filters?: Record<string, unknown>) => ['admin', 'incentives', filters] as const,
  },
};
```

---

## 14. Zustand Auth Store

```ts
// src/store/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IUser, IOrganization, IAdmin } from '@types-app/auth';

type AuthUser = IUser | IOrganization | IAdmin | null;

interface AuthState {
  user: AuthUser;
  role: 'USER' | 'ORGANIZATION' | 'ADMIN' | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser, role: 'USER' | 'ORGANIZATION' | 'ADMIN') => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      setUser: (user, role) => set({ user, role, isAuthenticated: true }),
      clearAuth: () => set({ user: null, role: null, isAuthenticated: false }),
    }),
    {
      name: 'careerarch-auth',
      // Only persist role — never persist tokens (those are in HttpOnly cookies)
      partialize: (state) => ({ role: state.role }),
    },
  ),
);
```

---

## 15. Socket.IO Hook

```ts
// src/hooks/use-socket.ts
'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@store/auth.store';

let socketInstance: Socket | null = null;

export function useSocket(): Socket | null {
  const { isAuthenticated } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (socketInstance === null) {
      socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        withCredentials: true,
        transports: ['websocket'],
      });
    }

    socketRef.current = socketInstance;

    return () => {
      // Don't disconnect on component unmount — singleton connection
    };
  }, [isAuthenticated]);

  return socketRef.current;
}
```

---

## 16. shadcn/ui Configuration

```json
// components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@components",
    "utils": "@lib/utils",
    "ui": "@ui",
    "lib": "@lib",
    "hooks": "@hooks"
  },
  "iconLibrary": "lucide"
}
```

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

---

## 17. GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Format check
        run: npm run format:check

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: quality
    env:
      NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
      NEXT_PUBLIC_SOCKET_URL: ${{ secrets.NEXT_PUBLIC_SOCKET_URL }}
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}
      NEXT_PUBLIC_APP_URL: ${{ secrets.NEXT_PUBLIC_APP_URL }}
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: nextjs-build
          path: .next/
          retention-days: 1

  deploy:
    name: Deploy to Vercel
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 18. package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "husky"
  }
}
```

---

## 19. Git Hooks — Husky + lint-staged

```bash
# Install
npm install -D husky lint-staged
npx husky init
```

```sh
# .husky/pre-commit
npx lint-staged
```

```json
// package.json — add this section
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

---

## 20. Installation Commands

```bash
# 1. Create project
npx create-next-app@latest career-arch-frontend \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --turbopack \
  --no-import-alias

cd career-arch-frontend

# 2. Install all dependencies
npm install \
  @tanstack/react-query \
  @tanstack/react-query-devtools \
  @tanstack/react-table \
  axios \
  zustand \
  framer-motion \
  motion \
  react-hook-form \
  zod \
  @hookform/resolvers \
  socket.io-client \
  @stripe/stripe-js \
  @stripe/react-stripe-js \
  date-fns \
  nuqs \
  next-themes \
  sonner \
  recharts \
  react-dropzone \
  react-intersection-observer \
  @tiptap/react \
  @tiptap/starter-kit \
  @tiptap/extension-link \
  @tiptap/extension-placeholder \
  qrcode.react \
  clsx \
  tailwind-merge \
  class-variance-authority \
  lucide-react

# 3. Install dev dependencies
npm install -D \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  @eslint/eslintrc \
  prettier \
  prettier-plugin-tailwindcss \
  husky \
  lint-staged \
  @types/node \
  @types/react \
  @types/react-dom

# 4. Initialize shadcn/ui
npx shadcn@latest init

# 5. Add core shadcn components
npx shadcn@latest add button input badge card dialog drawer \
  dropdown-menu form select table tabs avatar progress \
  separator sheet switch textarea tooltip skeleton \
  popover command scroll-area radio-group checkbox label \
  alert alert-dialog accordion collapsible

# 6. Set up Husky
npx husky init
```

---

## 21. Adding a New Feature — Checklist

```
□ 1. Add Zod schema in src/validations/*.schema.ts
□ 2. Add TypeScript types in src/types/*.ts
□ 3. Add API call function in src/services/*.service.ts
□ 4. Add query key in src/queries/keys.ts
□ 5. Add TanStack Query hook in src/queries/use-*.ts
□ 6. Build component in src/components/**/*.tsx
□ 7. Add page route in src/app/**/ (RSC or client as appropriate)
□ 8. Update proxy.ts if the route needs auth guarding
□ 9. Add loading.tsx and error.tsx siblings to the page if needed
```

---

## 22. RSC vs Client Component Decision Guide

```
Default → Server Component (no "use client")

Add "use client" when the component uses:
  - useState / useReducer / useEffect / useRef / useCallback / useMemo
  - Browser APIs (window, document, navigator, localStorage)
  - Event handlers (onClick, onChange, onSubmit)
  - TanStack Query hooks (useQuery, useMutation)
  - Zustand store hooks
  - Socket.IO hooks
  - Framer Motion animations
  - react-hook-form

Keep as Server Component:
  - Page-level data fetching (await in RSC)
  - Static or infrequently changing layouts
  - Metadata generation (generateMetadata)
  - Any component that only renders based on props or server data
```

---

## 23. Phase Roadmap

| Phase  | Description                                                    | Status      |
| ------ | -------------------------------------------------------------- | ----------- |
| **4A** | Project setup, design system, global CSS, shadcn init          | ⏳ Starting |
| **4B** | Public layout, landing page, job search, job detail            | ⏳ Pending  |
| **4C** | Auth pages (login, register, 2FA, password reset)              | ⏳ Pending  |
| **4D** | User dashboard (overview, applications, saved jobs, profile)   | ⏳ Pending  |
| **4E** | Subscription & billing (Stripe Elements, plan upgrade)         | ⏳ Pending  |
| **4F** | Organization dashboard (post job, kanban pipeline, incentives) | ⏳ Pending  |
| **4G** | Admin dashboard (stats, user/org/job management)               | ⏳ Pending  |
| **4H** | Real-time (Socket.IO notifications, live status updates)       | ⏳ Pending  |
| **4I** | Company directory, salary guide, reviews (future)              | ⏳ Pending  |
| **5**  | E2E tests (Playwright), Vercel deploy, Google/LinkedIn OAuth   | ⏳ Pending  |

---

_Last updated: Phase 4 frontend setup defined._
_Maintained by: Joyram49 (Joy Ram Das)_
_Repo: https://github.com/Joyram49/career-arch_
