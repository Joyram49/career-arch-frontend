'use client';

import { type IAdminIncentiveListItem } from '@app-types/admin/admin.dashboard.incentives';
import { GeneralModal } from '@components/shared/general-modal';
import { Label } from '@ui/label';
import { Textarea } from '@ui/textarea';
import { useState } from 'react';

const MIN_REASON_LENGTH = 10;

interface AdminIncentiveWaiveModalProps {
  incentive: IAdminIncentiveListItem | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function AdminIncentiveWaiveModal({
  incentive,
  isLoading,
  onClose,
  onConfirm,
}: AdminIncentiveWaiveModalProps): React.JSX.Element {
  const [reason, setReason] = useState('');

  const orgName = incentive?.organization?.companyName ?? 'this organization';
  const trimmedReason = reason.trim();
  const isTooShort = trimmedReason.length > 0 && trimmedReason.length < MIN_REASON_LENGTH;
  const canConfirm = trimmedReason.length >= MIN_REASON_LENGTH;

  const handleOpenChange = (open: boolean): void => {
    if (!open) setReason('');
    onClose();
  };

  return (
    <GeneralModal
      open={incentive !== null}
      onOpenChange={handleOpenChange}
      title={`Waive $${incentive?.amount.toFixed(2) ?? '0.00'} incentive for ${orgName}?`}
      description="This clears the outstanding balance and notifies the organization. This action cannot be undone."
      size="sm"
      actions={[
        {
          label: 'Cancel',
          variant: 'outline',
          onClick: () => handleOpenChange(false),
          disabled: isLoading,
        },
        {
          label: 'Waive Incentive',
          className: 'bg-slate-700 text-white hover:bg-slate-800',
          isLoading,
          disabled: !canConfirm,
          onClick: () => onConfirm(trimmedReason),
        },
      ]}
    >
      <div className="space-y-1.5">
        <Label htmlFor="waive-reason" className="text-xs text-muted-foreground">
          Reason <span className="text-muted-foreground/70">(required, min. 10 characters)</span>
        </Label>
        <Textarea
          id="waive-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why is this incentive being waived?…"
          rows={3}
        />
        {isTooShort && (
          <p className="text-[11px] text-destructive">Reason must be at least 10 characters.</p>
        )}
      </div>
    </GeneralModal>
  );
}
