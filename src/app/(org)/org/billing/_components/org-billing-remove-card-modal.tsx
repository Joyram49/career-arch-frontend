'use client';

import { GeneralModal } from '@components/shared/general-modal';
import { useRemovePaymentMethod } from '@queries/org/use-org-billing';

interface OrgBillingRemoveCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrgBillingRemoveCardModal({
  open,
  onOpenChange,
}: OrgBillingRemoveCardModalProps): React.JSX.Element {
  const removeCard = useRemovePaymentMethod();

  return (
    <GeneralModal
      open={open}
      onOpenChange={onOpenChange}
      title="Remove payment method?"
      description="You won't be able to post new jobs or pay hiring incentives until you add another card."
      size="sm"
      actions={[
        {
          label: 'Cancel',
          variant: 'outline',
          onClick: () => onOpenChange(false),
          disabled: removeCard.isPending,
        },
        {
          label: 'Remove Card',
          variant: 'destructive',
          isLoading: removeCard.isPending,
          onClick: () => removeCard.mutate(undefined, { onSuccess: () => onOpenChange(false) }),
        },
      ]}
    >
      <p className="text-xs text-muted-foreground">
        This can be undone anytime by adding a new card afterward.
      </p>
    </GeneralModal>
  );
}
