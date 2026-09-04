'use client';

import { type IAdminUserListItem } from '@app-types/admin/admin.dashboard.users';
import { GeneralModal, type ModalAction } from '@components/shared/general-modal';
import { format } from 'date-fns';
import { StatusBadge } from '../../_components/shared';

interface AdminUserDetailModalProps {
  user: IAdminUserListItem | null;
  onClose: () => void;
  onSuspend: (user: IAdminUserListItem) => void;
  onArchive: (user: IAdminUserListItem) => void;
}

export function AdminUserDetailModal({
  user,
  onClose,
  onSuspend,
  onArchive,
}: AdminUserDetailModalProps): React.JSX.Element {
  const actions: ModalAction[] = user
    ? [
        ...(user.isActive
          ? [
              {
                label: 'Suspend',
                variant: 'outline' as const,
                className: 'border-amber-300 text-amber-700 hover:bg-amber-50',
                onClick: () => onSuspend(user),
              },
            ]
          : []),
        {
          label: 'Archive Account',
          variant: 'outline' as const,
          className: 'border-slate-300 text-slate-600 hover:bg-slate-50',
          onClick: () => onArchive(user),
        },
      ]
    : [];

  return (
    <GeneralModal
      open={user !== null}
      onOpenChange={(open) => !open && onClose()}
      title={user ? `${user.profile?.firstName ?? ''} ${user.profile?.lastName ?? ''}`.trim() : ''}
      size="md"
      actions={actions}
    >
      {user && (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Email</span>
            <p className="font-medium text-foreground">{user.email}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Plan</span>
            <p className="font-medium text-foreground capitalize">{user.subscription?.plan}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Status</span>
            <p className="mt-0.5">
              <StatusBadge status={user.isActive ? 'active' : 'suspended'} />
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Applications</span>
            <p className="font-medium text-foreground">{user._count.applications}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Joined</span>
            <p className="font-medium text-foreground">
              {user.createdAt ? format(new Date(user.createdAt), 'dd, MMM yyyy') : 'Never'}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Last Login</span>
            <p className="font-medium text-foreground">
              {user.lastLoginAt ? format(new Date(user.lastLoginAt), 'dd, MMM yyyy') : 'Never'}
            </p>
          </div>
        </div>
      )}
    </GeneralModal>
  );
}
