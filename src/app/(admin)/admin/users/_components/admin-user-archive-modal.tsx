'use client';

import { type IAdminUserListItem } from '@app-types/admin/admin.dashboard.users';
import { GeneralModal } from '@components/shared/general-modal';

interface AdminUserArchiveModalProps {
  user: IAdminUserListItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function AdminUserArchiveModal({
  user,
  onClose,
  onConfirm,
}: AdminUserArchiveModalProps): React.JSX.Element {
  return (
    <GeneralModal
      open={user !== null}
      onOpenChange={(open) => !open && onClose()}
      title={`Archive ${user?.profile?.firstName ?? ''}?`}
      description="The account will be archived and auto-deleted after 30 days by the background cleanup cron."
      size="sm"
      actions={[
        { label: 'Cancel', variant: 'outline', onClick: onClose },
        { label: 'Archive Account', variant: 'destructive', onClick: onConfirm },
      ]}
    >
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
        <strong>Note:</strong> This action is reversible. Archived records will be automatically
        hard-deleted by a background cron after the retention period.
      </div>
    </GeneralModal>
  );
}
