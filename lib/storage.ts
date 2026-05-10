import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { Application } from '@/types/application';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'applications.json');

let writeLock: Promise<void> = Promise.resolve();

function readRaw(): Application[] {
  if (!fs.existsSync(DB_FILE)) return [];
  const raw = fs.readFileSync(DB_FILE, 'utf-8').trim();
  if (!raw) return [];
  return JSON.parse(raw) as Application[];
}

function writeRaw(data: Application[]): void {
  const tmp = `${DB_FILE}.${Date.now()}.tmp`;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmp, DB_FILE);
}

function withLock<T>(fn: () => T): Promise<T> {
  const next = writeLock.then(() => fn());
  writeLock = next.then(
    () => {},
    () => {}
  );
  return next;
}

export async function getAll(): Promise<Application[]> {
  return withLock(() => readRaw());
}

export async function getById(id: string): Promise<Application | undefined> {
  return withLock(() => readRaw().find((a) => a.id === id));
}

export async function create(
  data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Application> {
  return withLock(() => {
    const all = readRaw();
    const now = new Date().toISOString();
    const record: Application = {
      ...data,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    writeRaw([...all, record]);
    return record;
  });
}

export async function update(
  id: string,
  data: Partial<Omit<Application, 'id' | 'createdAt'>>
): Promise<Application | null> {
  return withLock(() => {
    const all = readRaw();
    const idx = all.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    const updated: Application = {
      ...all[idx],
      ...data,
      id,
      createdAt: all[idx].createdAt,
      updatedAt: new Date().toISOString(),
    };
    all[idx] = updated;
    writeRaw(all);
    return updated;
  });
}

export async function remove(id: string): Promise<boolean> {
  return withLock(() => {
    const all = readRaw();
    const next = all.filter((a) => a.id !== id);
    if (next.length === all.length) return false;
    writeRaw(next);
    return true;
  });
}
