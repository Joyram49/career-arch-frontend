'use client';

import { GeneralModal } from '@components/shared/general-modal';

import type { IOrgJobListItem } from '@app-types/org/org.jobs';

export type JobConfirmAction = 'close' | 'archive';

interface OrgJobConfirmModalProps {
  action: JobConfirmAction | null;
  job: IOrgJobListItem | null;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const COPY: Record<
  JobConfirmAction,
  {
    title: (jobTitle: string) => string;
    description: string;
    confirmLabel: string;
    confirmClassName: string;
  }
> = {
  close: {
    title: (jobTitle) => `Close "${jobTitle}"?`,
    description:
      'The job will stop accepting new applications immediately. Existing applications stay untouched and remain visible to you.',
    confirmLabel: 'Close Job',
    confirmClassName: 'bg-amber-500 text-white hover:bg-amber-600',
  },
  archive: {
    title: (jobTitle) => `Archive "${jobTitle}"?`,
    description:
      'The listing is removed from candidates immediately and moved to Archived. It will be permanently deleted after the 30-day retention period unless restored.',
    confirmLabel: 'Archive Job',
    confirmClassName: 'bg-slate-700 text-white hover:bg-slate-800',
  },
};

export function OrgJobConfirmModal({
  action,
  job,
  isLoading,
  onOpenChange,
  onConfirm,
}: OrgJobConfirmModalProps): React.JSX.Element {
  const copy = action ? COPY[action] : null;

  return (
    <GeneralModal
      open={action !== null && job !== null}
      onOpenChange={onOpenChange}
      title={copy && job ? copy.title(job.title) : ''}
      description={copy?.description}
      size="sm"
      actions={
        copy
          ? [
              {
                label: 'Cancel',
                variant: 'outline',
                onClick: () => onOpenChange(false),
                disabled: isLoading,
              },
              {
                label: copy.confirmLabel,
                className: copy.confirmClassName,
                isLoading,
                onClick: onConfirm,
              },
            ]
          : []
      }
    >
      {action === 'archive' && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <strong>Note:</strong> This action is reversible until the retention period ends — restore
          it anytime from the Archived tab.
        </div>
      )}
    </GeneralModal>
  );
}
