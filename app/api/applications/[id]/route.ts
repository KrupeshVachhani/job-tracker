import { NextResponse } from 'next/server';
import { z } from 'zod';
import * as storage from '@/lib/storage';

const updateSchema = z.object({
  company: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  source: z.string().min(1).optional(),
  appliedDate: z.string().min(1).optional(),
  status: z.enum(['Applied', 'Interview', 'Rejected', 'Offer', 'Withdrawn']).optional(),
  resumeFile: z.string().optional(),
  isStarterResume: z.boolean().optional(),
  jobUrl: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const record = await storage.getById(id);
  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(record);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await storage.update(id, parsed.data);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await storage.remove(id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
