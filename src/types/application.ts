import type { IUser } from './auth';
import type { IJob } from './job';

/* ======================= APPLICATION TYPES =========================== */
export type ApplicationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'OFFERED'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface IApplication {
  id: string;
  userId: string;
  jobId: string;
  status: ApplicationStatus;
  coverLetter: string | null;
  resumeUrl: string | null;
  resumeFileName: string | null;
  appliedAt: string;
  updatedAt: string;
  job: Pick<
    IJob,
    'id' | 'slug' | 'title' | 'jobType' | 'isRemote' | 'salaryMin' | 'salaryMax' | 'organization'
  >;
  user?: Pick<IUser, 'id' | 'email' | 'profile'>;
}

export interface IApplicationWithDetails extends IApplication {
  screeningAnswers: Array<{ question: string; answer: string }>;
  orgNotes?: string | null;
}
