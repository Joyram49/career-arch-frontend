/* ═══════════════════════════════════════
   APPLICATION SCHEMA
═══════════════════════════════════════ */

import { z } from 'zod';

export const applyJobSchema = z.object({
  coverLetter: z.string().trim().max(3000).optional(),
  useExistingResume: z.boolean().default(true),
  screeningAnswers: z
    .array(z.object({ question: z.string(), answer: z.string().trim().max(500) }))
    .optional(),
});

export type ApplyJobInput = z.infer<typeof applyJobSchema>;
