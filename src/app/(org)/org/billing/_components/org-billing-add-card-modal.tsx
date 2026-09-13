'use client';

import { useCreateSetupIntent, useSavePaymentMethod } from '@queries/org/use-org-billing';
import { useEffect, useState } from 'react';

import { GeneralModal } from '@components/shared/general-modal';

import { OrgBillingCardForm } from './org-billing-card-form';
import { StripeProvider } from './stripe-provider';

interface OrgBillingAddCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrgBillingAddCardModal({
  open,
  onOpenChange,
}: OrgBillingAddCardModalProps): React.JSX.Element {
  const createSetupIntent = useCreateSetupIntent();
  const savePaymentMethod = useSavePaymentMethod();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (open && !clientSecret) {
      createSetupIntent.mutate(undefined, {
        onSuccess: (data) => setClientSecret(data.clientSecret),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleOpenChange(nextOpen: boolean): void {
    if (!nextOpen) setClientSecret(null);
    onOpenChange(nextOpen);
  }

  function handleSaved(paymentMethodId: string): void {
    savePaymentMethod.mutate(paymentMethodId, { onSuccess: () => onOpenChange(false) });
  }

  return (
    <GeneralModal open={open} onOpenChange={handleOpenChange} title="Add Payment Method" size="sm">
      {createSetupIntent.isPending || !clientSecret ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
          <i className="ti ti-loader-2 animate-spin" aria-hidden="true" />
          Preparing secure card form…
        </div>
      ) : createSetupIntent.isError ? (
        <p className="py-6 text-center text-sm text-destructive">
          Couldn&apos;t start card setup. Please close this and try again.
        </p>
      ) : (
        <StripeProvider clientSecret={clientSecret}>
          <OrgBillingCardForm
            clientSecret={clientSecret}
            isSaving={savePaymentMethod.isPending}
            onSaved={handleSaved}
            onCancel={() => onOpenChange(false)}
          />
        </StripeProvider>
      )}
    </GeneralModal>
  );
}
