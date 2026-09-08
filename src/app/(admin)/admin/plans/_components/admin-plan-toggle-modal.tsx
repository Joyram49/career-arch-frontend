'use client';

import { type IAdminPlanListItem } from '@app-types/admin/admin.dashboard.plans';
import { GeneralModal } from '@components/shared/general-modal';
import { useTogglePlan } from '@queries/admin/use-admin-plans';

interface AdminPlanToggleModalProps {
  plan: IAdminPlanListItem | null;
  onClose: () => void;
}

export function AdminPlanToggleModal({
  plan,
  onClose,
}: AdminPlanToggleModalProps): React.JSX.Element {
  const toggleMutation = useTogglePlan();
  const willDeactivate = plan?.isActive === true;

  return (
    <GeneralModal
      open={plan !== null}
      onOpenChange={(open) => !open && onClose()}
      title={`${willDeactivate ? 'Deactivate' : 'Activate'} ${plan?.displayName ?? ''} Plan?`}
      description={
        willDeactivate
          ? 'New users will no longer be able to subscribe to this plan. Existing subscribers are unaffected.'
          : 'This plan will become available for new subscriptions.'
      }
      size="sm"
      actions={[
        {
          label: 'Cancel',
          variant: 'outline',
          onClick: onClose,
          disabled: toggleMutation.isPending,
        },
        {
          label: willDeactivate ? 'Deactivate Plan' : 'Activate Plan',
          variant: willDeactivate ? 'outline' : 'default',
          className: willDeactivate
            ? 'border-amber-300 text-amber-700 hover:bg-amber-50'
            : 'bg-brand-emerald text-white hover:bg-brand-emerald/90',
          isLoading: toggleMutation.isPending,
          onClick: () => {
            if (!plan) return;
            toggleMutation.mutate(plan.id, { onSuccess: onClose });
          },
        },
      ]}
    >
      <p className="text-sm text-muted-foreground">
        {willDeactivate
          ? 'You can reactivate this plan at any time.'
          : 'Subscribers can immediately start choosing this plan again.'}
      </p>
    </GeneralModal>
  );
}
