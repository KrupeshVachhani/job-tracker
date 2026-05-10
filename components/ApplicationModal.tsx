'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import type { Application } from '@/types/application';

const schema = z.object({
  company: z.string().min(1, 'Required'),
  role: z.string().min(1, 'Required'),
  source: z.string().min(1, 'Required'),
  appliedDate: z.string().min(1, 'Required'),
  status: z.enum(['Applied', 'Interview', 'Rejected', 'Offer', 'Withdrawn']),
  jobUrl: z.string().optional(),
  notes: z.string().optional(),
  resumeFile: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  initial: Application | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ApplicationModal({ initial, onClose, onSaved }: Props) {
  const isEdit = Boolean(initial);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      company: '',
      role: '',
      source: '',
      appliedDate: new Date().toISOString().slice(0, 10),
      status: 'Applied',
      jobUrl: '',
      notes: '',
      resumeFile: '',
    },
  });

  useEffect(() => {
    if (initial) {
      reset({
        company: initial.company,
        role: initial.role,
        source: initial.source,
        appliedDate: initial.appliedDate.slice(0, 10),
        status: initial.status,
        jobUrl: initial.jobUrl ?? '',
        notes: initial.notes ?? '',
        resumeFile: initial.resumeFile,
      });
    }
  }, [initial, reset]);

  async function onSubmit(values: FormValues) {
    const url = isEdit ? `/api/applications/${initial!.id}` : '/api/applications';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      toast.error(isEdit ? 'Failed to update application' : 'Failed to add application');
      return;
    }

    toast.success(isEdit ? 'Application updated' : 'Application added');
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit Application' : 'Add Application'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4">
          <Field label="Company" error={errors.company?.message}>
            <input {...register('company')} className={input} placeholder="Acme Corp" />
          </Field>
          <Field label="Role" error={errors.role?.message}>
            <input {...register('role')} className={input} placeholder="Software Engineer" />
          </Field>
          <Field label="Source" error={errors.source?.message}>
            <input {...register('source')} className={input} placeholder="LinkedIn, Referral…" />
          </Field>
          <Field label="Applied Date" error={errors.appliedDate?.message}>
            <input type="date" {...register('appliedDate')} className={input} />
          </Field>
          <Field label="Status" error={errors.status?.message}>
            <select {...register('status')} className={input}>
              {(['Applied', 'Interview', 'Rejected', 'Offer', 'Withdrawn'] as const).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Job URL (optional)">
            <input {...register('jobUrl')} className={input} placeholder="https://…" />
          </Field>
          <Field label="Notes (optional)">
            <textarea {...register('notes')} className={`${input} h-24 resize-none`} />
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
