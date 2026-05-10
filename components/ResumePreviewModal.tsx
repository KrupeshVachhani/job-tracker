'use client';

interface Props {
  filename: string;
  onClose: () => void;
}

export default function ResumePreviewModal({ filename, onClose }: Props) {
  const url = `/api/resumes/${filename}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-700 shrink-0">
          <h2 className="text-sm font-semibold text-slate-200 truncate">{filename}</h2>
          <div className="flex items-center gap-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
            >
              Open in new tab
            </a>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-200 text-xl leading-none transition-colors">&times;</button>
          </div>
        </div>
        <iframe
          src={url}
          className="flex-1 w-full rounded-b-xl"
          title="Resume Preview"
        />
      </div>
    </div>
  );
}
