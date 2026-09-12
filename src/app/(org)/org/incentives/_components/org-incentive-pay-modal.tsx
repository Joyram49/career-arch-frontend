'use client';

import { GeneralModal } from '@components/shared/general-modal';

import type { IOrgIncentiveListItem } from '@app-types/org/org.incentives';

interface OrgIncentivePayModalProps {
  incentive: IOrgIncentiveListItem | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function OrgIncentivePayModal({
  incentive,
  isLoading,
  onClose,
  onConfirm,
}: OrgIncentivePayModalProps): React.JSX.Element {
  const candidateName = incentive?.candidate
    ? `${incentive.candidate.firstName} ${incentive.candidate.lastName}`
    : 'this candidate';

  return (
    <GeneralModal
      open={incentive !== null}
      onOpenChange={(open) => !open && onClose()}
      title={`Pay $${incentive?.amount.toFixed(2) ?? '0.00'} incentive`}
      description={`Hiring incentive for ${candidateName} — ${incentive?.job?.title ?? 'this job'}.`}
      size="sm"
      actions={[
        { label: 'Cancel', variant: 'outline', onClick: onClose, disabled: isLoading },
        {
          label: isLoading ? 'Processing…' : `Pay $${incentive?.amount.toFixed(0) ?? '50'} Now`,
          className: 'bg-brand-emerald text-white hover:bg-brand-emerald/90',
          isLoading,
          onClick: onConfirm,
        },
      ]}
    >
      <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
        <i className="ti ti-credit-card mr-1" aria-hidden="true" />
        Charged automatically to your saved payment method on file — no card entry needed. If no
        card is on file, add one from <strong>Billing</strong> first.
      </div>
    </GeneralModal>
  );
}
