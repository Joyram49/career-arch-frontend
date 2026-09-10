'use client';

import { useState } from 'react';
import type { UseFormTrigger } from 'react-hook-form';

import type { OrgJobFormInput } from '@validations/org.job-form.schema';

export type JobFormStep = 'basics' | 'details' | 'requirements' | 'review';

export const STEP_ORDER: JobFormStep[] = ['basics', 'details', 'requirements', 'review'];

export const STEP_LABELS: Record<JobFormStep, string> = {
  basics: 'Basics',
  details: 'Details',
  requirements: 'Requirements',
  review: 'Review & Publish',
};

const STEP_FIELDS: Record<JobFormStep, (keyof OrgJobFormInput)[]> = {
  basics: [
    'title',
    'jobType',
    'isRemote',
    'location',
    'salaryNotSpecified',
    'salaryMin',
    'salaryMax',
    'salaryCurrency',
    'category',
    'vacancies',
    'deadline',
    'requiredPlan',
  ],
  details: ['description', 'responsibilities'],
  requirements: ['requirements', 'skills', 'experienceLevel'],
  review: [],
};

interface UseJobFormWizardReturn {
  step: JobFormStep;
  isFirst: boolean;
  isLast: boolean;
  visitedSteps: JobFormStep[];
  goNext: () => Promise<void>;
  goBack: () => void;
  goToStep: (step: JobFormStep) => void;
}

export function useJobFormWizard(trigger: UseFormTrigger<OrgJobFormInput>): UseJobFormWizardReturn {
  const [step, setStep] = useState<JobFormStep>('basics');
  const [visitedSteps, setVisitedSteps] = useState<JobFormStep[]>(['basics']);

  const stepIndex = STEP_ORDER.indexOf(step);

  async function goNext(): Promise<void> {
    const fields = STEP_FIELDS[step];
    const isValid = fields.length === 0 || (await trigger(fields));
    if (!isValid) return;

    const next = STEP_ORDER[stepIndex + 1];
    if (next) {
      setStep(next);
      setVisitedSteps((prev) => (prev.includes(next) ? prev : [...prev, next]));
    }
  }

  function goBack(): void {
    const prev = STEP_ORDER[stepIndex - 1];
    if (prev) setStep(prev);
  }

  function goToStep(target: JobFormStep): void {
    if (visitedSteps.includes(target)) setStep(target);
  }

  return {
    step,
    isFirst: stepIndex === 0,
    isLast: stepIndex === STEP_ORDER.length - 1,
    visitedSteps,
    goNext,
    goBack,
    goToStep,
  };
}
