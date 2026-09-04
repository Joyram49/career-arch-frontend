'use client';

import { type IAdminOrgListItem } from '@app-types/admin/admin.dashboard.orgs';
import { GeneralModal } from '@components/shared/general-modal';

interface AdminOrganizationSuspendModalProps {
  organization: IAdminOrgListItem | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export function AdminOrganizationSuspendModal({
  organization,
  isSubmitting,
  onClose,
  onConfirm,
}: AdminOrganizationSuspendModalProps): React.JSX.Element {
  return (
    <GeneralModal
      open={organization !== null}
      onOpenChange={(open) => !open && onClose()}
      title={`Suspend ${organization?.profile?.companyName ?? ''}?`}
      description="This organization will lose the ability to post jobs immediately. You can reactivate at any time."
      size="sm"
      actions={[
        { label: 'Cancel', variant: 'outline', onClick: onClose },
        {
          label: isSubmitting ? 'Suspending…' : 'Suspend Organization',
          className: 'bg-amber-500 text-white hover:bg-amber-600',
          onClick: () => {
            if (isSubmitting || !organization) return;
            onConfirm(organization.id);
          },
        },
      ]}
    >
      <p className="text-sm text-muted-foreground">
        You can reactivate this account any time from the organizations table.
      </p>
    </GeneralModal>
  );
}
