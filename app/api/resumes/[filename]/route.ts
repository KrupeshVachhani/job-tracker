import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const RESUMES_DIR = path.join(process.cwd(), 'data', 'resumes');

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Sanitize: strip any path components, allow only safe filename characters
  const safe = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '');
  if (!safe || !safe.endsWith('.pdf')) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }

  const filePath = path.join(RESUMES_DIR, safe);

  // Confirm the resolved path stays within RESUMES_DIR
  if (!filePath.startsWith(RESUMES_DIR + path.sep) && filePath !== path.join(RESUMES_DIR, safe)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const buf = fs.readFileSync(filePath);
  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${safe}"`,
      'Content-Length': String(buf.length),
    },
  });
}
