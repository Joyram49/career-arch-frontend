import { z } from 'zod';

export const orgJobFormSchema = z
  .object({
    title: z.string().trim().min(5, 'Title must be at least 5 characters').max(150),
    jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'REMOTE']),
    isRemote: z.boolean().default(false),
    location: z.string().trim().max(150).optional().or(z.literal('')),

    salaryNotSpecified: z.boolean().default(false),
    salaryMin: z.number().int().nonnegative().optional(),
    salaryMax: z.number().int().nonnegative().optional(),
    salaryCurrency: z.string().default('USD'),

    category: z.string().trim().min(1, 'Category is required'),
    vacancies: z.number().int().min(1, 'At least 1 vacancy is required').max(999).default(1),
    deadline: z.string().optional().or(z.literal('')),
    requiredPlan: z.enum(['FREE', 'BASIC', 'PREMIUM']).default('FREE'),

    description: z.string().trim().min(50, 'Description must be at least 50 characters'),
    responsibilities: z.string().trim().optional().or(z.literal('')),

    requirements: z.string().trim().optional().or(z.literal('')),
    skills: z
      .array(z.string().trim().min(1))
      .min(1, 'Add at least one skill')
      .max(20, 'You can add up to 20 skills'),
    experienceLevel: z.enum(['Entry', 'Mid', 'Senior', 'Lead']).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isRemote && (!data.location || data.location.trim().length === 0)) {
      ctx.addIssue({
        code: 'custom',
        path: ['location'],
        message: 'Location is required unless this is a remote position',
      });
    }
    if (!data.salaryNotSpecified) {
      if (data.salaryMin === undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['salaryMin'],
          message: 'Minimum salary is required',
        });
      }
      if (data.salaryMax === undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['salaryMax'],
          message: 'Maximum salary is required',
        });
      }
      if (
        data.salaryMin !== undefined &&
        data.salaryMax !== undefined &&
        data.salaryMin > data.salaryMax
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['salaryMax'],
          message: 'Maximum must be greater than or equal to minimum',
        });
      }
    }
  });

export type OrgJobFormInput = z.infer<typeof orgJobFormSchema>;

export const ORG_JOB_FORM_DEFAULTS: OrgJobFormInput = {
  title: '',
  jobType: 'FULL_TIME',
  isRemote: false,
  location: '',
  salaryNotSpecified: false,
  salaryMin: undefined,
  salaryMax: undefined,
  salaryCurrency: 'USD',
  category: '',
  vacancies: 1,
  deadline: '',
  requiredPlan: 'FREE',
  description: '',
  responsibilities: '',
  requirements: '',
  skills: [],
  experienceLevel: undefined,
};
