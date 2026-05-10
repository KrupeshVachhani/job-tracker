import type { ApplicationStatus } from '@/types/application';

const styles: Record<ApplicationStatus, string> = {
  Applied: 'bg-blue-950 text-blue-300',
  Interview: 'bg-amber-950 text-amber-300',
  Offer: 'bg-green-950 text-green-300',
  Rejected: 'bg-red-950 text-red-300',
  Withdrawn: 'bg-slate-800 text-slate-400',
};

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}
