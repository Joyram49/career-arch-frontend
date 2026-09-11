import { todayISODate } from '@/utils/date-utils';
import { stripHtml } from '@/utils/strip-html';
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

    // Must be strictly after today — checked again below since a manually
    // typed/pasted value could bypass the <input min> attribute.
    deadline: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine((val) => !val || val > todayISODate(), {
        message: 'Deadline must be a future date',
      }),

    requiredPlan: z.enum(['FREE', 'BASIC', 'PREMIUM']).default('FREE'),

    // Rich-text fields: TipTap emits HTML like "<p>&nbsp;</p>" for an
    // "empty" editor, which has non-zero .length — so length checks must
    // run against the *stripped plain text*, never the raw HTML string.
    description: z
      .string()
      .transform((html) => html.trim())
      .superRefine((html, ctx) => {
        const text = stripHtml(html);
        if (text.length === 0) {
          ctx.addIssue({ code: 'custom', message: 'Description is required' });
        } else if (text.length < 50) {
          ctx.addIssue({ code: 'custom', message: 'Description must be at least 50 characters' });
        }
      }),

    // Optional rich text: if the user only typed whitespace/formatting with
    // no real characters, normalize to '' rather than saving a "populated"
    // field that's actually blank.
    responsibilities: z
      .string()
      .transform((html) => (stripHtml(html).length === 0 ? '' : html.trim()))
      .optional()
      .or(z.literal('')),

    requirements: z
      .string()
      .transform((html) => (stripHtml(html).length === 0 ? '' : html.trim()))
      .optional()
      .or(z.literal('')),

    skills: z
      .array(z.string())
      .transform((arr) => arr.map((s) => s.trim()).filter((s) => s.length > 0))
      .refine((arr) => arr.length > 0, { message: 'Add at least one skill' })
      .refine((arr) => arr.length <= 20, { message: 'You can add up to 20 skills' }),

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
  })
  // Once "Don't specify salary" is checked, whatever was previously typed
  // into min/max is discarded at submit time — the fields are only visually
  // disabled otherwise, so leftover values would silently persist.
  .transform((data) => ({
    ...data,
    salaryMin: data.salaryNotSpecified ? undefined : data.salaryMin,
    salaryMax: data.salaryNotSpecified ? undefined : data.salaryMax,
  }));

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
