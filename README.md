# job-tracker

A local-first personal resume & job application tracker. No database, no cloud, no auth — runs entirely on your machine via `npm run dev`.

## Screenshots

> _Screenshots coming soon — run locally to see the dashboard._

## Features

- **Application tracking** — company, role, source, status, applied date, job URL, notes
- **Resume management** — upload a custom PDF per application; auto-falls back to a single starter resume
- **PDF preview** — view resumes inline in an iframe modal or open in a new tab
- **Color-coded status badges** — Applied (blue), Interview (amber), Offer (green), Rejected (red), Withdrawn (gray)
- **Inline status updates** — change status directly in the table row without opening a modal
- **Search** — filter by company or role (client-side, case-insensitive)
- **Status filter chips** — multi-select filter by one or more statuses
- **Sortable columns** — sort by date applied, company name, or status
- **Export** — download all data as CSV (via papaparse) or JSON
- **Stats header** — total count and per-status breakdown at a glance
- **Keyboard shortcut** — Cmd/Ctrl+K to open the Add Application modal
- **Responsive layout** — works on desktop and tablet

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Storage | Local JSON file + PDF files on disk |
| Validation | Zod |
| Forms | react-hook-form + @hookform/resolvers |
| Data fetching | SWR |
| Notifications | react-hot-toast |
| CSV export | papaparse |

## Setup

```bash
git clone https://github.com/KrupeshVachhani/job-tracker.git
cd job-tracker
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Optional — Starter Resume:**
Drop your default resume PDF at `data/resumes/starter.pdf`. Any application submitted without a custom PDF will use this file automatically. If it doesn't exist, the resume field will simply be blank.

## Folder Structure

```
job-tracker/
├── app/
│   ├── api/
│   │   ├── applications/
│   │   │   ├── route.ts              # GET all, POST new
│   │   │   └── [id]/route.ts         # GET one, PUT, DELETE
│   │   └── resumes/
│   │       ├── upload/route.ts       # POST — validate & save PDF
│   │       └── [filename]/route.ts   # GET — stream PDF with path sanitization
│   ├── layout.tsx
│   └── page.tsx                      # Dashboard (all UI state)
├── components/
│   ├── ApplicationModal.tsx          # Add/edit form modal
│   ├── InlineStatusSelect.tsx        # Quick status dropdown per row
│   ├── ResumePreviewModal.tsx        # PDF iframe preview
│   └── StatusBadge.tsx              # Color-coded status pill
├── lib/
│   ├── config.ts                     # Constants (STARTER_RESUME)
│   └── storage.ts                    # Atomic JSON read/write with mutex
├── types/
│   └── application.ts               # Application interface + status union
├── data/                             # Git-ignored at runtime
│   ├── .gitkeep
│   ├── applications.json            # Auto-created on first run
│   └── resumes/
│       ├── .gitkeep
│       └── starter.pdf              # Drop your resume here
└── public/
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | List all applications |
| POST | `/api/applications` | Create new application |
| GET | `/api/applications/:id` | Get single application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application + PDF |
| POST | `/api/resumes/upload` | Upload PDF (max 10 MB) |
| GET | `/api/resumes/:filename` | Stream PDF file |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT © Krupesh Vachhani — see [LICENSE](LICENSE)
