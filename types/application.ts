export type ApplicationStatus =
  | 'Applied'
  | 'Interview'
  | 'Rejected'
  | 'Offer'
  | 'Withdrawn';

export interface Application {
  id: string;
  company: string;
  role: string;
  source: string;
  appliedDate: string;
  status: ApplicationStatus;
  resumeFile: string;
  isStarterResume: boolean;
  jobUrl?: string;
  notes?: string;
  updatedAt: string;
  createdAt: string;
}
