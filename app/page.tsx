'use client';

import { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import type { Application, ApplicationStatus } from '@/types/application';
import InlineStatusSelect from '@/components/InlineStatusSelect';
import ApplicationModal from '@/components/ApplicationModal';
import ResumePreviewModal from '@/components/ResumePreviewModal';
import StatusBadge from '@/components/StatusBadge';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Papa from 'papaparse';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const ALL_STATUSES: ApplicationStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

type SortKey = 'appliedDate' | 'company' | 'status';
type SortDir = 'asc' | 'desc';

export default function Dashboard() {
  const { data: applications = [], mutate } = useSWR<Application[]>(
    '/api/applications',
    fetcher
  );

  const [editTarget, setEditTarget] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Set<ApplicationStatus>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>('appliedDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Cmd/Ctrl+K to open add modal
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setEditTarget(null);
        setShowModal(true);
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  function openAdd() { setEditTarget(null); setShowModal(true); }
  function openEdit(app: Application) { setEditTarget(app); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditTarget(null); }

  async function handleDelete(id: string) {
    if (!confirm('Delete this application?')) return;
    const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
    if (res.ok) toast.success('Application deleted');
    else toast.error('Failed to delete application');
    mutate();
  }

  function toggleStatus(s: ApplicationStatus) {
    setStatusFilter((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s); else next.add(s);
      return next;
    });
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  const filtered = useMemo(() => {
    let list = applications;
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((a) => a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q));
    if (statusFilter.size > 0) list = list.filter((a) => statusFilter.has(a.status));
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'appliedDate') cmp = a.appliedDate.localeCompare(b.appliedDate);
      else if (sortKey === 'company') cmp = a.company.localeCompare(b.company);
      else if (sortKey === 'status') cmp = a.status.localeCompare(b.status);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [applications, search, statusFilter, sortKey, sortDir]);

  // Stats
  const stats = useMemo(() => {
    const counts: Record<ApplicationStatus, number> = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0, Withdrawn: 0 };
    applications.forEach((a) => counts[a.status]++);
    return counts;
  }, [applications]);

  function exportCSV() {
    const csv = Papa.unparse(applications.map(({ id, createdAt, updatedAt, ...rest }) => ({ ...rest, id, createdAt, updatedAt })));
    download('applications.csv', csv, 'text/csv');
  }

  function exportJSON() {
    download('applications.json', JSON.stringify(applications, null, 2), 'application/json');
  }

  function download(name: string, content: string, type: string) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = name;
    a.click();
  }

  function sortIcon(key: SortKey) {
    if (sortKey !== key) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-blue-500 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Job Tracker</h1>
          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="px-3 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">Export CSV</button>
            <button onClick={exportJSON} className="px-3 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">Export JSON</button>
            <button
              onClick={openAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + Add <span className="hidden sm:inline text-blue-200 text-xs ml-1">⌘K</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        {applications.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-5">
            <Stat label="Total" value={applications.length} color="bg-gray-100 text-gray-700" />
            <Stat label="Applied" value={stats.Applied} color="bg-blue-50 text-blue-700" />
            <Stat label="Interview" value={stats.Interview} color="bg-amber-50 text-amber-700" />
            <Stat label="Offer" value={stats.Offer} color="bg-green-50 text-green-700" />
            <Stat label="Rejected" value={stats.Rejected} color="bg-red-50 text-red-700" />
            <Stat label="Withdrawn" value={stats.Withdrawn} color="bg-gray-100 text-gray-500" />
          </div>
        )}

        {/* Search */}
        <div className="mb-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or role…"
            className="w-full sm:w-80 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status filter chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => toggleStatus(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                statusFilter.has(s)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
            >
              {s}
            </button>
          ))}
          {statusFilter.size > 0 && (
            <button onClick={() => setStatusFilter(new Set())} className="px-3 py-1 rounded-full text-xs text-gray-400 hover:text-gray-600 border border-transparent">
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        {applications.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg font-medium">No applications yet</p>
            <p className="text-sm mt-1">Click &quot;+ Add Application&quot; or press ⌘K to get started.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-base font-medium">No results match your filters</p>
            <button onClick={() => { setSearch(''); setStatusFilter(new Set()); }} className="text-sm text-blue-600 hover:underline mt-1">Clear filters</button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <SortTh label="Company" sortKey="company" current={sortKey} dir={sortDir} onSort={handleSort} icon={sortIcon('company')} />
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
                  <SortTh label="Status" sortKey="status" current={sortKey} dir={sortDir} onSort={handleSort} icon={sortIcon('status')} />
                  <SortTh label="Applied" sortKey="appliedDate" current={sortKey} dir={sortDir} onSort={handleSort} icon={sortIcon('appliedDate')} />
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Source</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Resume</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{app.company}</td>
                    <td className="px-4 py-3 text-gray-700">{app.role}</td>
                    <td className="px-4 py-3">
                      <InlineStatusSelect id={app.id} status={app.status} onUpdated={mutate} />
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{app.source}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {app.isStarterResume && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">Starter</span>
                        )}
                        <button onClick={() => setPreviewFile(app.resumeFile)} className="text-xs text-blue-600 hover:underline">View</button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(app)} className="text-xs text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(app.id)} className="text-xs text-red-500 hover:underline">Delete</button>
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
        <ApplicationModal initial={editTarget} onClose={closeModal} onSaved={() => { mutate(); closeModal(); }} />
      )}
      {previewFile && (
        <ResumePreviewModal filename={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </main>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${color}`}>
      <span>{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function SortTh({ label, sortKey, current, onSort, icon }: {
  label: string; sortKey: SortKey; current: SortKey; dir: SortDir; onSort: (k: SortKey) => void; icon: React.ReactNode;
}) {
  return (
    <th
      className={`text-left px-4 py-3 font-semibold text-gray-600 cursor-pointer select-none hover:text-gray-900 ${current === sortKey ? 'text-blue-600' : ''}`}
      onClick={() => onSort(sortKey)}
    >
      {label}{icon}
    </th>
  );
}

// Keep StatusBadge in scope for potential future use
export { StatusBadge };
