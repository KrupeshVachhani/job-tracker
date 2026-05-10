import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as storage from '@/lib/storage';
import { STARTER_RESUME } from '@/lib/config';

const createSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  source: z.string().min(1),
  appliedDate: z.string().min(1),
  status: z.enum(['Applied', 'Interview', 'Rejected', 'Offer', 'Withdrawn']),
  resumeFile: z.string().optional(),
  jobUrl: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET() {
  const all = await storage.getAll();
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const resumeFile = parsed.data.resumeFile || STARTER_RESUME;
  const isStarterResume = !parsed.data.resumeFile;

  const record = await storage.create({
    ...parsed.data,
    resumeFile,
    isStarterResume,
    jobUrl: parsed.data.jobUrl,
    notes: parsed.data.notes,
  });

  return NextResponse.json(record, { status: 201 });
}
