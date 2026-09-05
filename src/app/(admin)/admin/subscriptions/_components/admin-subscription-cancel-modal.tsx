'use client';

import { type IAdminSubscriptionListItem } from '@app-types/admin/admin.dashboard.subscriptions';
import { GeneralModal } from '@components/shared/general-modal';

interface AdminSubscriptionCancelModalProps {
  subscription: IAdminSubscriptionListItem | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function AdminSubscriptionCancelModal({
  subscription,
  isLoading,
  onClose,
  onConfirm,
}: AdminSubscriptionCancelModalProps): React.JSX.Element {
  const userName = subscription?.user?.profile
    ? `${subscription.user.profile.firstName} ${subscription.user.profile.lastName}`
    : (subscription?.user?.email ?? 'this user');

  return (
    <GeneralModal
      open={subscription !== null}
      onOpenChange={(open) => !open && onClose()}
      title={`Cancel ${userName}'s subscription?`}
      description={`Their ${subscription?.plan ?? ''} plan will be cancelled immediately on Stripe — not scheduled for period end.`}
      size="sm"
      actions={[
        { label: 'Back', variant: 'outline', onClick: onClose, disabled: isLoading },
        {
          label: 'Confirm Cancel',
          variant: 'destructive',
          isLoading,
          onClick: onConfirm,
        },
      ]}
    >
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
        <strong>Note:</strong> This is immediate, not scheduled — the user loses paid-plan access
        right away and is downgraded to FREE in the same transaction.
      </div>
    </GeneralModal>
  );
}
