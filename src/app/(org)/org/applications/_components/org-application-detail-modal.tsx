'use client';

import { GeneralModal } from '@components/shared/general-modal';
import {
  useOrgApplicationDetail,
  useUpdateApplicationNotes,
  useUpdateApplicationStatus,
} from '@queries/org/use-org-applications';
import { Button } from '@ui/button';
import { Textarea } from '@ui/textarea';
import { useState } from 'react';

import type { ApplicationStatus } from '@app-types/org/org.applications';

import { getStatusActions } from './application-status-flow';
import { OrgApplicationDetailHeader } from './org-application-detail-header';
import { OrgApplicationHireConfirmModal } from './org-application-hire-confirm-modal';

interface OrgApplicationDetailModalProps {
  applicationId: string | null;
  onClose: () => void;
}

export function OrgApplicationDetailModal({
  applicationId,
  onClose,
}: OrgApplicationDetailModalProps): React.JSX.Element {
  const { data: application, isLoading } = useOrgApplicationDetail(applicationId);
  const updateStatus = useUpdateApplicationStatus();
  const [hireConfirmOpen, setHireConfirmOpen] = useState(false);

  function handleStatusAction(target: ApplicationStatus): void {
    if (!application) return;
    if (target === 'HIRED') {
      setHireConfirmOpen(true);
      return;
    }
    updateStatus.mutate({ id: application.id, status: target });
  }

  function handleConfirmHire(): void {
    if (!application) return;
    updateStatus.mutate(
      { id: application.id, status: 'HIRED' },
      { onSuccess: () => setHireConfirmOpen(false) },
    );
  }

  return (
    <>
      <GeneralModal
        open={applicationId !== null}
        onOpenChange={(open) => !open && onClose()}
        title={application ? application.candidateName : 'Application'}
        size="xl"
      >
        {isLoading || !application ? (
          <div className="flex flex-col gap-3 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-muted" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <OrgApplicationDetailHeader application={application} />

            {application.candidateSkills.length > 0 && (
              <div>
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Skills
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {application.candidateSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-brand-sky/30 bg-brand-sky/10 px-2.5 py-1 text-xs font-medium text-brand-sky"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {application.coverLetter && (
              <div>
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Cover Letter
                </p>
                <p className="mt-1.5 text-sm whitespace-pre-line text-foreground">
                  {application.coverLetter}
                </p>
              </div>
            )}

            <OrgApplicationNotes key={application.id} application={application} />

            {getStatusActions(application.status).length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                {getStatusActions(application.status).map((action) => (
                  <Button
                    key={action.target}
                    size="sm"
                    disabled={updateStatus.isPending}
                    variant={action.variant === 'danger' ? 'outline' : 'default'}
                    className={
                      action.variant === 'danger'
                        ? 'border-red-200 text-red-700 hover:bg-red-50'
                        : 'bg-brand-sky text-white hover:bg-brand-sky/90'
                    }
                    onClick={() => handleStatusAction(action.target)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </GeneralModal>

      <OrgApplicationHireConfirmModal
        open={hireConfirmOpen}
        candidateName={application?.candidateName ?? ''}
        isLoading={updateStatus.isPending}
        onOpenChange={setHireConfirmOpen}
        onConfirm={handleConfirmHire}
      />
    </>
  );
}

type OrgApplication = NonNullable<ReturnType<typeof useOrgApplicationDetail>['data']>;

function OrgApplicationNotes({ application }: { application: OrgApplication }): React.JSX.Element {
  const updateNotes = useUpdateApplicationNotes();
  const [noteDraft, setNoteDraft] = useState(application.notes ?? '');

  return (
    <div>
      <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        Internal Notes
      </p>
      <Textarea
        value={noteDraft}
        onChange={(e) => setNoteDraft(e.target.value)}
        placeholder="Notes are only visible to your organization…"
        rows={3}
        className="mt-1.5"
      />
      <div className="mt-1.5 flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => updateNotes.mutate({ id: application.id, notes: noteDraft })}
          disabled={updateNotes.isPending || noteDraft === (application.notes ?? '')}
        >
          {updateNotes.isPending ? 'Saving…' : 'Save Note'}
        </Button>
      </div>
    </div>
  );
}
