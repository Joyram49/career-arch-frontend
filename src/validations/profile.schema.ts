import { z } from 'zod';
/* ======================= Profile Schemas =========================== */
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters long')
    .max(50, 'First name is too long')
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters long')
    .max(50, 'Last name is too long')
    .optional(),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s\-()]{7,15}$/, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  location: z.string().trim().max(100, 'Location is too long').optional(),
  headline: z.string().trim().max(120, 'Headline is too long').optional(),
  summary: z.string().trim().max(2000, 'Sumary must be within 2000 characters').optional(),
  Skills: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
  experienceYears: z.coerce.number().int().min(0).max(50).optional(),
  linkedinUrl: z.url('Enter a valid URL').optional().or(z.literal('')),
  githubUrl: z.url('Enter a valid URL').optional().or(z.literal('')),
  portfolioUrl: z.url('Enter a valid URL').optional().or(z.literal('')),
});

export const updateOrgProfileSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, 'Company name must be atleast 2 characters long')
    .max(100, 'Company name is too long')
    .optional(),
  description: z.string().trim().min(30).max(5000).optional(),
  website: z.url('Enter a valid url').optional().or(z.literal('')),
  industry: z.string().trim().max(100).optional(),
  companySize: z.enum(['1-10', '11-50', '51-200', '201-1000', '1001-5000', '5000+']).optional(),
  foundedYear: z.coerce.number().int().min(1800).max(new Date().getFullYear()).optional(),
  location: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).optional(),
  linkedinUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  twitterUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateOrgProfileInput = z.infer<typeof updateOrgProfileSchema>;
