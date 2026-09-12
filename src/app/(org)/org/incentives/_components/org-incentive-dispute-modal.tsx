'use client';

import { GeneralModal } from '@components/shared/general-modal';
import { Label } from '@ui/label';
import { Textarea } from '@ui/textarea';
import { useState } from 'react';

import type { IOrgIncentiveListItem } from '@app-types/org/org.incentives';

const MIN_REASON_LENGTH = 20;

interface OrgIncentiveDisputeModalProps {
  incentive: IOrgIncentiveListItem | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function OrgIncentiveDisputeModal({
  incentive,
  isLoading,
  onClose,
  onConfirm,
}: OrgIncentiveDisputeModalProps): React.JSX.Element {
  const [reason, setReason] = useState('');

  const candidateName = incentive?.candidate
    ? `${incentive.candidate.firstName} ${incentive.candidate.lastName}`
    : 'this candidate';
  const trimmed = reason.trim();
  const isTooShort = trimmed.length > 0 && trimmed.length < MIN_REASON_LENGTH;
  const canSubmit = trimmed.length >= MIN_REASON_LENGTH;

  function handleOpenChange(open: boolean): void {
    if (!open) setReason('');
    onClose();
  }

  return (
    <GeneralModal
      open={incentive !== null}
      onOpenChange={handleOpenChange}
      title={`Dispute incentive for ${candidateName}`}
      description="Our team reviews disputes within 2 business days. This pauses collection until resolved."
      size="sm"
      actions={[
        {
          label: 'Cancel',
          variant: 'outline',
          onClick: () => handleOpenChange(false),
          disabled: isLoading,
        },
        {
          label: 'Submit Dispute',
          className: 'bg-slate-700 text-white hover:bg-slate-800',
          isLoading,
          disabled: !canSubmit,
          onClick: () => onConfirm(trimmed),
        },
      ]}
    >
      <div className="space-y-1.5">
        <Label htmlFor="dispute-reason" className="text-xs text-muted-foreground">
          Reason <span className="text-muted-foreground/70">(required, min. 20 characters)</span>
        </Label>
        <Textarea
          id="dispute-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Explain why this incentive shouldn't be charged…"
          rows={4}
        />
        {isTooShort && (
          <p className="text-[11px] text-destructive">Reason must be at least 20 characters.</p>
        )}
      </div>
    </GeneralModal>
  );
}
