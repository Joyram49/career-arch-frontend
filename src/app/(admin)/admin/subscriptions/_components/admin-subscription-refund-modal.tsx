'use client';

import { type IAdminSubscriptionListItem } from '@app-types/admin/admin.dashboard.subscriptions';
import { GeneralModal } from '@components/shared/general-modal';
import { cn } from '@lib/utils';
import { type RefundReason } from '@queries/admin/use-admin-subscriptions';
import { useState } from 'react';

const REASON_OPTIONS: { value: RefundReason; label: string }[] = [
  { value: 'requested_by_customer', label: 'Requested by customer' },
  { value: 'duplicate', label: 'Duplicate charge' },
  { value: 'fraudulent', label: 'Fraudulent' },
];

interface AdminSubscriptionRefundModalProps {
  subscription: IAdminSubscriptionListItem | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (reason?: RefundReason) => void;
}

export function AdminSubscriptionRefundModal({
  subscription,
  isLoading,
  onClose,
  onConfirm,
}: AdminSubscriptionRefundModalProps): React.JSX.Element {
  const [reason, setReason] = useState<RefundReason | undefined>(undefined);

  const userName = subscription?.user?.profile
    ? `${subscription.user.profile.firstName} ${subscription.user.profile.lastName}`
    : (subscription?.user?.email ?? 'this user');

  const amount = subscription ? (subscription.amountCents / 100).toFixed(2) : '0.00';

  const handleOpenChange = (open: boolean): void => {
    if (!open) setReason(undefined);
    onClose();
  };

  return (
    <GeneralModal
      open={subscription !== null}
      onOpenChange={handleOpenChange}
      title={`Refund $${amount} to ${userName}?`}
      description="Refunds their most recent paid invoice via Stripe. This action cannot be undone."
      size="sm"
      actions={[
        {
          label: 'Cancel',
          variant: 'outline',
          onClick: () => handleOpenChange(false),
          disabled: isLoading,
        },
        {
          label: 'Issue Refund',
          isLoading,
          onClick: () => onConfirm(reason),
        },
      ]}
    >
      <div className="space-y-2">
        <label className="block text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Reason (optional)
        </label>
        <div className="flex flex-col gap-1.5">
          {REASON_OPTIONS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setReason((prev) => (prev === r.value ? undefined : r.value))}
              className={cn(
                'rounded-lg border px-3 py-2 text-left text-xs font-medium transition-all',
                reason === r.value
                  ? 'border-brand-sky bg-brand-sky/10 text-brand-sky'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted',
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </GeneralModal>
  );
}
