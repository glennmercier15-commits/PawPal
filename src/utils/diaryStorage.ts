import { get, set } from 'idb-keyval';
import { DiaryEntry } from '../store/useDiaryStore';

const STORE_KEY = 'pawpal-diary-v2';

export async function ensureDiaryDir() {
  // No explicit directory creation needed for IndexedDB, 
  // but keeping the function signature for architectural parity.
}

export async function saveDiaryEntry(entry: Omit<DiaryEntry, 'id'>): Promise<DiaryEntry> {
  const newEntry: DiaryEntry = {
    ...entry,
    id: `entry_${Date.now()}_${crypto.randomUUID()}`,
  };
  
  const stored = await get<DiaryEntry[]>(STORE_KEY) || [];
  const updated = [newEntry, ...stored];
  await set(STORE_KEY, updated);
  
  return newEntry;
}

export async function loadAllEntries(): Promise<DiaryEntry[]> {
  const stored = await get<DiaryEntry[]>(STORE_KEY) || [];
  return stored.sort((a, b) => b.date - a.date);
}

export async function deleteEntry(id: string): Promise<void> {
  const stored = await get<DiaryEntry[]>(STORE_KEY) || [];
  const updated = stored.filter(e => e.id !== id);
  await set(STORE_KEY, updated);
}
