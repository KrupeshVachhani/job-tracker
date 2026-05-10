'use client';

import { useState } from 'react';
import useSWR from 'swr';
import type { Application } from '@/types/application';
import InlineStatusSelect from '@/components/InlineStatusSelect';
import ApplicationModal from '@/components/ApplicationModal';
import ResumePreviewModal from '@/components/ResumePreviewModal';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Dashboard() {
  const { data: applications = [], mutate } = useSWR<Application[]>(
    '/api/applications',
    fetcher
  );
  const [editTarget, setEditTarget] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  function openAdd() {
    setEditTarget(null);
    setShowModal(true);
  }

  function openEdit(app: Application) {
    setEditTarget(app);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditTarget(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this application?')) return;
    const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Application deleted');
    } else {
      toast.error('Failed to delete application');
    }
    mutate();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Job Tracker</h1>
          <button
            onClick={openAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Application
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg font-medium">No applications yet</p>
            <p className="text-sm mt-1">Click &quot;+ Add Application&quot; to get started.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Company</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Applied</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Source</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Resume</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{app.company}</td>
                    <td className="px-4 py-3 text-gray-700">{app.role}</td>
                    <td className="px-4 py-3">
                      <InlineStatusSelect id={app.id} status={app.status} onUpdated={mutate} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{app.source}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {app.isStarterResume && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            Starter
                          </span>
                        )}
                        <button
                          onClick={() => setPreviewFile(app.resumeFile)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(app)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <ApplicationModal
          initial={editTarget}
          onClose={closeModal}
          onSaved={() => { mutate(); closeModal(); }}
        />
      )}

      {previewFile && (
        <ResumePreviewModal
          filename={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </main>
  );
}
