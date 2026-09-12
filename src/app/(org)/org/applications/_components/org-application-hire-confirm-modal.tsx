'use client';

import { GeneralModal } from '@components/shared/general-modal';

interface OrgApplicationHireConfirmModalProps {
  open: boolean;
  candidateName: string;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function OrgApplicationHireConfirmModal({
  open,
  candidateName,
  isLoading,
  onOpenChange,
  onConfirm,
}: OrgApplicationHireConfirmModalProps): React.JSX.Element {
  return (
    <GeneralModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Mark ${candidateName} as Hired?`}
      description="Marking as Hired will trigger a $50 platform incentive due within 7 days. This action can't be undone."
      size="sm"
      actions={[
        {
          label: 'Cancel',
          variant: 'outline',
          onClick: () => onOpenChange(false),
          disabled: isLoading,
        },
        {
          label: 'Confirm Hire',
          className: 'bg-brand-emerald text-white hover:bg-brand-emerald/90',
          isLoading,
          onClick: onConfirm,
        },
      ]}
    >
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
        <i className="ti ti-coin mr-1" aria-hidden="true" />A <strong>$50</strong> hiring incentive
        will be added to your Incentives tab, payable via your saved card within 7 days.
      </div>
    </GeneralModal>
  );
}
