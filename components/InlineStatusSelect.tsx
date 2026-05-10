'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import type { ApplicationStatus } from '@/types/application';

const STATUSES: ApplicationStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

const colors: Record<ApplicationStatus, string> = {
  Applied: 'text-blue-300 bg-blue-950 border-blue-800 [color-scheme:dark]',
  Interview: 'text-amber-300 bg-amber-950 border-amber-800 [color-scheme:dark]',
  Offer: 'text-green-300 bg-green-950 border-green-800 [color-scheme:dark]',
  Rejected: 'text-red-300 bg-red-950 border-red-800 [color-scheme:dark]',
  Withdrawn: 'text-slate-400 bg-slate-800 border-slate-700 [color-scheme:dark]',
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
