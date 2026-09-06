'use client';

import { type IAdminIncentiveListItem } from '@app-types/admin/admin.dashboard.incentives';
import { GeneralModal } from '@components/shared/general-modal';
import { cn } from '@lib/utils';
import { type DisputeResolution } from '@queries/admin/use-admin-incentives';
import { Textarea } from '@ui/textarea';
import { useState } from 'react';

const RESOLUTION_OPTIONS: {
  value: DisputeResolution;
  label: string;
  description: string;
}[] = [
  {
    value: 'collect',
    label: 'Collect Payment',
    description: "Charges the org's saved payment method off-session via Stripe.",
  },
  {
    value: 'waive',
    label: 'Waive',
    description: 'Clears the outstanding balance — no charge is made.',
  },
];

interface AdminIncentiveResolveDisputeModalProps {
  incentive: IAdminIncentiveListItem | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (resolution: DisputeResolution, note?: string) => void;
}

export function AdminIncentiveResolveDisputeModal({
  incentive,
  isLoading,
  onClose,
  onConfirm,
}: AdminIncentiveResolveDisputeModalProps): React.JSX.Element {
  const [resolution, setResolution] = useState<DisputeResolution>('collect');
  const [note, setNote] = useState('');

  const orgName = incentive?.organization?.companyName ?? 'this organization';

  const handleOpenChange = (open: boolean): void => {
    if (!open) {
      setResolution('collect');
      setNote('');
    }
    onClose();
  };

  return (
    <GeneralModal
      open={incentive !== null}
      onOpenChange={handleOpenChange}
      title={`Resolve dispute — $${incentive?.amount.toFixed(2) ?? '0.00'} from ${orgName}`}
      description="Choose how to close out this disputed incentive."
      size="sm"
      actions={[
        {
          label: 'Cancel',
          variant: 'outline',
          onClick: () => handleOpenChange(false),
          disabled: isLoading,
        },
        {
          label: resolution === 'collect' ? 'Force Collect' : 'Waive Incentive',
          className:
            resolution === 'collect'
              ? 'bg-brand-sky text-white hover:bg-brand-sky/90'
              : 'bg-slate-700 text-white hover:bg-slate-800',
          isLoading,
          onClick: () => onConfirm(resolution, note.trim() || undefined),
        },
      ]}
    >
      <div className="space-y-3">
        <div className="flex flex-col gap-1.5">
          {RESOLUTION_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setResolution(option.value)}
              className={cn(
                'rounded-lg border px-3 py-2 text-left transition-all',
                resolution === option.value
                  ? 'border-brand-sky bg-brand-sky/10'
                  : 'border-border bg-card hover:bg-muted',
              )}
            >
              <p
                className={cn(
                  'text-xs font-semibold',
                  resolution === option.value ? 'text-brand-sky' : 'text-foreground',
                )}
              >
                {option.label}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{option.description}</p>
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="resolve-note"
            className="text-xs font-semibold tracking-widest text-muted-foreground uppercase"
          >
            Note (optional)
          </label>
          <Textarea
            id="resolve-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Internal note about this resolution…"
            rows={2}
          />
        </div>
      </div>
    </GeneralModal>
  );
}
