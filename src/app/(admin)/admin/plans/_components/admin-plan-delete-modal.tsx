'use client';

import { type IAdminPlanListItem } from '@app-types/admin/admin.dashboard.plans';
import { GeneralModal } from '@components/shared/general-modal';
import { useDeletePlan } from '@queries/admin/use-admin-plans';

interface AdminPlanDeleteModalProps {
  plan: IAdminPlanListItem | null;
  onClose: () => void;
}

export function AdminPlanDeleteModal({
  plan,
  onClose,
}: AdminPlanDeleteModalProps): React.JSX.Element {
  const deleteMutation = useDeletePlan();

  return (
    <GeneralModal
      open={plan !== null}
      onOpenChange={(open) => !open && onClose()}
      title={`Delete ${plan?.displayName ?? ''} Plan?`}
      description="This archives the plan on Stripe and soft-deletes it in the catalogue. Blocked if any subscriber is currently active on this plan."
      size="sm"
      actions={[
        {
          label: 'Cancel',
          variant: 'outline',
          onClick: onClose,
          disabled: deleteMutation.isPending,
        },
        {
          label: 'Delete Plan',
          variant: 'destructive',
          isLoading: deleteMutation.isPending,
          onClick: () => {
            if (!plan) return;
            deleteMutation.mutate(plan.id, { onSuccess: onClose });
          },
        },
      ]}
    >
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
        <strong>Note:</strong> If active subscribers exist on this plan, deletion will fail —
        deactivate it instead.
      </div>
    </GeneralModal>
  );
}
