'use client';

import { useOrgBilling } from '@queries/org/use-org-billing';
import { useState } from 'react';

import { OrgPageHeader } from '../../_components/shared';
import { OrgBillingAddCardModal } from './org-billing-add-card-modal';
import { OrgBillingCardDisplay } from './org-billing-card-display';
import { OrgBillingRemoveCardModal } from './org-billing-remove-card-modal';
import { OrgBillingSkeleton } from './org-billing-skeleton';

export default function OrgBillingContainer(): React.JSX.Element {
  const { data: billing, isLoading, isError, refetch } = useOrgBilling();
  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <OrgPageHeader
        title="Billing"
        description="Manage the payment method used for hiring incentives and job posting eligibility"
      />

      <div className="max-w-xl p-6">
        {isLoading ? (
          <OrgBillingSkeleton />
        ) : isError || !billing ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Couldn&apos;t load your billing information.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-xs font-medium text-brand-sky underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {billing.hasUnpaidIncentives && (
              <div className="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <i className="ti ti-alert-triangle shrink-0 text-base" aria-hidden="true" />
                <p>
                  You have unpaid hiring incentives — your card can&apos;t be removed until
                  they&apos;re settled.
                </p>
              </div>
            )}
            <OrgBillingCardDisplay
              billing={billing}
              onAddCard={() => setAddOpen(true)}
              onRemoveCard={() => setRemoveOpen(true)}
            />
          </>
        )}
      </div>

      <OrgBillingAddCardModal open={addOpen} onOpenChange={setAddOpen} />
      <OrgBillingRemoveCardModal open={removeOpen} onOpenChange={setRemoveOpen} />
    </div>
  );
}
