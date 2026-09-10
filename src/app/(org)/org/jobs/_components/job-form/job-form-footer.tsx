'use client';

import { Button } from '@ui/button';

interface JobFormFooterProps {
  isFirst: boolean;
  isLast: boolean;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export function JobFormFooter({
  isFirst,
  isLast,
  isSubmitting,
  mode,
  onBack,
  onNext,
  onSaveDraft,
  onPublish,
}: JobFormFooterProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between border-t border-border bg-card px-6 py-4">
      <Button type="button" variant="outline" onClick={onBack} disabled={isFirst || isSubmitting}>
        Back
      </Button>

      {isLast ? (
        <div className="flex items-center gap-2">
          {mode === 'create' && (
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={onSaveDraft}>
              Save as Draft
            </Button>
          )}
          <Button
            type="button"
            className="bg-brand-emerald text-white hover:bg-brand-emerald/90"
            disabled={isSubmitting}
            onClick={onPublish}
          >
            {isSubmitting ? 'Saving…' : mode === 'edit' ? 'Save Changes' : 'Publish Now'}
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          className="bg-brand-sky text-white hover:bg-brand-sky/90"
          onClick={onNext}
        >
          Next
        </Button>
      )}
    </div>
  );
}
