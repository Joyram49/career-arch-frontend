'use client';

import { GeneralModal } from '@components/shared/general-modal';
import { Label } from '@ui/label';
import { Textarea } from '@ui/textarea';
import { useState } from 'react';

export type UserStatusAction = 'suspend' | 'activate';

interface AdminUserStatusModalProps {
  action: UserStatusAction | null;
  userName: string;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason?: string) => void;
}

const COPY: Record<
  UserStatusAction,
  {
    title: (name: string) => string;
    description: string;
    confirmLabel: string;
    confirmClassName: string;
  }
> = {
  suspend: {
    title: (name) => `Suspend ${name}?`,
    description:
      'This user will lose access to their account immediately. You can reactivate at any time.',
    confirmLabel: 'Suspend User',
    confirmClassName: 'bg-amber-500 text-white hover:bg-amber-600',
  },
  activate: {
    title: (name) => `Activate ${name}?`,
    description: 'This user will regain full access to their account.',
    confirmLabel: 'Activate User',
    confirmClassName: 'bg-emerald-600 text-white hover:bg-emerald-700',
  },
};

export function AdminUserStatusModal({
  action,
  userName,
  isLoading,
  onOpenChange,
  onConfirm,
}: AdminUserStatusModalProps): React.JSX.Element {
  const [reason, setReason] = useState('');

  const copy = action ? COPY[action] : null;
  const trimmedReason = reason.trim();
  const reasonTooShort = trimmedReason.length > 0 && trimmedReason.length < 10;

  const handleOpenChange = (open: boolean): void => {
    if (!open) setReason('');
    onOpenChange(open);
  };

  return (
    <GeneralModal
      open={action !== null}
      onOpenChange={handleOpenChange}
      title={copy ? copy.title(userName) : ''}
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
                disabled: reasonTooShort,
                onClick: () => onConfirm(trimmedReason.length >= 10 ? trimmedReason : undefined),
              },
            ]
          : []
      }
    >
      <div className="space-y-1.5">
        <Label htmlFor="status-reason" className="text-xs text-muted-foreground">
          Reason{' '}
          <span className="text-muted-foreground/70">
            (optional, min. 10 characters if provided)
          </span>
        </Label>
        <Textarea
          id="status-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Add an internal note about this action…"
          rows={3}
        />
        {reasonTooShort && (
          <p className="text-[11px] text-destructive">Reason must be at least 10 characters.</p>
        )}
      </div>
    </GeneralModal>
  );
}
