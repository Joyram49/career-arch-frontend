'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateJob, useUpdateJob } from '@queries/org/use-org-job-form';
import { useRouter } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';

import {
  ORG_JOB_FORM_DEFAULTS,
  orgJobFormSchema,
  type OrgJobFormInput,
} from '@validations/org.job-form.schema';

import { JobFormFooter } from './job-form-footer';
import { JobFormStepBasics } from './job-form-step-basics';
import { JobFormStepDetails } from './job-form-step-details';
import { JobFormStepRequirements } from './job-form-step-requirements';
import { JobFormStepReview } from './job-form-step-review';
import { JobFormStepper } from './job-form-stepper';
import { useJobFormWizard } from './use-job-form-wizard';

interface OrgJobFormProps {
  mode: 'create' | 'edit';
  jobId?: string;
  initialValues?: Partial<OrgJobFormInput>;
}

export function OrgJobForm({ mode, jobId, initialValues }: OrgJobFormProps): React.JSX.Element {
  const router = useRouter();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();

  const form = useForm<OrgJobFormInput>({
    resolver: zodResolver(orgJobFormSchema) as Resolver<OrgJobFormInput>,
    defaultValues: { ...ORG_JOB_FORM_DEFAULTS, ...initialValues },
    mode: 'onBlur',
  });

  const {
    control,
    formState: { errors },
    watch,
    trigger,
    handleSubmit,
  } = form;

  // eslint-disable-next-line react-hooks/incompatible-library
  const isRemote = watch('isRemote');
  const salaryNotSpecified = watch('salaryNotSpecified');
  const values = watch();

  const wizard = useJobFormWizard(trigger);
  const isSubmitting = createJob.isPending || updateJob.isPending;

  function submit(status: 'DRAFT' | 'PUBLISHED'): void {
    void handleSubmit((data) => {
      if (mode === 'edit' && jobId) {
        updateJob.mutate(
          { id: jobId, ...data, status },
          { onSuccess: () => router.push(`/org/jobs/${jobId}`) },
        );
      } else {
        createJob.mutate({ ...data, status }, { onSuccess: () => router.push('/org/jobs') });
      }
    })();
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
      <JobFormStepper
        currentStep={wizard.step}
        visitedSteps={wizard.visitedSteps}
        onStepClick={wizard.goToStep}
      />

      <div className="flex-1 overflow-y-auto p-6">
        {wizard.step === 'basics' && (
          <JobFormStepBasics
            control={control}
            errors={errors}
            isRemote={isRemote}
            salaryNotSpecified={salaryNotSpecified}
          />
        )}
        {wizard.step === 'details' && <JobFormStepDetails control={control} errors={errors} />}
        {wizard.step === 'requirements' && (
          <JobFormStepRequirements control={control} errors={errors} />
        )}
        {wizard.step === 'review' && <JobFormStepReview values={values} />}
      </div>

      <JobFormFooter
        isFirst={wizard.isFirst}
        isLast={wizard.isLast}
        isSubmitting={isSubmitting}
        mode={mode}
        onBack={wizard.goBack}
        onNext={() => void wizard.goNext()}
        onSaveDraft={() => submit('DRAFT')}
        onPublish={() => submit('PUBLISHED')}
      />
    </div>
  );
}
