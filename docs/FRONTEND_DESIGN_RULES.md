# ═══════════════════════════════════════════════════════════════

# CAREERARCH FRONTEND — MASTER ARCHITECTURE INSTRUCTIONS

# ═══════════════════════════════════════════════════════════════

# Claude MUST read and follow ALL rules before writing any code.

# ═══════════════════════════════════════════════════════════════

## ROLE

You are a senior frontend architect and UI engineer specialized in:

- Next.js 16 App Router
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- Scalable component architecture
- Design-system-driven development
- Figma-to-production implementation

---

## 1. TECH STACK — NON-NEGOTIABLE

### ALWAYS USE:

- Next.js 16 App Router
- React 19
- TypeScript (strict mode, no `any`)
- Tailwind CSS v4 utility classes
- shadcn/ui components
- Framer Motion (only where animation improves UX)
- `next/link` for all internal navigation
- `next/image` for all images

### NEVER USE:

- Plain CSS files / SCSS / Styled-components / Emotion
- Massive inline style objects
- `<img>` or `<a>` tags (use next/image, next/link)
- Monolithic page components
- Hardcoded hex colors when a design token exists
- `dark:` Tailwind prefixes (CSS vars handle theming automatically)

---

## 2. STYLING RULES — CRITICAL

### 2a. ALWAYS USE GLOBAL DESIGN TOKENS FIRST

The project has CSS custom properties in `globals.css` and Tailwind mappings.
You MUST use them. NEVER reinvent styles.

#### SEMANTIC COLOR CLASSES (use these, not raw colors):

```
bg-background           → page background (#f8fafc light / #0f172a dark)
text-foreground         → primary text (#0f172a light / #f1f5f9 dark)
bg-card                 → card background (#ffffff / #1e293b)
text-card-foreground    → card text
bg-muted                → subtle backgrounds (#f1f5f9 / #1e293b)
text-muted-foreground   → secondary text (#64748b / #94a3b8)
bg-primary              → primary action (navy #1a1a2e / sky #0ea5e9 dark)
text-primary-foreground → text on primary
bg-destructive          → danger (#ef4444)
border-border           → all borders (#e2e8f0 / #334155)
bg-input                → input backgrounds (#f1f5f9)
ring-ring               → focus rings (#0ea5e9)
```

#### BRAND COLOR CLASSES:

```
bg-brand-navy         → #1a1a2e
text-brand-navy
bg-brand-sky          → #0ea5e9
text-brand-sky
bg-brand-emerald      → #10b981
text-brand-emerald
bg-brand-amber        → #f59e0b
text-brand-amber
bg-brand-red          → #ef4444
text-brand-red
```

#### STATUS BADGE CLASSES:

```
text-status-hired       → #10b981 (green)
text-status-rejected    → #ef4444 (red)
text-status-pending     → #f59e0b (amber)
text-status-review      → #3b82f6 (blue)
text-status-shortlisted → #8b5cf6 (purple)
```

#### PLAN BADGE CLASSES:

```
text-plan-free    → #94a3b8 (gray)
text-plan-basic   → #0ea5e9 (sky)
text-plan-premium → #f59e0b (amber)
```

### 2b. TAILWIND PRIORITY ORDER

1. Semantic utility classes (`bg-card`, `text-foreground`)
2. Standard Tailwind utilities (`p-4`, `flex`, `gap-3`, `rounded-xl`)
3. Responsive variants (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
4. Inline style ONLY as last resort

### 2c. INLINE STYLE — ONLY ALLOWED WHEN:

- Tailwind cannot achieve it (e.g. complex gradients, masks, dynamic values)
- Even then: keep it minimal, never large style objects

### 2d. FORBIDDEN PATTERNS:

```tsx
// ❌ NEVER — raw hex when token exists
bg-[#0f172a]                    → use bg-background or bg-brand-navy
text-[#64748b]                  → use text-muted-foreground
rounded-[13px]                  → use rounded-xl or rounded-2xl
shadow-[0_2px_10px_rgba(...)]   → use shadow-card, shadow-dropdown, shadow-modal

// ❌ NEVER — dark: prefix
className="text-gray-500 dark:text-gray-400"

// ✅ CORRECT — CSS var handles both modes automatically
className="text-muted-foreground"
```

### 2e. RADIUS TOKENS:

```
rounded-sm   → 4px
rounded-md   → 8px   (--radius-md)
rounded-lg   → 12px  (--radius-lg)
rounded-xl   → 16px  (--radius-xl)
rounded-2xl  → 24px  (--radius-2xl)
rounded-full → pill
```

### 2f. SHADOW TOKENS:

```
shadow-sm       → subtle hover
shadow-card     → card elevation
shadow-dropdown → dropdowns / popovers
shadow-modal    → modals / sheets
```

---

## 3. COMPONENT ARCHITECTURE RULES

### 3a. FOLDER STRUCTURE — ALWAYS:

```
app/
└── (auth)/
    └── login/
        ├── page.tsx              ← RSC: layout only, imports components
        ├── loading.tsx           ← Suspense skeleton
        └── _components/
            ├── login-form.tsx    ← "use client" form component
            ├── auth-sidebar.tsx  ← Left panel (RSC)
            └── social-auth.tsx   ← OAuth buttons
```

Never put all code in `page.tsx`. Always split into `_components/`.

### 3b. PAGE FILE RULE:

`page.tsx` must only:

- Import and compose components
- Handle server-side data fetching
- Export metadata
- Never contain JSX business logic

### 3c. COMPONENT SIZE RULE:

- Max ~80–120 lines per component file
- If growing larger → split into sub-components
- One responsibility per file

---

## 4. ICON RULES ✅

### Icon file locations (FIXED):

```
src/
└── assets/
    └── icons/
        ├── custom/
        │   └── index.tsx   ← ALL custom hand-crafted SVG icons live here (named exports)
        └── <set-name>/     ← Downloaded icon sets (e.g. heroicons, iconoir)
```

### Rules:

- **Custom SVG icons** → ALWAYS go in `@assets/icons/custom/index.tsx` as named exports
- **Downloaded icons** → place in `@assets/icons/<set-name>/`
- Multiple custom icons → all in the SAME `index.tsx` file, not separate files
- Every icon MUST accept `className` via `React.SVGProps<SVGSVGElement>`
- Always use `currentColor` — never hardcode fill/stroke colors
- Icons are reusable — never duplicate SVG code across components

### Correct pattern:

```tsx
// src/assets/icons/custom/index.tsx
type IconProps = React.SVGProps<SVGSVGElement>;

export function MailIcon(props: IconProps): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="22,6 12,13 2,6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LockIcon(props: IconProps): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      {/* ... */}
    </svg>
  );
}
// All other custom icons follow the same pattern in this file
```

### Usage:

```tsx
import { MailIcon, LockIcon, EyeOpenIcon } from '@assets/icons/custom';

<MailIcon className="size-4 text-muted-foreground" />
```

---

## 5. SHADCN/UI RULES ✅

### ALWAYS USE shadcn components when available:

| Need         | Use shadcn       |
| ------------ | ---------------- |
| Button       | `<Button>`       |
| Input        | `<Input>`        |
| Checkbox     | `<Checkbox>`     |
| Label        | `<Label>`        |
| Card         | `<Card>`         |
| Dialog/Modal | `<Dialog>`       |
| Sheet        | `<Sheet>`        |
| Dropdown     | `<DropdownMenu>` |
| Table        | `<Table>`        |
| Tabs         | `<Tabs>`         |
| Select       | `<Select>`       |
| Popover      | `<Popover>`      |
| Tooltip      | `<Tooltip>`      |
| Skeleton     | `<Skeleton>`     |
| Badge        | `<Badge>`        |
| Avatar       | `<Avatar>`       |
| Separator    | `<Separator>`    |
| Switch       | `<Switch>`       |

### ⚠️ DEPRECATED — DO NOT USE:

```tsx
// ❌ shadcn <Form>, <FormField>, <FormItem>, <FormLabel>,
//    <FormControl>, <FormMessage> — ALL DEPRECATED in updated shadcn.
// DO NOT install or import from @ui/form.
// use Field instead, import <Field>, <FieldContent>, <FieldDescription>, <FieldError>, <FieldGroup>, <FieldLabel>, <FieldLegend>, <FieldSeparator>, <FieldSet>, <FieldTitle>,
```

Never rebuild from scratch what shadcn already provides.
Wrap and extend shadcn — never replace it.

---

## 6. FORM RULES ✅ (UPDATED)

### ALWAYS:

- Use `react-hook-form` + `zod` + shadcn `Input` / `Label` / `Button` / `Checkbox`
- Import schemas from `@validations/` — NEVER define schemas inline in components
- Use shadcn latest `Field` component that provides similar approach like form but more advanced and optimized way

### NEVER:

- Use shadcn `<Form>`, `<FormField>`, `<FormItem>`, `<FormControl>`, `<FormMessage>` — DEPRECATED
- Define zod schemas inside component files
- Use `useForm` with `zodResolver` without typing the generic correctly

### Correct form pattern:

```tree
Field
├── FieldLabel
├── Input / Textarea / Switch / Select
├── FieldDescription
└── FieldError

FieldGroup
├── Field
│   ├── FieldLabel
│   ├── Input / Textarea / Switch / Select
│   ├── FieldDescription
│   └── FieldError
├── FieldSeparator
└── Field
    ├── FieldLabel
    └── Input / Textarea / Switch / Select

FieldSet
├── FieldLegend
├── FieldDescription
└── FieldGroup
    ├── Field
    │   ├── FieldLabel
    │   ├── Input / Textarea / Switch / Select
    │   ├── FieldDescription
    │   └── FieldError
    └── Field
        ├── FieldLabel
        └── Input / Textarea / Switch / Select

```

```tsx
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  about: z
    .string()
    .min(10, "Please provide at least 10 characters.")
    .max(200, "Please keep it under 200 characters."),
})

export function FormRhfTextarea() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      about: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Personalization</CardTitle>
        <CardDescription>
          Customize your experience by telling us more about yourself.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-textarea" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="about"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-textarea-about">
                    More about you
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="form-rhf-textarea-about"
                    aria-invalid={fieldState.invalid}
                    placeholder="I'm a software engineer..."
                    className="min-h-[120px]"
                  />
                  <FieldDescription>
                    Tell us more about yourself. This will be used to help us
                    personalize your experience.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-textarea">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

```

### zodResolver type mismatch fix:

When zod uses `.optional().default(false)`, the inferred `z.infer<>` input type
has `rememberMe?: boolean | undefined`, but resolver expects `rememberMe: boolean`.
Fix with explicit cast:

```tsx
import type { Resolver } from 'react-hook-form';

const {
  register,
  handleSubmit,
} = useForm<LoginInput>({
  resolver: zodResolver(loginSchema) as Resolver<LoginInput>,
  defaultValues: { email: '', password: '', rememberMe: false },
});
```

---

## 7. FRAMER MOTION RULES ✅ (UPDATED)

### USE Framer Motion for:

- Page/section enter animations (fade + slide in)
- Staggered list items
- Modal/sheet transitions
- Hover lift effects on cards

### DO NOT use for:

- Simple hover states (use Tailwind `hover:` instead)
- Every element on the page
- Animations that distract from content

### ⚠️ TYPE-SAFE VARIANT PATTERN — ALWAYS import `Variants` type:

```tsx
import { motion, type Variants } from 'framer-motion';

// ✅ CORRECT — typed Variants + cubic-bezier array for ease
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94] as const, // cubic-bezier — NOT a string
    },
  },
};
```

### ❌ ERRORS TO AVOID:

```tsx
// ❌ ease as string → TypeScript error "string not assignable to Easing"
transition: { duration: 0.35, ease: 'easeOut' }

// ✅ ease as cubic-bezier tuple
transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const }

// ❌ Variants not typed → TS error on variants prop
const myVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } }

// ✅ Always type Variants
const myVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } }
```

### Easing cubic-bezier reference:

```tsx
// easeOut   → [0.25, 0.46, 0.45, 0.94]
// easeIn    → [0.55, 0.055, 0.675, 0.19]
// easeInOut → [0.645, 0.045, 0.355, 1.0]
// For springs → use type: 'spring', stiffness: 300, damping: 30
```

---

## 8. RSC vs CLIENT RULE

```
Default → Server Component (no directive)

Add 'use client' ONLY when using:
  - useState / useEffect / useRef
  - Event handlers (onClick, onChange)
  - TanStack Query hooks
  - Zustand stores
  - Framer Motion
  - react-hook-form
  - Browser APIs
  - Socket.IO hooks
  - next-themes (useTheme)

Stay Server Component:
  - Layouts wrapping children
  - Pages composing components
  - Static/infrequently changing UI
  - generateMetadata functions
```

---

## 9. TYPESCRIPT RULES

```tsx
// ✅ Always explicit return types
export function LoginForm(): React.JSX.Element {}

// ✅ Type-only imports for types
import type { LoginInput } from '@validations/auth.schema';
import { motion, type Variants } from 'framer-motion'; // mixed ok

// ✅ No any — find the real type
// ✅ No ! assertions — use null checks
// ✅ Named exports (default only for page.tsx / layout.tsx)
// ✅ Cast resolver when optional().default() causes type mismatch:
import type { Resolver } from 'react-hook-form';
resolver: zodResolver(loginSchema) as Resolver<LoginInput>
```

---

## 10. RESPONSIVENESS RULES

### Mobile-first, always:

```tsx
className="flex-col md:flex-row"    // ✅
className="px-4 md:px-8 lg:px-12"  // ✅
className="text-2xl md:text-3xl"    // ✅
className="flex-row"                // ❌ desktop-first
```

### Breakpoints:

- `sm:` → 640px (large phones)
- `md:` → 768px (tablets, layout shifts)
- `lg:` → 1024px (laptops)
- `xl:` → 1280px (desktops)
- `2xl:` → 1536px (large screens)

---

## 11. ACCESSIBILITY RULES

- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<header>`, `<form>`
- `aria-label` on every icon-only button
- ALWAYS pair `<Label htmlFor="id">` with `<Input id="id">`
- Error messages: add `role="alert"` for screen readers
- Focus ring: `focus-visible:ring-2 focus-visible:ring-ring`
- One `<h1>` per page, then `<h2>`, `<h3>`
- `alt` text on all images

---

## 12. FIGMA-TO-CODE ANALYSIS CHECKLIST

```
□ Layout structure (split / grid / sidebar / centered)
□ Spacing system (map to Tailwind gap/p/m scale)
□ Typography scale (map to text-sm/base/lg/xl/2xl/3xl)
□ Component repetition → extract to reusable component
□ Interactive states (hover, focus, active, disabled, loading)
□ Responsive behavior (how it collapses on mobile)
□ Which design tokens cover the colors/shadows/radius
□ Which shadcn components can handle this
□ Where Framer Motion adds value (Variants + cubic-bezier)
```

---

## 13. FILE OUTPUT FORMAT

When generating a page, ALWAYS provide:

```
1. Folder structure
2. Component breakdown (which file does what)
3. Full typed code for each file
4. Required shadcn install commands
5. Any new npm packages needed
6. Notes on reusable abstractions
```

---

## 14. CODE QUALITY CHECKLIST

Before finalizing any component, verify:

```
□ No raw hex values (use tokens)
□ No dark: prefixes (CSS vars handle it)
□ No inline style objects (unless gradient/mask required)
□ No <img> or <a> tags
□ No any types
□ No monolithic components (max ~120 lines/file)
□ shadcn used where available
□ shadcn <Form> / <FormField> / <FormItem> NOT used — DEPRECATED
□ Proper TypeScript types throughout
□ Framer Motion Variants typed + ease as cubic-bezier array
□ zodResolver cast as Resolver<T> if optional().default() mismatch
□ Mobile-first responsive
□ Accessible (Label+id, role="alert" on errors, aria-label on icon btns)
□ Named exports (default only for page.tsx)
□ Explicit return types on all functions
□ Path aliases used (@ui/, @components/, @lib/, @assets/, @validations/)
□ Custom icons in @assets/icons/custom/index.tsx, use currentColor
□ Schemas imported from @validations/auth.schema — never defined inline
```

---

## 15. PATH ALIASES (always use these)

```tsx
// UI & Components
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { LoginForm } from '@components/auth/login-form';

// Hooks, lib, store, services
import { useAuth } from '@hooks/use-auth';
import { cn } from '@lib/utils';
import { useAuthStore } from '@lib/store/auth.store'; // all library base service you can get inside lib folder like socket.io, zustand, axios etc
import { loginService } from '@services/auth.service'; // auth, dashboard (user, org, admin) you can get here as server function if page don't need for seo

// Queries keys
import { queryKeys } from '@constants/queryKeys.ts';

// query
import { getAllJobs} from '@helpers/public/jobs.ts' // here you can get all mutation and queries that will served for client component

// Types
import type { LoginInput } from '@app-types/auth';

// Validations — ALWAYS import from here, NEVER define inline
import { loginSchema } from '@validations/auth.schema';
import type { LoginInput } from '@validations/auth.schema';

// Icons — custom icons always from this path
import { MailIcon, LockIcon, EyeOpenIcon } from '@assets/icons/custom';
```

---

_Last updated: Phase 4B — icons path fix, shadcn Form deprecated, Framer Motion
Variants type fix, zodResolver cast fix, schemas always from @validations/_
_Follow ALL rules before writing any component code._
