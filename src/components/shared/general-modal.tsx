// src/components/shared/general-modal.tsx
'use client';

import { useMediaQuery } from '@hooks/use-media-query';
import { cn } from '@lib/utils';
import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@ui/drawer';
import { Loader2 } from 'lucide-react';

/**
 * ── GeneralModal ──────────────────────────────────────────────────────────
 *
 * ONE modal component for the whole app. It owns the *shape* (responsive
 * Dialog ↔ Drawer switch, header, scrollable body, footer button row) — the
 * caller owns everything else: what's inside, and what each button does.
 *
 * This replaces bespoke modals like ArchiveConfirmDialog, user-detail-modal,
 * plan-form-modal, apply-modal, pay-incentive-modal, etc. Those become thin
 * wrappers that just pass `children` + `actions` to this component instead
 * of each re-implementing the Dialog/Drawer/breakpoint plumbing.
 *
 * Example — confirm-archive style usage:
 *
 *   <GeneralModal
 *     open={archiveTarget !== null}
 *     onOpenChange={(open) => !open && setArchiveTarget(null)}
 *     title={`Archive ${archiveTarget?.name}?`}
 *     description="Archived records are hard-deleted by the retention cron after 30 days."
 *     size="sm"
 *     actions={[
 *       { label: 'Cancel', variant: 'outline', onClick: () => setArchiveTarget(null) },
 *       { label: 'Archive', variant: 'destructive', isLoading: isPending, onClick: handleArchive },
 *     ]}
 *   >
 *     <p className="text-sm text-muted-foreground">This action is reversible until the retention period ends.</p>
 *   </GeneralModal>
 *
 * Example — arbitrary form content (e.g. plan-form-modal):
 *
 *   <GeneralModal open={open} onOpenChange={setOpen} title="Edit plan" size="lg" actions={formActions}>
 *     <PlanForm ... />
 *   </GeneralModal>
 */

export type ModalActionVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

export interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: ModalActionVariant;
  isLoading?: boolean;
  disabled?: boolean;
}

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

const DESKTOP_SIZE_CLASS: Record<ModalSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-2xl',
};

interface GeneralModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Footer buttons, rendered left-to-right. Omit for a modal with no footer actions. */
  actions?: ModalAction[];
  /** Desktop dialog width. Ignored on mobile (drawer is always full-width). Default: 'md'. */
  size?: ModalSize;
  className?: string;
  /** Breakpoint at which the Dialog is used instead of the Drawer. Default: 768px (Tailwind `md`). */
  desktopBreakpoint?: string;
}

export function GeneralModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions = [],
  size = 'md',
  className,
  desktopBreakpoint = '(min-width: 768px)',
}: GeneralModalProps): React.JSX.Element {
  const isDesktop = useMediaQuery(desktopBreakpoint);

  const footerButtons =
    actions.length > 0
      ? actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant ?? 'default'}
            onClick={action.onClick}
            disabled={action.disabled === true || action.isLoading === true}
            className="cursor-pointer"
          >
            {action.isLoading === true ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                {action.label}
              </span>
            ) : (
              action.label
            )}
          </Button>
        ))
      : null;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn(DESKTOP_SIZE_CLASS[size], className)}>
          <DialogHeader>
            <DialogTitle className="text-foreground">{title}</DialogTitle>
            {description !== undefined && (
              <DialogDescription className="text-muted-foreground">{description}</DialogDescription>
            )}
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto">{children}</div>

          {footerButtons !== null && <DialogFooter>{footerButtons}</DialogFooter>}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={className}>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-foreground">{title}</DrawerTitle>
          {description !== undefined && (
            <DrawerDescription className="text-muted-foreground">{description}</DrawerDescription>
          )}
        </DrawerHeader>

        <div className="max-h-[60vh] overflow-y-auto px-4">{children}</div>

        {footerButtons !== null && (
          <DrawerFooter className="flex-row justify-end gap-2 pt-2">{footerButtons}</DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
