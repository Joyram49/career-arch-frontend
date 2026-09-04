'use client';

import type { IAdminJobListItem } from '@app-types/admin/admin.dashboard.jobs';
import { GeneralModal } from '@components/shared/general-modal';
import { Label } from '@ui/label';
import { Textarea } from '@ui/textarea';
import { useState } from 'react';

export type JobAction = 'takedown' | 'republish' | 'archive';

interface AdminJobActionModalProps {
  action: JobAction | null;
  job: IAdminJobListItem | null;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason?: string) => void;
}

const COPY: Record<
  JobAction,
  {
    title: (t: string) => string;
    description: string;
    confirmLabel: string;
    confirmClassName: string;
  }
> = {
  takedown: {
    title: (t) => `Take down "${t}"?`,
    description:
      'The job will be force-closed and hidden from public search. A reason is required for the audit log.',
    confirmLabel: 'Take Down',
    confirmClassName: 'bg-brand-red text-white hover:bg-brand-red/90',
  },
  republish: {
    title: (t) => `Republish "${t}"?`,
    description: 'The job will go back to PUBLISHED and become visible in public search again.',
    confirmLabel: 'Republish',
    confirmClassName: 'bg-emerald-600 text-white hover:bg-emerald-700',
  },
  archive: {
    title: (t) => `Archive "${t}"?`,
    description:
      'This is a soft delete — the job moves to the trash bin and is permanently deleted after 30 days.',
    confirmLabel: 'Archive Job',
    confirmClassName: 'bg-slate-700 text-white hover:bg-slate-800',
  },
};

export function AdminJobActionModal({
  action,
  job,
  isLoading,
  onOpenChange,
  onConfirm,
}: AdminJobActionModalProps): React.JSX.Element {
  const [reason, setReason] = useState('');

  const copy = action ? COPY[action] : null;
  const requiresReason = action === 'takedown';
  const trimmedReason = reason.trim();
  const reasonInvalid = requiresReason && trimmedReason.length < 10;

  const handleOpenChange = (open: boolean): void => {
    if (!open) setReason('');
    onOpenChange(open);
  };

  return (
    <GeneralModal
      open={action !== null}
      onOpenChange={handleOpenChange}
      title={copy && job ? copy.title(job.title) : ''}
      description={copy?.description}
      size="sm"
      actions={
        copy
          ? [
              { label: 'Cancel', variant: 'outline', onClick: () => handleOpenChange(false) },
              {
                label: copy.confirmLabel,
                className: copy.confirmClassName,
                isLoading,
                disabled: reasonInvalid,
                onClick: () => onConfirm(trimmedReason.length > 0 ? trimmedReason : undefined),
              },
            ]
          : []
      }
    >
      {action !== 'republish' && (
        <div className="space-y-1.5">
          <Label htmlFor="job-action-reason" className="text-xs text-muted-foreground">
            Reason{' '}
            {requiresReason ? (
              <span className="text-brand-red">(required, min. 10 characters)</span>
            ) : (
              <span className="text-muted-foreground/70">(optional)</span>
            )}
          </Label>
          <Textarea
            id="job-action-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Add an internal note about this action…"
            rows={3}
          />
          {reasonInvalid && trimmedReason.length > 0 && (
            <p className="text-[11px] text-destructive">Reason must be at least 10 characters.</p>
          )}
        </div>
      )}
    </GeneralModal>
  );
}
