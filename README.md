# ⚡ CareerArch — Frontend Setup & Architecture Guide

> **Version:** 1.1.0 | **Phase:** 4B — Public Pages
> **Repo:** <https://github.com/Joyram49/career-arch-frontend>
> **Backend API:** <https://career-arch.onrender.com/api/v1>

---

## 1. Project Overview

CareerArch frontend is a **production-grade Next.js 16 SaaS application** with three distinct dashboard experiences — Job Seeker, Organization (Employer), and Admin — all sharing a common design system built with Tailwind CSS v4 and shadcn/ui.

### Guiding Principles

- **Server-first by default** — use React Server Components wherever possible; add `"use client"` only when necessary (event handlers, hooks, browser APIs)
- **Type safety end to end** — strict TypeScript with inferred types from Zod schemas, shared with the backend where possible
- **Theme without re-renders** — CSS custom properties handle light/dark mode; no `dark:` Tailwind class prefixes in component code
- **Data fetching hierarchy** — Server Components fetch directly; Client Components use TanStack Query with Axios
- **Co-location first** — page-specific components live inside the page's `_components/` folder; only truly shared components go in `components/`

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

## 3. Component Architecture — The Golden Rule

CareerArch follows the **Next.js co-location pattern**. The rule is simple:

> **If a component is used by only one page → it lives inside that page's `_components/` folder.**
> **If a component is used by two or more pages → it moves to `components/shared/` or `components/forms/`.**

```tree
# ✅ CORRECT — page-specific component co-located
app/(public)/jobs/[slug]/
├── page.tsx
├── loading.tsx
└── _components/
    ├── job-header.tsx
    ├── job-tabs.tsx
    ├── apply-modal.tsx
    └── similar-jobs.tsx

# ✅ CORRECT — shared component in root components/
components/
└── shared/
    └── job-card.tsx        # Used on /jobs listing AND /dashboard

# ❌ WRONG — shared component buried inside a page folder
app/(public)/jobs/_components/job-card.tsx   # Don't do this if card is used elsewhere
```

### Component placement decision tree

```algorithm
Is this component used by more than one page or route?
├── YES → components/shared/         (generic reusable UI)
│         components/forms/          (reusable form pieces)
│         components/layout/         (structural: navbar, sidebar, footer)
│         components/ui/             (shadcn primitives only)
└── NO  → app/[route]/_components/  (co-located with the page)
```

---

## 4. Folder Structure

```tree
career-arch-frontend/
├── .github/
│   └── workflows/
│       └── ci.yml                              # Lint → Type check → Build → Deploy
│
├── public/
│   ├── fonts/                                  # Self-hosted Inter / Plus Jakarta Sans
│   ├── images/
│   │   ├── logo.svg
│   │   ├── logo-white.svg
│   │   └── og-image.png
│   └── favicon.ico
│
├── src/
│   │
│   ├── app/                                    # Next.js 16 App Router
│   │   ├── layout.tsx                          # Root layout — mounts <Providers>
│   │   ├── globals.css                         # Tailwind v4 + CSS custom properties
│   │   ├── not-found.tsx                       # Global 404
│   │   ├── error.tsx                           # Global error boundary
│   │   │
│   │   ├── (public)/                           # Public routes — no auth required
│   │   │   ├── layout.tsx                      # Wraps public navbar + footer
│   │   │   │
│   │   │   ├── page.tsx                        # Landing page  /
│   │   │   ├── _components/                    # Landing page sections (co-located)
│   │   │   │   ├── hero-section.tsx
│   │   │   │   ├── stats-bar.tsx
│   │   │   │   ├── featured-jobs.tsx
│   │   │   │   ├── how-it-works.tsx
│   │   │   │   ├── pricing-section.tsx
│   │   │   │   ├── top-companies.tsx
│   │   │   │   └── testimonials.tsx
│   │   │   │
│   │   │   ├── jobs/
│   │   │   │   ├── page.tsx                    # Job search & listing  /jobs
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── _components/
│   │   │   │   │   ├── job-filters-sidebar.tsx
│   │   │   │   │   ├── job-list.tsx
│   │   │   │   │   ├── job-search-bar.tsx
│   │   │   │   │   └── active-filter-chips.tsx
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx                # Job detail  /jobs/:slug
│   │   │   │       ├── loading.tsx
│   │   │   │       └── _components/
│   │   │   │           ├── job-header.tsx
│   │   │   │           ├── job-tabs.tsx
│   │   │   │           ├── job-sidebar.tsx
│   │   │   │           ├── apply-modal.tsx
│   │   │   │           └── similar-jobs.tsx
│   │   │   │
│   │   │   ├── companies/
│   │   │   │   ├── page.tsx                    # Companies directory  /companies
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── _components/
│   │   │   │   │   ├── company-filters.tsx
│   │   │   │   │   └── company-grid.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx                # Company detail  /companies/:id
│   │   │   │       ├── loading.tsx
│   │   │   │       └── _components/
│   │   │   │           ├── company-banner.tsx
│   │   │   │           ├── company-tabs.tsx
│   │   │   │           └── company-jobs-tab.tsx
│   │   │   │
│   │   │   ├── pricing/
│   │   │   │   ├── page.tsx                    # Pricing page  /pricing
│   │   │   │   └── _components/
│   │   │   │       ├── plan-card.tsx
│   │   │   │       ├── plan-comparison-table.tsx
│   │   │   │       ├── pricing-faq.tsx
│   │   │   │       └── stripe-checkout-modal.tsx
│   │   │   │
│   │   │   └── salary-guide/
│   │   │       └── page.tsx                    # Salary guide  /salary-guide
│   │   │
│   │   ├── (auth)/                             # Auth routes — redirects if logged in
│   │   │   ├── layout.tsx                      # Split-screen auth layout
│   │   │   │
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _components/
│   │   │   │       └── login-form.tsx
│   │   │   │
│   │   │   ├── register/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _components/
│   │   │   │       └── register-form.tsx
│   │   │   │
│   │   │   ├── register-org/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _components/
│   │   │   │       └── register-org-form.tsx
│   │   │   │
│   │   │   ├── forgot-password/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _components/
│   │   │   │       └── forgot-password-form.tsx
│   │   │   │
│   │   │   ├── reset-password/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _components/
│   │   │   │       └── reset-password-form.tsx
│   │   │   │
│   │   │   ├── verify-email/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── 2fa/
│   │   │       ├── verify/
│   │   │       │   ├── page.tsx
│   │   │       │   └── _components/
│   │   │       │       └── otp-verify-form.tsx
│   │   │       └── setup/
│   │   │           ├── page.tsx
│   │   │           └── _components/
│   │   │               ├── qr-code-step.tsx
│   │   │               ├── verify-otp-step.tsx
│   │   │               └── backup-codes-step.tsx
│   │   │
│   │   ├── (dashboard)/                        # Protected: Job Seeker dashboard
│   │   │   ├── layout.tsx                      # Sidebar layout (USER role)
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx                    # Overview
│   │   │   │   ├── loading.tsx
│   │   │   │   └── _components/
│   │   │   │       ├── welcome-banner.tsx
│   │   │   │       ├── stats-row.tsx
│   │   │   │       ├── application-pipeline.tsx
│   │   │   │       ├── activity-feed.tsx
│   │   │   │       └── recommended-jobs.tsx
│   │   │   │
│   │   │   ├── dashboard/applications/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── _components/
│   │   │   │       ├── application-table.tsx
│   │   │   │       ├── application-drawer.tsx
│   │   │   │       └── application-status-stepper.tsx
│   │   │   │
│   │   │   ├── dashboard/saved-jobs/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   │
│   │   │   ├── dashboard/profile/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _components/
│   │   │   │       ├── profile-preview.tsx
│   │   │   │       └── profile-edit-form.tsx
│   │   │   │
│   │   │   ├── dashboard/subscription/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _components/
│   │   │   │       ├── current-plan-card.tsx
│   │   │   │       ├── payment-history-table.tsx
│   │   │   │       └── upgrade-prompt.tsx
│   │   │   │
│   │   │   ├── dashboard/notifications/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   │
│   │   │   └── dashboard/settings/
│   │   │       ├── page.tsx                    # Redirects → /settings/account
│   │   │       ├── account/page.tsx
│   │   │       ├── password/page.tsx
│   │   │       ├── notifications/page.tsx
│   │   │       └── privacy/page.tsx
│   │   │
│   │   ├── (org)/                              # Protected: Organization dashboard
│   │   │   ├── layout.tsx                      # Sidebar layout (ORGANIZATION role)
│   │   │   │
│   │   │   ├── org/dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _components/
│   │   │   │       ├── org-stats-row.tsx
│   │   │   │       ├── jobs-performance-table.tsx
│   │   │   │       └── recent-applications.tsx
│   │   │   │
│   │   │   ├── org/jobs/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── _components/
│   │   │   │       └── org-job-list.tsx
│   │   │   │
│   │   │   ├── org/jobs/new/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _components/
│   │   │   │       ├── post-job-stepper.tsx
│   │   │   │       ├── step-basics.tsx
│   │   │   │       ├── step-details.tsx
│   │   │   │       ├── step-requirements.tsx
│   │   │   │       └── step-review.tsx
│   │   │   │
│   │   │   ├── org/jobs/[id]/
│   │   │   │   ├── edit/page.tsx
│   │   │   │   └── applications/
│   │   │   │       ├── page.tsx
│   │   │   │       └── _components/
│   │   │   │           ├── kanban-board.tsx
│   │   │   │           ├── kanban-column.tsx
│   │   │   │           ├── candidate-card.tsx
│   │   │   │           └── application-panel.tsx
│   │   │   │
│   │   │   ├── org/incentives/
│   │   │   │   ├── page.tsx
│   │   │   │   └── _components/
│   │   │   │       ├── incentive-table.tsx
│   │   │   │       └── pay-incentive-modal.tsx
│   │   │   │
│   │   │   ├── org/profile/page.tsx
│   │   │   ├── org/billing/page.tsx
│   │   │   └── org/settings/page.tsx
│   │   │
│   │   └── (admin)/                            # Protected: Admin dashboard
│   │       ├── layout.tsx                      # Sidebar layout (ADMIN role)
│   │       │
│   │       ├── admin/dashboard/
│   │       │   ├── page.tsx
│   │       │   └── _components/
│   │       │       ├── platform-stats.tsx
│   │       │       ├── charts-row.tsx
│   │       │       ├── pending-actions-table.tsx
│   │       │       └── activity-log.tsx
│   │       │
│   │       ├── admin/users/
│   │       │   ├── page.tsx
│   │       │   ├── loading.tsx
│   │       │   ├── _components/
│   │       │   │   ├── users-table.tsx
│   │       │   │   └── user-detail-modal.tsx
│   │       │   └── [id]/page.tsx
│   │       │
│   │       ├── admin/organizations/
│   │       │   ├── page.tsx
│   │       │   ├── _components/
│   │       │   │   ├── orgs-table.tsx
│   │       │   │   └── org-detail-modal.tsx
│   │       │   └── [id]/page.tsx
│   │       │
│   │       ├── admin/jobs/
│   │       │   ├── page.tsx
│   │       │   └── _components/
│   │       │       └── admin-jobs-table.tsx
│   │       │
│   │       ├── admin/subscriptions/
│   │       │   ├── page.tsx
│   │       │   └── _components/
│   │       │       └── subscriptions-table.tsx
│   │       │
│   │       ├── admin/incentives/
│   │       │   ├── page.tsx
│   │       │   └── _components/
│   │       │       └── admin-incentives-table.tsx
│   │       │
│   │       ├── admin/transactions/page.tsx
│   │       └── admin/plans/
│   │           ├── page.tsx
│   │           └── _components/
│   │               ├── plans-table.tsx
│   │               └── plan-form-modal.tsx
│   │
│   ├── components/                             # ROOT-LEVEL — truly shared components only
│   │   │
│   │   ├── ui/                                 # shadcn/ui primitives (auto-generated, never edit)
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
│   │   │   ├── skeleton.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── ...                             # All shadcn components live here
│   │   │
│   │   ├── layout/                             # Structural layout components
│   │   │   ├── public-navbar.tsx               # Public site nav
│   │   │   ├── public-footer.tsx
│   │   │   ├── auth-split-layout.tsx           # Left illustration + right form
│   │   │   ├── dashboard-sidebar.tsx           # USER sidebar nav
│   │   │   ├── org-sidebar.tsx                 # ORGANIZATION sidebar nav
│   │   │   ├── admin-sidebar.tsx               # ADMIN sidebar nav
│   │   │   ├── mobile-bottom-nav.tsx
│   │   │   └── theme-toggle.tsx
│   │   │
│   │   ├── shared/                             # Reusable UI across 2+ pages
│   │   │   ├── job-card.tsx                    # Used on /jobs, /dashboard, /org
│   │   │   ├── company-card.tsx
│   │   │   ├── stat-card.tsx
│   │   │   ├── plan-badge.tsx
│   │   │   ├── status-badge.tsx
│   │   │   ├── data-table.tsx                  # TanStack Table wrapper
│   │   │   ├── pagination.tsx
│   │   │   ├── search-input.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── error-state.tsx
│   │   │   ├── confirm-dialog.tsx
│   │   │   ├── page-header.tsx
│   │   │   └── rich-text-editor.tsx            # TipTap wrapper
│   │   │
│   │   └── forms/                              # Reusable form field components (2+ forms)
│   │       ├── avatar-upload.tsx               # Used in user profile + org profile
│   │       ├── resume-upload.tsx               # Used in user profile + apply modal
│   │       ├── otp-input.tsx                   # 6-box digit input (2fa verify + setup)
│   │       └── password-strength-meter.tsx     # Used in register + reset-password
│   │
│   ├── providers/                              # All React context providers
│   │   ├── index.tsx                           # Root <Providers> — wraps everything in layout.tsx
│   │   ├── query-provider.tsx                  # TanStack Query + Devtools
│   │   ├── theme-provider.tsx                  # next-themes ThemeProvider
│   │   ├── toast-provider.tsx                  # Sonner Toaster
│   │   └── socket-provider.tsx                 # Socket.IO connection context
│   │
│   ├── hooks/                                  # Custom React hooks
│   │   ├── use-auth.ts                         # Auth state from Zustand
│   │   ├── use-theme.ts                        # Theme toggle (wraps next-themes)
│   │   ├── use-socket.ts                       # Socket.IO event subscription
│   │   ├── use-debounce.ts                     # Debounce search inputs
│   │   ├── use-media-query.ts                  # Responsive breakpoint detection
│   │   ├── use-infinite-scroll.ts              # IntersectionObserver for infinite lists
│   │   ├── use-local-storage.ts                # Type-safe localStorage hook
│   │   └── use-copy-to-clipboard.ts
│   │
│   ├── lib/                                    # Singleton instances & pure utilities
│   │   ├── axios.ts                            # Axios instance + interceptors
│   │   ├── query-client.ts                     # TanStack Query client config
│   │   ├── socket.ts                           # Socket.IO client singleton
│   │   ├── stripe.ts                           # loadStripe singleton
│   │   └── utils.ts                            # cn() helper (clsx + tailwind-merge)
│   │
│   ├── services/                               # Thin API call functions (one per endpoint group)
│   │   ├── auth.service.ts                     # login, register, logout, refresh, 2fa
│   │   ├── user.service.ts                     # profile, avatar, resume, saved jobs
│   │   ├── jobs.service.ts                     # public search, detail, categories
│   │   ├── application.service.ts              # apply, list, withdraw
│   │   ├── subscription.service.ts             # plans, checkout, cancel, invoices
│   │   ├── org.service.ts                      # org profile, billing, jobs CRUD
│   │   ├── org-application.service.ts          # Org: list apps, update status, hire
│   │   ├── incentive.service.ts                # pay, dispute
│   │   ├── notification.service.ts             # list, mark read
│   │   └── admin/
│   │       ├── admin-users.service.ts
│   │       ├── admin-orgs.service.ts
│   │       ├── admin-jobs.service.ts
│   │       ├── admin-plans.service.ts
│   │       ├── admin-subscriptions.service.ts
│   │       ├── admin-incentives.service.ts
│   │       └── admin-stats.service.ts
│   │
│   ├── queries/                                # TanStack Query hooks (useQuery / useMutation)
│   │   ├── keys.ts                             # All query key factories
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
│   ├── store/                                  # Zustand stores (global UI + auth state)
│   │   ├── auth.store.ts                       # User/Org/Admin auth state + actions
│   │   ├── ui.store.ts                         # Sidebar open/close, modal flags
│   │   └── notification.store.ts               # Unread notification count
│   │
│   ├── validations/                            # Zod schemas for all forms
│   │   ├── auth.schema.ts
│   │   ├── profile.schema.ts
│   │   ├── job.schema.ts
│   │   ├── application.schema.ts
│   │   └── admin.schema.ts
│   │
│   ├── types/                                  # TypeScript interfaces & types
│   │   ├── api.ts                              # ApiResponse<T>, PaginationMeta, FieldError
│   │   ├── auth.ts                             # IUser, IOrganization, IAdmin
│   │   ├── job.ts
│   │   ├── application.ts
│   │   ├── subscription.ts
│   │   ├── incentive.ts
│   │   ├── notification.ts
│   │   └── index.ts                            # Re-exports
│   │
│   └── constants/                              # All app-wide constants (no magic strings/numbers)
│       ├── routes.ts                           # Type-safe route path constants
│       ├── plans.ts                            # Plan display config: labels, colors, limits
│       ├── query-keys.ts                       # TanStack Query key factories (re-exported from queries/keys.ts)
│       ├── site.ts                             # App name, URLs, nav links, social links
│       ├── api.ts                              # API base URL, timeout, endpoint path segments
│       └── ui.ts                               # Animation durations, breakpoints, z-index scale
│
├── proxy.ts                                    # Next.js 16 auth guard (replaces middleware.ts)
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── .prettierrc
├── .prettierignore
├── .gitignore
├── .env.local                                  # Local env (gitignored)
├── .env.example
├── components.json                             # shadcn/ui config
└── package.json
```

---

## 5. Where Things Live — Quick Reference

| What                         | Where                                           |
| ---------------------------- | ----------------------------------------------- |
| Page-specific component      | `app/[route]/_components/*.tsx`                 |
| Shared component (2+ pages)  | `components/shared/*.tsx`                       |
| Shared form piece (2+ forms) | `components/forms/*.tsx`                        |
| Layout / structural chrome   | `components/layout/*.tsx`                       |
| shadcn/ui primitive          | `components/ui/*.tsx` (auto-generated)          |
| Context provider             | `providers/*.tsx`                               |
| Root provider composition    | `providers/index.tsx` → mounted in `layout.tsx` |
| TypeScript interface / type  | `types/*.ts`                                    |
| Zod form schema              | `validations/*.schema.ts`                       |
| App constant / enum / config | `constants/*.ts`                                |
| API service function         | `services/*.service.ts`                         |
| TanStack Query hook          | `queries/use-*.ts`                              |
| Zustand store                | `store/*.store.ts`                              |
| Custom React hook            | `hooks/use-*.ts`                                |
| Singleton library instance   | `lib/*.ts`                                      |

---

## 6. Environment Variables

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

> All frontend env vars are prefixed `NEXT_PUBLIC_`. Nothing sensitive lives here.
> The backend owns all Stripe secret keys and JWT secrets.

---

## 7. Global CSS — Theme System

Tailwind v4 is CSS-first: no `tailwind.config.js`. All design tokens are CSS custom properties. shadcn/ui reads them automatically. Switching theme = toggling `:root` vs `[data-theme="dark"]` on `<html>` via next-themes.

**You never write `dark:` Tailwind prefixes in component code.**

```css
/* src/app/globals.css */
@import 'tailwindcss';

:root {
  /* Brand */
  --color-brand-navy: #1a1a2e;
  --color-brand-sky: #0ea5e9;
  --color-brand-emerald: #10b981;
  --color-brand-amber: #f59e0b;
  --color-brand-red: #ef4444;

  /* shadcn semantic tokens — Light */
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

  /* Status */
  --status-hired: #10b981;
  --status-rejected: #ef4444;
  --status-pending: #f59e0b;
  --status-review: #3b82f6;
  --status-shortlisted: #8b5cf6;

  /* Plan badges */
  --plan-free: #94a3b8;
  --plan-basic: #0ea5e9;
  --plan-premium: #f59e0b;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Radius */
  --radius: 0.5rem;
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
```

---

## 8. Providers Architecture

All providers are composed in `src/providers/index.tsx` and mounted once in the root `layout.tsx`.

```tsx
// src/providers/index.tsx
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { ToastProvider } from './toast-provider';
import { SocketProvider } from './socket-provider';

export function Providers({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <ThemeProvider>
      <QueryProvider>
        <SocketProvider>
          {children}
          <ToastProvider />
        </SocketProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

// src/app/layout.tsx
import { Providers } from '@/providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## 9. TypeScript Configuration

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
      "@app-types/*": ["./src/types/*"],
      "@constants/*": ["./src/constants/*"],
      "@providers/*": ["./src/providers/*"],
    },
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"],
}
```

**Two new aliases added vs v1.0:**

- `@constants/*` → `src/constants/*`
- `@providers/*` → `src/providers/*`

---

## 10. Path Aliases — Always Use These

```typescript
// ✅ Correct
import { cn } from '@lib/utils';
import { useAuthStore } from '@store/auth.store';
import type { Job } from '@app-types/job';
import { queryKeys } from '@queries/keys';
import { Button } from '@ui/button';
import { ROUTES } from '@constants/routes';
import { Providers } from '@providers/index';

// ❌ Never
import { cn } from '../../lib/utils';
```

| Alias            | Maps to               |
| ---------------- | --------------------- |
| `@/*`            | `src/*`               |
| `@ui/*`          | `src/components/ui/*` |
| `@components/*`  | `src/components/*`    |
| `@hooks/*`       | `src/hooks/*`         |
| `@lib/*`         | `src/lib/*`           |
| `@services/*`    | `src/services/*`      |
| `@queries/*`     | `src/queries/*`       |
| `@store/*`       | `src/store/*`         |
| `@validations/*` | `src/validations/*`   |
| `@app-types/*`   | `src/types/*`         |
| `@constants/*`   | `src/constants/*`     |
| `@providers/*`   | `src/providers/*`     |

---

## 11. ESLint Configuration

```js
// eslint.config.mjs
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
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
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

## 12. Prettier Configuration

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

---

## 13. Next.js Configuration

```ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { hostname: 'res.cloudinary.com' },
      { hostname: 'lh3.googleusercontent.com' },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
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
};

export default nextConfig;
```

---

## 14. Auth Guard — proxy.ts

```ts
// proxy.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/jobs', '/companies', '/pricing', '/salary-guide'];
const AUTH_PATHS = [
  '/login', '/register', '/register-org',
  '/forgot-password', '/reset-password', '/verify-email', '/2fa',
];
const ROLE_PATHS = {
  USER: '/dashboard',
  ORGANIZATION: '/org',
  ADMIN: '/admin',
} as const;

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;
  const role = request.cookies.get('userRole')?.value as keyof typeof ROLE_PATHS | undefined;

  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isProtected = Object.values(ROLE_PATHS).some((p) => pathname.startsWith(p));

  if (isAuthPage && token !== undefined) {
    const home = role !== undefined ? ROLE_PATHS[role] : '/dashboard';
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (isProtected && token === undefined) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

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

## 15. Axios Instance

```ts
// src/lib/axios.ts
import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && originalRequest._retry !== true) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/user/refresh-token`,
          {},
          { withCredentials: true },
        );
        return api(originalRequest);
      } catch {
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

## 16. TanStack Query Setup

```ts
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
});
```

---

## 17. Git Hooks — Husky + lint-staged + commit-msg

### Setup

```bash
npm install -D husky lint-staged
npx husky init
```

### Pre-commit hook

```sh
# .husky/pre-commit
npx lint-staged
```

### Commit-msg hook (Conventional Commits enforced)

```sh
# .husky/commit-msg
npx --no -- commitlint --edit "$1"
```

Install commitlint:

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

Commitlint config:

```js
// commitlint.config.js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type must be one of these
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation only
        'style', // Formatting, missing semi-colons — no logic change
        'refactor', // Code change that is neither fix nor feat
        'perf', // Performance improvement
        'test', // Adding or fixing tests
        'build', // Build system or dependency changes
        'ci', // CI configuration changes
        'chore', // Maintenance (husky, lint config, etc.)
        'revert', // Reverts a previous commit
      ],
    ],
    // Scope is optional but must be lowercase if provided
    'scope-case': [2, 'always', 'lower-case'],
    // Subject must not be empty
    'subject-empty': [2, 'never'],
    // Subject must not end with a period
    'subject-full-stop': [2, 'never', '.'],
    // Subject must start with lowercase
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    // Header (type + scope + subject) max 100 chars
    'header-max-length': [2, 'always', 100],
    // Body must have a blank line before it
    'body-leading-blank': [1, 'always'],
    // Footer must have a blank line before it
    'footer-leading-blank': [1, 'always'],
  },
};
```

### Valid commit message examples

```bash
# ✅ Correct
git commit -m "feat(auth): add login form with email and password"
git commit -m "fix(jobs): correct salary range display on mobile"
git commit -m "docs: update README with new folder structure"
git commit -m "refactor(dashboard): extract stats-row into shared component"
git commit -m "chore: upgrade TanStack Query to v5.x"
git commit -m "style(landing): fix hero section spacing on tablet"
git commit -m "perf(job-list): add virtualization for large result sets"

# ❌ Wrong — these will be rejected by commitlint
git commit -m "Updated login"         # Missing type
git commit -m "FEAT: add login"       # Uppercase type
git commit -m "feat: Add Login Form." # Uppercase subject + trailing period
git commit -m "WIP"                   # No type, too vague
```

### lint-staged config

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
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

## 19. GitHub Actions CI/CD

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
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run format:check

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
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
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
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 20. Adding a New Feature — Checklist

```text
□ 1.  Add/update Zod schema            src/validations/*.schema.ts
□ 2.  Add TypeScript types             src/types/*.ts
□ 3.  Add constants (if any)           src/constants/*.ts
□ 4.  Add API service function         src/services/*.service.ts
□ 5.  Add query key                    src/queries/keys.ts
□ 6.  Add TanStack Query hook          src/queries/use-*.ts
□ 7.  Build page-specific components   src/app/[route]/_components/*.tsx
□ 8.  Move to shared if reused         src/components/shared/*.tsx
□ 9.  Move to forms/ if reused form    src/components/forms/*.tsx
□ 10. Add page route                   src/app/**/page.tsx (RSC default)
□ 11. Add loading.tsx + error.tsx      siblings if the page fetches data
□ 12. Update proxy.ts                  if the route needs auth guarding
□ 13. No dark: prefixes               — all theming via CSS vars
```

---

## 21. RSC vs Client Component — Decision Rule

```text
Default → Server Component (no "use client")

Add "use client" when the component uses:
  ✓ useState / useReducer / useEffect / useRef / useCallback / useMemo
  ✓ Browser APIs (window, document, navigator)
  ✓ Event handlers (onClick, onChange, onSubmit)
  ✓ TanStack Query hooks (useQuery, useMutation)
  ✓ Zustand store hooks
  ✓ Socket.IO hooks
  ✓ Framer Motion animations
  ✓ react-hook-form
  ✓ next-themes (useTheme)

Stay Server Component:
  ✓ Layouts that just wrap children
  ✓ Pages that only pass data down via props
  ✓ Static or infrequently changing UI
  ✓ generateMetadata functions
```

---

## 22. Theming Rule — Critical

```typescript
// ✅ Correct — uses CSS variable that shifts with theme automatically
<div className="text-muted-foreground" />
<div style={{ color: 'var(--muted-foreground)' }} />

// ❌ Wrong — hardcoded dark: prefix bypasses the CSS var system
<div className="text-gray-500 dark:text-gray-400" />
```

---

## 23. Phase Roadmap

| Phase  | Description                                                    | Status         |
| ------ | -------------------------------------------------------------- | -------------- |
| **4A** | Project setup, design system, global CSS, shadcn init          | ✅ Complete    |
| **4B** | Public layout, landing page, job search, job detail            | 🔄 In progress |
| **4C** | Auth pages (login, register, 2FA, password reset)              | ⏳ Pending     |
| **4D** | User dashboard (overview, applications, saved jobs, profile)   | ⏳ Pending     |
| **4E** | Subscription & billing (Stripe Elements, plan upgrade)         | ⏳ Pending     |
| **4F** | Organization dashboard (post job, kanban pipeline, incentives) | ⏳ Pending     |
| **4G** | Admin dashboard (stats, user/org/job management)               | ⏳ Pending     |
| **4H** | Real-time (Socket.IO notifications, live status updates)       | ⏳ Pending     |
| **4I** | Company directory, salary guide, reviews (future)              | ⏳ Pending     |
| **5**  | E2E tests (Playwright), Vercel deploy, Google/LinkedIn OAuth   | ⏳ Pending     |

---

_Last updated: Phase 4A complete. Architecture updated: co-location pattern, providers/, constants/._
_Maintained by: Joyram49 (Joy Ram Das)_
_Repo: <https://github.com/Joyram49/career-arch-frontend>_
