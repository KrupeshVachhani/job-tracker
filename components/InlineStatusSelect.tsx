'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import type { ApplicationStatus } from '@/types/application';

const STATUSES: ApplicationStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

const colors: Record<ApplicationStatus, string> = {
  Applied: 'text-blue-700 bg-blue-50 border-blue-200',
  Interview: 'text-amber-700 bg-amber-50 border-amber-200',
  Offer: 'text-green-700 bg-green-50 border-green-200',
  Rejected: 'text-red-700 bg-red-50 border-red-200',
  Withdrawn: 'text-gray-600 bg-gray-50 border-gray-200',
};

interface Props {
  id: string;
  status: ApplicationStatus;
  onUpdated: () => void;
}

export default function InlineStatusSelect({ id, status, onUpdated }: Props) {
  const [current, setCurrent] = useState<ApplicationStatus>(status);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as ApplicationStatus;
    setLoading(true);
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    setLoading(false);
    if (res.ok) {
      setCurrent(next);
      toast.success('Status updated');
      onUpdated();
    } else {
      toast.error('Failed to update status');
    }
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={loading}
      className={`text-xs font-medium border rounded-full px-2.5 py-0.5 cursor-pointer focus:outline-none disabled:opacity-60 ${colors[current]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
