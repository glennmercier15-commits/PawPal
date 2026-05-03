import { create } from 'zustand';
import { loadAllEntries, saveDiaryEntry, deleteEntry as deleteEntryStorage } from '../utils/diaryStorage';

export type DiaryEntryType = 'text' | 'drawing' | 'voice' | 'story';

export interface DiaryEntry {
  id: string;
  type: DiaryEntryType;
  date: number;
  content: string; // text, base64 image data URL, or base64 audio data URL
  mood?: string;
}

interface DiaryState {
  entries: DiaryEntry[];
  isLoaded: boolean;
  loadEntries: () => Promise<void>;
  addEntry: (entry: Omit<DiaryEntry, 'id' | 'date'>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

export const useDiaryStore = create<DiaryState>((setStore, getStore) => ({
  entries: [],
  isLoaded: false,
  loadEntries: async () => {
    try {
      const stored = await loadAllEntries();
      setStore({ entries: stored, isLoaded: true });
    } catch (err) {
      console.error('Failed to load diary entries', err);
      setStore({ isLoaded: true });
    }
  },
  addEntry: async (entry) => {
    const newEntry = await saveDiaryEntry({
      ...entry,
      date: Date.now(),
    });
    setStore({ entries: [newEntry, ...getStore().entries] });
  },
  deleteEntry: async (id) => {
    await deleteEntryStorage(id);
    setStore({ entries: getStore().entries.filter(e => e.id !== id) });
  }
}));

