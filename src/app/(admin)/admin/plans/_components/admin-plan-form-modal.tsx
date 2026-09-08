'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type Resolver } from 'react-hook-form';

import { type IAdminPlanListItem } from '@app-types/admin/admin.dashboard.plans';
import { GeneralModal, type ModalAction } from '@components/shared/general-modal';
import { useCreatePlan, useUpdatePlan } from '@queries/admin/use-admin-plans';
import { Field, FieldError, FieldGroup, FieldLabel } from '@ui/field';
import { Input } from '@ui/input';
import { Switch } from '@ui/switch';
import { Textarea } from '@ui/textarea';
import { adminPlanFormSchema, type AdminPlanFormInput } from '@validations/admin.dashboard.schema';

interface AdminPlanFormModalProps {
  /** null → create mode. A plan → edit mode. */
  plan: IAdminPlanListItem | null;
  open: boolean;
  onClose: () => void;
}

const FEATURE_LIMIT_FIELDS: Array<{
  key: 'jobBrowseLimit' | 'applyMonthlyLimit' | 'saveJobsLimit' | 'resumeVersions';
  label: string;
  helper: string;
}> = [
  { key: 'jobBrowseLimit', label: 'Job Browse Limit', helper: '-1 = unlimited' },
  { key: 'applyMonthlyLimit', label: 'Apply Limit / Month', helper: '-1 = unlimited' },
  { key: 'saveJobsLimit', label: 'Saved Jobs Limit', helper: '-1 = unlimited' },
  { key: 'resumeVersions', label: 'Resume Versions', helper: '-1 = unlimited' },
];

const FEATURE_TOGGLE_FIELDS: Array<{
  key:
    | 'canViewOrgProfile'
    | 'canDownloadHistory'
    | 'earlyJobAlerts'
    | 'prioritySearch'
    | 'aiResumeTips';
  label: string;
}> = [
  { key: 'canViewOrgProfile', label: 'View organization profiles' },
  { key: 'canDownloadHistory', label: 'Download application history' },
  { key: 'earlyJobAlerts', label: 'Early job alerts' },
  { key: 'prioritySearch', label: 'Priority in search' },
  { key: 'aiResumeTips', label: 'AI resume tips' },
];

function buildDefaultValues(plan: IAdminPlanListItem | null): AdminPlanFormInput {
  if (plan) {
    return {
      key: plan.key === 'FREE' ? 'BASIC' : plan.key,
      displayName: plan.displayName,
      description: plan.description ?? '',
      monthlyPriceCents: plan.monthlyPriceCents,
      features: plan.features,
    };
  }

  return {
    key: 'BASIC',
    displayName: '',
    description: '',
    monthlyPriceCents: 999,
    features: {
      jobBrowseLimit: -1,
      applyMonthlyLimit: 30,
      saveJobsLimit: 50,
      canViewOrgProfile: true,
      resumeVersions: 3,
      canDownloadHistory: false,
      earlyJobAlerts: false,
      prioritySearch: false,
      aiResumeTips: false,
      badge: 'basic',
    },
  };
}

export function AdminPlanFormModal({
  plan,
  open,
  onClose,
}: AdminPlanFormModalProps): React.JSX.Element {
  const isEdit = plan !== null;

  const { control, handleSubmit, reset } = useForm<AdminPlanFormInput>({
    resolver: zodResolver(adminPlanFormSchema) as Resolver<AdminPlanFormInput>,
    values: buildDefaultValues(plan),
  });

  const createMutation = useCreatePlan();
  const updateMutation = useUpdatePlan();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleClose = (): void => {
    reset(buildDefaultValues(null));
    onClose();
  };

  const onSubmit = (data: AdminPlanFormInput): void => {
    if (isEdit && plan) {
      updateMutation.mutate(
        {
          id: plan.id,
          payload: {
            displayName: data.displayName,
            description: data.description === '' ? null : data.description,
            monthlyPriceCents: data.monthlyPriceCents,
            features: data.features,
          },
        },
        { onSuccess: handleClose },
      );
      return;
    }

    createMutation.mutate(
      {
        key: data.key,
        displayName: data.displayName,
        description: data.description === '' ? undefined : data.description,
        monthlyPriceCents: data.monthlyPriceCents,
        features: data.features,
      },
      { onSuccess: handleClose },
    );
  };

  const actions: ModalAction[] = [
    { label: 'Cancel', variant: 'outline', onClick: handleClose, disabled: isSubmitting },
    {
      label: isEdit ? 'Save Changes' : 'Create Plan & Sync to Stripe',
      isLoading: isSubmitting,
      onClick: handleSubmit(onSubmit),
    },
  ];

  return (
    <GeneralModal
      open={open}
      onOpenChange={(next) => !next && handleClose()}
      title={isEdit ? `Edit ${plan?.displayName} Plan` : 'Create New Plan'}
      description="Changes sync automatically to Stripe Products & Prices via the backend."
      size="lg"
      actions={actions}
    >
      <form
        id="admin-plan-form"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit(onSubmit)();
        }}
        noValidate
      >
        <FieldGroup className="space-y-4">
          {/* Plan key — locked on edit (key is the DB unique identity) */}
          <Controller
            name="key"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="plan-key"
                  className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                >
                  Plan Key
                </FieldLabel>
                <select
                  {...field}
                  id="plan-key"
                  disabled={isEdit}
                  className="h-10 w-full rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="BASIC">BASIC</option>
                  <option value="PREMIUM">PREMIUM</option>
                </select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Display name */}
          <Controller
            name="displayName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="plan-display-name"
                  className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                >
                  Display Name
                </FieldLabel>
                <Input {...field} id="plan-display-name" className="h-10 text-sm" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="plan-description"
                  className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                >
                  Description <span className="text-muted-foreground/70">(optional)</span>
                </FieldLabel>
                <Textarea id="plan-description" rows={2} {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Price */}
          <Controller
            name="monthlyPriceCents"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="plan-price"
                  className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                >
                  Price (USD/month)
                </FieldLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="plan-price"
                    type="number"
                    min={0.01}
                    step={0.01}
                    value={field.value / 100}
                    onChange={(e) =>
                      field.onChange(Math.round(parseFloat(e.target.value || '0') * 100))
                    }
                    className="h-10 pl-7 text-sm"
                  />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                {isEdit && plan?.stripeProductId && (
                  <p className="text-[11px] text-muted-foreground">
                    Changing the price archives the current Stripe Price and creates a new one.
                    Existing subscribers keep their price until renewal.
                  </p>
                )}
              </Field>
            )}
          />

          {/* Feature limits */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase">
              Limits
            </p>
            <div className="grid grid-cols-2 gap-3">
              {FEATURE_LIMIT_FIELDS.map((f) => (
                <Controller
                  key={f.key}
                  name={`features.${f.key}`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor={f.key}
                        className="text-[11px] font-semibold text-foreground/70"
                      >
                        {f.label}
                      </FieldLabel>
                      <Input
                        id={f.key}
                        type="number"
                        min={-1}
                        value={field.value}
                        onChange={(e) => field.onChange(parseInt(e.target.value || '0', 10))}
                        className="h-9 text-sm"
                      />
                      <p className="text-[10px] text-muted-foreground">{f.helper}</p>
                    </Field>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Feature toggles */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase">
              Features
            </p>
            <div className="divide-y divide-border rounded-lg border border-border bg-muted/30">
              {FEATURE_TOGGLE_FIELDS.map((f) => (
                <Controller
                  key={f.key}
                  name={`features.${f.key}`}
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <label htmlFor={f.key} className="text-sm text-foreground">
                        {f.label}
                      </label>
                      <Switch id={f.key} checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Badge */}
          <Controller
            name="features.badge"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel
                  htmlFor="plan-badge"
                  className="text-[11px] font-bold tracking-widest text-foreground/70 uppercase"
                >
                  Badge
                </FieldLabel>
                <select
                  id="plan-badge"
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? null : e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-input px-3 text-sm text-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none"
                >
                  <option value="">None</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                </select>
              </Field>
            )}
          />

          {isEdit && plan?.stripeProductId && (
            <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs text-sky-800">
              <span className="mt-1 block text-[10px] text-sky-600">
                Product: {plan.stripeProductId} · Price: {plan.stripePriceId}
              </span>
            </div>
          )}
        </FieldGroup>
      </form>
    </GeneralModal>
  );
}
