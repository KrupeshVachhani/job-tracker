# job-tracker

A local-first personal resume & job application tracker. No database, no cloud, no auth — runs entirely on your machine via `npm run dev`.

## Features

- Track job applications with company, role, status, source, dates, and notes
- Upload a custom resume PDF per application, or auto-fall back to a single starter resume
- View and preview resume PDFs inline
- Color-coded status badges (Applied, Interview, Offer, Rejected, Withdrawn)
- Inline status updates without opening a modal
- Search by company or role
- Filter by one or more statuses
- Sort by date, company, or status
- Export all data as CSV or JSON
- Stats summary header with totals by status
- Fully keyboard-navigable (Cmd/Ctrl+K to add new application)

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Storage:** Local JSON file (`/data/applications.json`) + PDF files (`/data/resumes/`)
- **Validation:** Zod
- **Forms:** react-hook-form

## Setup

```bash
git clone https://github.com/KrupeshVachhani/job-tracker.git
cd job-tracker
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Optional — Starter Resume:**
Drop your default resume at `/data/resumes/starter.pdf`. Any application submitted without a custom PDF will use this file automatically.

## Folder Structure

```
job-tracker/
├── app/
│   ├── api/
│   │   ├── applications/
│   │   │   ├── route.ts            # GET all, POST new
│   │   │   └── [id]/route.ts       # GET one, PUT, DELETE
│   │   └── resumes/
│   │       ├── upload/route.ts     # POST — upload PDF
│   │       └── [filename]/route.ts # GET — stream PDF
│   ├── layout.tsx
│   └── page.tsx                    # Dashboard
├── components/
│   ├── ApplicationModal.tsx
│   ├── StatusBadge.tsx
│   └── ...
├── lib/
│   ├── storage.ts                  # JSON read/write with atomic writes
│   └── config.ts                   # Constants
├── types/
│   └── application.ts              # TypeScript interfaces
├── data/                           # Git-ignored at runtime
│   ├── .gitkeep
│   ├── applications.json           # Auto-created on first run
│   └── resumes/
│       ├── .gitkeep
│       └── starter.pdf             # Drop your resume here
└── public/
```

## License

MIT © Krupesh Vachhani — see [LICENSE](LICENSE)
