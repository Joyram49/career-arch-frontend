import { z } from 'zod';

// Mirrors the backend's urlSchema: optional, empty string allowed, but must
// look like a real URL if provided; empty string normalizes to undefined.
const urlField = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .refine((val) => !val || /^https?:\/\/.+/i.test(val), {
    message: 'Must be a valid URL starting with http:// or https://',
  })
  .transform((val) => (val === '' ? undefined : val));

const optionalString = z
  .string()
  .trim()
  .max(150)
  .optional()
  .or(z.literal(''))
  .transform((val) => (val === '' ? undefined : val));

// Exact match to the backend's industry enum in org.validation.ts
export const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'E-Commerce',
  'Manufacturing',
  'Media & Entertainment',
  'Consulting',
  'Real Estate',
  'Transportation',
  'Energy',
  'Retail',
  'Telecommunications',
  'Government',
  'Non-Profit',
  'Other',
] as const;

export const COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5000+',
] as const;

export const orgProfileFormSchema = z.object({
  companyName: z.string().trim().min(2, 'Company name must be at least 2 characters').max(100),
  website: urlField,
  industry: z
    .enum(INDUSTRIES)
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  companySize: z
    .enum(COMPANY_SIZES)
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  foundedYear: z
    .number()
    .int()
    .min(1800, 'Founded year seems too far back')
    .max(new Date().getFullYear(), 'Founded year cannot be in the future')
    .optional(),
  description: z
    .string()
    .trim()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description must be at most 2000 characters'),
  location: optionalString,
  country: optionalString,
  linkedinUrl: urlField,
  twitterUrl: urlField,
});

export type OrgProfileFormInput = z.infer<typeof orgProfileFormSchema>;
