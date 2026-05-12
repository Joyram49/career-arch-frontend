/* ═══════════════════════════════════════
   JOB SCHEMAS
═══════════════════════════════════════ */
import { z } from 'zod';

import { JOB_CATEGORIES } from '@/constants/job';

export const createJobSchema = z
  .object({
    title: z.string().trim().min(3, 'Job title is required').max(120),
    jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']),
    location: z.string().trim().max(100).optional(),
    isRemote: z.boolean().default(false),
    salaryMin: z.coerce.number().int().min(0).optional(),
    salaryMax: z.coerce.number().int().min(0).optional(),
    currency: z.string().default('USD'),
    category: z.enum(JOB_CATEGORIES),
    vacancies: z.coerce.number().int().min(1).max(999).default(1),
    applicationDeadline: z.string().optional(),
    requiredPlan: z.enum(['FREE', 'BASIC', 'PREMIUM']).default('FREE'),
    description: z.string().trim().min(50, 'Description must be at least 50 characters').max(20000),
    responsibilities: z.string().trim().max(10000).optional(),
    benefits: z.array(z.string().trim()).max(20).default([]),
    requiredSkills: z.array(z.string().trim().min(1)).min(1, 'At least one skill required').max(20),
    preferredSkills: z.array(z.string().trim()).max(15).default([]),
    experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD']),
    education: z.string().trim().max(200).optional(),
    screeningQuestions: z.array(z.string().trim().max(500)).max(5).default([]),
  })
  .refine(
    (data) => {
      if (data.salaryMin !== undefined && data.salaryMax !== undefined) {
        return data.salaryMax >= data.salaryMin;
      }
      return true;
    },
    { message: 'Maximum salary must be greater than minimum', path: ['salaryMax'] },
  );
export type CreateJobInput = z.infer<typeof createJobSchema>;
