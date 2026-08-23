'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { motion, type Variants } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Controller, useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@lib/utils';
import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { Input } from '@ui/input';
import { Switch } from '@ui/switch';
import { AdminPageHeader } from '../_components/shared';

/* ── Types & schema ─────────────────────────────────────────── */
type PlanName = 'FREE' | 'BASIC' | 'PREMIUM';

interface AdminPlan {
  id: string;
  name: PlanName;
  price: number;
  applyMonthlyLimit: number | null; // null = unlimited
  savedJobsLimit: number | null;
  canViewOrgProfile: boolean;
  hasEarlyAlerts: boolean;
  hasResumeVersions: boolean;
  hasAiResumeTips: boolean;
  hasPrioritySearch: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  isActive: boolean;
}

const planSchema = z.object({
  name: z.enum(['FREE', 'BASIC', 'PREMIUM']),
  price: z.number().min(0),
  applyMonthlyLimit: z.number().nullable(),
  savedJobsLimit: z.number().nullable(),
  canViewOrgProfile: z.boolean(),
  hasEarlyAlerts: z.boolean(),
  hasResumeVersions: z.boolean(),
  hasAiResumeTips: z.boolean(),
  hasPrioritySearch: z.boolean(),
});
type PlanFormInput = z.infer<typeof planSchema>;

/* ── Mock data ─────────────────────────────────────────────── */
const MOCK_PLANS: AdminPlan[] = [
  {
    id: '1',
    name: 'FREE',
    price: 0,
    applyMonthlyLimit: 5,
    savedJobsLimit: 5,
    canViewOrgProfile: false,
    hasEarlyAlerts: false,
    hasResumeVersions: false,
    hasAiResumeTips: false,
    hasPrioritySearch: false,
    isActive: true,
  },
  {
    id: '2',
    name: 'BASIC',
    price: 9.99,
    applyMonthlyLimit: 30,
    savedJobsLimit: 50,
    canViewOrgProfile: true,
    hasEarlyAlerts: true,
    hasResumeVersions: true,
    hasAiResumeTips: false,
    hasPrioritySearch: false,
    stripeProductId: 'prod_abc',
    stripePriceId: 'price_abc',
    isActive: true,
  },
  {
    id: '3',
    name: 'PREMIUM',
    price: 24.99,
    applyMonthlyLimit: null,
    savedJobsLimit: null,
    canViewOrgProfile: true,
    hasEarlyAlerts: true,
    hasResumeVersions: true,
    hasAiResumeTips: true,
    hasPrioritySearch: true,
    stripeProductId: 'prod_xyz',
    stripePriceId: 'price_xyz',
    isActive: true,
  },
];

const PLAN_COLORS: Record<PlanName, { badge: string; dot: string }> = {
  FREE: { badge: 'bg-slate-100 text-slate-500 border border-slate-200', dot: '#94a3b8' },
  BASIC: { badge: 'bg-sky-50 text-sky-700 border border-sky-200', dot: '#0ea5e9' },
  PREMIUM: { badge: 'bg-amber-50 text-amber-700 border border-amber-200', dot: '#f59e0b' },
};

const FEATURE_KEYS: Array<{ key: keyof AdminPlan; label: string }> = [
  { key: 'canViewOrgProfile', label: 'View org profiles' },
  { key: 'hasEarlyAlerts', label: 'Early job alerts' },
  { key: 'hasResumeVersions', label: 'Resume versions' },
  { key: 'hasAiResumeTips', label: 'AI resume tips' },
  { key: 'hasPrioritySearch', label: 'Priority in search' },
];

/* ── Plan form modal ─────────────────────────────────────────── */
function PlanFormModal({
  plan,
  open,
  onClose,
}: {
  plan: AdminPlan | null;
  open: boolean;
  onClose: () => void;
}): React.JSX.Element {
  const isEdit = plan !== null;

  const {
    control,
    handleSubmit,
    formState: { _errors },
    _watch,
  } = useForm<PlanFormInput>({
    resolver: zodResolver(planSchema) as Resolver<PlanFormInput>,
    defaultValues: {
      name: plan?.name ?? 'BASIC',
      price: plan?.price ?? 9.99,
      applyMonthlyLimit: plan?.applyMonthlyLimit ?? 30,
      savedJobsLimit: plan?.savedJobsLimit ?? 50,
      canViewOrgProfile: plan?.canViewOrgProfile ?? false,
      hasEarlyAlerts: plan?.hasEarlyAlerts ?? false,
      hasResumeVersions: plan?.hasResumeVersions ?? false,
      hasAiResumeTips: plan?.hasAiResumeTips ?? false,
      hasPrioritySearch: plan?.hasPrioritySearch ?? false,
    },
  });

  function onSubmit(_data: PlanFormInput): void {
    // TODO: call POST/PUT /admin/plans → Stripe product/price sync
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isEdit ? `Edit ${plan?.name} Plan` : 'Create New Plan'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Changes sync automatically to Stripe Products &amp; Prices via the backend.
          </DialogDescription>
        </DialogHeader>

        <form id="plan-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup className="space-y-4">
            {/* Name */}
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="plan-name"
                    className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                  >
                    Plan Name
                  </FieldLabel>
                  <select
                    {...field}
                    id="plan-name"
                    disabled={isEdit}
                    className="h-10 w-full rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="FREE">FREE</option>
                    <option value="BASIC">BASIC</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Price */}
            <Controller
              name="price"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="plan-price"
                    className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                  >
                    Price (USD/month)
                  </FieldLabel>
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                      $
                    </span>
                    <Input
                      {...field}
                      id="plan-price"
                      type="number"
                      min={0}
                      step={0.01}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      className="h-10 pl-7 text-sm"
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Limits */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="applyMonthlyLimit"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="apply-limit"
                      className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                    >
                      Apply Limit/Month
                    </FieldLabel>
                    <Input
                      id="apply-limit"
                      type="number"
                      min={0}
                      placeholder="null = unlimited"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? null : parseInt(e.target.value))
                      }
                      className="h-10 text-sm"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="savedJobsLimit"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="save-limit"
                      className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                    >
                      Saved Jobs Limit
                    </FieldLabel>
                    <Input
                      id="save-limit"
                      type="number"
                      min={0}
                      placeholder="null = unlimited"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? null : parseInt(e.target.value))
                      }
                      className="h-10 text-sm"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* Feature toggles */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase">
                Features
              </p>
              <div className="divide-y divide-border rounded-lg border border-border bg-muted/30">
                {FEATURE_KEYS.map((f) => (
                  <Controller
                    key={f.key}
                    name={f.key as keyof PlanFormInput}
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center justify-between px-4 py-2.5">
                        <label htmlFor={f.key} className="text-sm text-foreground">
                          {f.label}
                        </label>
                        <Switch
                          id={f.key}
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Stripe note */}
            {isEdit && plan?.stripeProductId && (
              <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs text-sky-800">
                <strong>Stripe Sync:</strong> Changing the price will archive the existing Stripe
                Price and create a new one. Existing subscribers keep their current price until
                renewal.
                <br />
                <span className="mt-1 block text-[10px] text-sky-600">
                  Product: {plan.stripeProductId} · Price: {plan.stripePriceId}
                </span>
              </div>
            )}
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="plan-form"
            className="bg-brand-navy text-white hover:bg-brand-navy/90"
          >
            {isEdit ? 'Save Changes' : 'Create Plan & Sync to Stripe'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Variants ─────────────────────────────────────────────── */
const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

/* ── Page ─────────────────────────────────────────────────── */
export default function AdminPlansPage(): React.JSX.Element {
  const [editTarget, setEdit] = useState<AdminPlan | null>(null);
  const [isCreating, setCreate] = useState(false);
  const [toggleTarget, setToggle] = useState<AdminPlan | null>(null);

  const columns = useMemo<ColumnDef<AdminPlan>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Plan',
        cell: ({ getValue }) => {
          const n = getValue<PlanName>();
          const c = PLAN_COLORS[n];
          return (
            <div className="flex items-center gap-2">
              <span className="inline-block size-2.5 rounded-full" style={{ background: c.dot }} />
              <span
                className={cn(
                  'rounded px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase',
                  c.badge,
                )}
              >
                {n}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ getValue }) => {
          const p = getValue<number>();
          return (
            <span className="text-sm font-bold text-foreground">
              {p === 0 ? 'Free' : `$${p.toFixed(2)}/mo`}
            </span>
          );
        },
      },
      {
        accessorKey: 'applyMonthlyLimit',
        header: 'Apply Limit',
        cell: ({ getValue }) => {
          const v = getValue<number | null>();
          return (
            <span className="text-sm text-foreground">
              {v === null ? '∞ Unlimited' : `${v}/mo`}
            </span>
          );
        },
      },
      {
        accessorKey: 'savedJobsLimit',
        header: 'Saved Jobs',
        cell: ({ getValue }) => {
          const v = getValue<number | null>();
          return <span className="text-sm text-foreground">{v === null ? '∞ Unlimited' : v}</span>;
        },
      },
      {
        id: 'features',
        header: 'Features',
        cell: ({ row }) => {
          const p = row.original;
          const enabled = FEATURE_KEYS.filter((f) => !!p[f.key]);
          return (
            <div className="flex flex-wrap gap-1">
              {enabled.map((f) => (
                <span
                  key={f.key}
                  className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700"
                >
                  {f.label}
                </span>
              ))}
              {enabled.length === 0 && (
                <span className="text-xs text-muted-foreground">Basic only</span>
              )}
            </div>
          );
        },
      },
      {
        id: 'stripe',
        header: 'Stripe',
        cell: ({ row }) => {
          const p = row.original;
          if (!p.stripeProductId)
            return <span className="text-xs text-muted-foreground italic">Not synced</span>;
          return (
            <div className="space-y-0.5">
              <code className="block rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                {p.stripeProductId}
              </code>
              <code className="block rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                {p.stripePriceId}
              </code>
            </div>
          );
        },
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => {
          const p = row.original;
          return (
            <button
              type="button"
              onClick={() => setToggle(p)}
              className={cn(
                'rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase transition-all',
                p.isActive
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100',
              )}
              aria-label={`Toggle ${p.name} plan — currently ${p.isActive ? 'active' : 'inactive'}`}
            >
              {p.isActive ? 'Active' : 'Inactive'}
            </button>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center justify-end">
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs"
              onClick={() => setEdit(row.original)}
            >
              <i className="ti ti-edit mr-1 text-xs" aria-hidden="true" />
              Edit
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: MOCK_PLANS,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Subscription Plans"
        description="Manage plan catalogue — synced to Stripe Products &amp; Prices automatically"
        actions={
          <Button
            size="sm"
            className="h-8 gap-1.5 bg-brand-navy text-xs text-white hover:bg-brand-navy/90"
            onClick={() => setCreate(true)}
          >
            <i className="ti ti-plus text-sm" aria-hidden="true" />
            New Plan
          </Button>
        }
      />

      {/* Plan cards overview */}
      <div className="grid grid-cols-3 gap-4 border-b border-border bg-muted/30 px-6 py-4">
        {MOCK_PLANS.map((plan) => {
          const c = PLAN_COLORS[plan.name];
          return (
            <div key={plan.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={cn(
                    'rounded px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase',
                    c.badge,
                  )}
                >
                  {plan.name}
                </span>
                <span className="text-lg font-bold text-foreground">
                  {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  {plan.price > 0 && (
                    <span className="text-xs font-normal text-muted-foreground">/mo</span>
                  )}
                </span>
              </div>
              <ul className="space-y-1">
                <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <i className="ti ti-send text-xs text-brand-sky" aria-hidden="true" />
                  {plan.applyMonthlyLimit === null
                    ? 'Unlimited applies'
                    : `${plan.applyMonthlyLimit} applies/month`}
                </li>
                <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <i className="ti ti-bookmark text-xs text-brand-sky" aria-hidden="true" />
                  {plan.savedJobsLimit === null
                    ? 'Unlimited saved'
                    : `${plan.savedJobsLimit} saved jobs`}
                </li>
                {FEATURE_KEYS.filter((f) => !!plan[f.key]).map((f) => (
                  <li
                    key={f.key}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground"
                  >
                    <i className="ti ti-check text-xs text-brand-emerald" aria-hidden="true" />
                    {f.label}
                  </li>
                ))}
              </ul>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 h-7 w-full px-2 text-xs"
                onClick={() => setEdit(plan)}
              >
                Edit Plan
              </Button>
            </div>
          );
        })}
      </div>

      <motion.div
        className="flex flex-1 flex-col overflow-hidden"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left" aria-label="Plans table">
            <thead className="border-b border-border bg-muted/40">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="px-5 py-3 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-muted/20">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Edit modal */}
      <PlanFormModal plan={editTarget} open={editTarget !== null} onClose={() => setEdit(null)} />

      {/* Create modal */}
      <PlanFormModal plan={null} open={isCreating} onClose={() => setCreate(false)} />

      {/* Toggle active dialog */}
      <Dialog open={toggleTarget !== null} onOpenChange={() => setToggle(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {toggleTarget?.isActive ? 'Deactivate' : 'Activate'} {toggleTarget?.name} Plan?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {toggleTarget?.isActive
                ? 'New users will no longer be able to subscribe to this plan. Existing subscribers are unaffected.'
                : 'This plan will become available for new subscriptions.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToggle(null)}>
              Cancel
            </Button>
            <Button
              className={cn(
                toggleTarget?.isActive
                  ? 'bg-slate-700 text-white hover:bg-slate-800'
                  : 'bg-brand-emerald text-white hover:bg-brand-emerald/90',
              )}
              onClick={() => setToggle(null)}
            >
              {toggleTarget?.isActive ? 'Deactivate Plan' : 'Activate Plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
