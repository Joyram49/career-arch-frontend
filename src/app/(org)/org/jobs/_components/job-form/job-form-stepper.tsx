'use client';

import { cn } from '@lib/utils';

import { STEP_LABELS, STEP_ORDER, type JobFormStep } from './use-job-form-wizard';

interface JobFormStepperProps {
  currentStep: JobFormStep;
  visitedSteps: JobFormStep[];
  onStepClick: (step: JobFormStep) => void;
}

export function JobFormStepper({
  currentStep,
  visitedSteps,
  onStepClick,
}: JobFormStepperProps): React.JSX.Element {
  return (
    <ol className="flex items-center gap-2 border-b border-border bg-card px-6 py-4">
      {STEP_ORDER.map((step, i) => {
        const isActive = step === currentStep;
        const isVisited = visitedSteps.includes(step);
        const isClickable = isVisited && !isActive;

        return (
          <li key={step} className="flex flex-1 items-center gap-2 last:flex-none">
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => onStepClick(step)}
              className={cn(
                'flex items-center gap-2 text-xs font-medium transition-colors',
                isActive
                  ? 'text-brand-sky'
                  : isVisited
                    ? 'text-foreground hover:text-brand-sky'
                    : 'text-muted-foreground',
                isClickable && 'cursor-pointer',
              )}
            >
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold',
                  isActive
                    ? 'border-brand-sky bg-brand-sky text-white'
                    : isVisited
                      ? 'border-brand-sky text-brand-sky'
                      : 'border-border text-muted-foreground',
                )}
              >
                {isVisited && !isActive ? (
                  <i className="ti ti-check text-[12px]" aria-hidden="true" />
                ) : (
                  i + 1
                )}
              </span>
              <span className="hidden sm:inline">{STEP_LABELS[step]}</span>
            </button>
            {i < STEP_ORDER.length - 1 && <span className="h-px flex-1 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}
