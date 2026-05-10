import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const RESUMES_DIR = path.join(process.cwd(), 'data', 'resumes');
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46]); // %PDF

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buf = Buffer.from(bytes);

  if (!buf.slice(0, 4).equals(PDF_MAGIC)) {
    return NextResponse.json({ error: 'File is not a valid PDF' }, { status: 400 });
  }

  fs.mkdirSync(RESUMES_DIR, { recursive: true });
  const filename = `${randomUUID()}.pdf`;
  fs.writeFileSync(path.join(RESUMES_DIR, filename), buf);

  return NextResponse.json({ filename }, { status: 201 });
}
