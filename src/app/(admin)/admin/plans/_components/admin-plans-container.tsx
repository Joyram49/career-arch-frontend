'use client';
// React Compiler + useReactTable conflict (see admin-organizations-container.tsx):
// without this, the compiler auto-memoizes this container and the table can
// fail to re-render after mutations even though React Query has refetched.
'use no memo';

import { motion, type Variants } from 'framer-motion';
import { useState } from 'react';

import { type IAdminPlanListItem } from '@app-types/admin/admin.dashboard.plans';
import { APIKit } from '@lib/axios';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@ui/button';

import { AdminPageHeader } from '../../_components/shared';
import { AdminPlanDeleteModal } from './admin-plan-delete-modal';
import { AdminPlanFormModal } from './admin-plan-form-modal';
import { AdminPlanToggleModal } from './admin-plan-toggle-modal';
import { AdminPlansTable } from './admin-plans-table';
import { formatLimit, formatPriceCents } from './admin-plans-utils';

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const PLAN_ACCENT: Record<IAdminPlanListItem['key'], string> = {
  FREE: '#94a3b8',
  BASIC: '#0ea5e9',
  PREMIUM: '#f59e0b',
};

export default function AdminPlansContainer(): React.JSX.Element {
  const [editTarget, setEditTarget] = useState<IAdminPlanListItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<IAdminPlanListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IAdminPlanListItem | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: async () => {
      const response = await APIKit.admin.plans.getAll();
      return response.data;
    },
  });

  const plans = [...(data?.data?.plans ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  // Only one BASIC + one PREMIUM plan can ever exist (enum-bound key) — hide
  // "New Plan" once both are already in the catalogue.
  const canCreate = plans.filter((p) => p.key !== 'FREE').length < 2;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AdminPageHeader
        title="Subscription Plans"
        description="Manage plan catalogue — synced to Stripe Products & Prices automatically"
        actions={
          canCreate ? (
            <Button
              size="sm"
              className="h-8 gap-1.5 bg-brand-navy text-xs text-white hover:bg-brand-navy/90"
              onClick={() => setIsCreating(true)}
            >
              <i className="ti ti-plus text-sm" aria-hidden="true" />
              New Plan
            </Button>
          ) : undefined
        }
      />

      {!isLoading && !isError && plans.length > 0 && (
        <div className="grid grid-cols-1 gap-4 border-b border-border bg-muted/30 px-6 py-4 sm:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span
                  className="rounded px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase"
                  style={{
                    background: `${PLAN_ACCENT[plan.key]}22`,
                    color: PLAN_ACCENT[plan.key],
                  }}
                >
                  {plan.key}
                </span>
                <span className="text-lg font-bold text-foreground">
                  {formatPriceCents(plan.monthlyPriceCents)}
                  {plan.monthlyPriceCents > 0 && (
                    <span className="text-xs font-normal text-muted-foreground">/mo</span>
                  )}
                </span>
              </div>
              <ul className="space-y-1">
                <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <i className="ti ti-send text-xs text-brand-sky" aria-hidden="true" />
                  {formatLimit(plan.features.applyMonthlyLimit, 'apply', 'applies')}/month
                </li>
                <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <i className="ti ti-bookmark text-xs text-brand-sky" aria-hidden="true" />
                  {formatLimit(plan.features.saveJobsLimit, 'saved job')}
                </li>
              </ul>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 h-7 w-full px-2 text-xs"
                onClick={() => setEditTarget(plan)}
              >
                Edit Plan
              </Button>
            </div>
          ))}
        </div>
      )}

      <motion.div
        className="flex flex-1 flex-col overflow-hidden"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <AdminPlansTable
          plans={plans}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          onEdit={setEditTarget}
          onRequestToggle={setToggleTarget}
          onRequestDelete={setDeleteTarget}
        />
      </motion.div>

      <AdminPlanFormModal
        plan={editTarget}
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
      />
      <AdminPlanFormModal plan={null} open={isCreating} onClose={() => setIsCreating(false)} />
      <AdminPlanToggleModal plan={toggleTarget} onClose={() => setToggleTarget(null)} />
      <AdminPlanDeleteModal plan={deleteTarget} onClose={() => setDeleteTarget(null)} />
    </div>
  );
}
