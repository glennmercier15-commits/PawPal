import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AchievementStats {
  totalFeeds: number;
  streak: number;
  totalPurchases: number;
  gamesPlayed: number;
  diaryEntries: number;
  hadPerfectStats: boolean;
  level: number;
}

export interface PetState {
  petType: string | null;
  name: string;
  hunger: number;
  happy: number;
  energy: number;
  clean: number;
  coins: number;
  isSleeping: boolean;
  createdAt: number;
  lastUpdated: number;
  ownedItems: string[];
  equippedItems: Record<string, string>;
  achievementStats: AchievementStats;
  setPetType: (type: string) => void;
  setName: (name: string) => void;
  feed: () => void;
  play: () => void;
  sleep: () => void;
  cleanPet: () => void;
  decayStats: () => void;
  applyOfflineDecay: () => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => void;
  addOwnedItem: (id: string, category?: string) => void;
  equipItem: (id: string, category: string) => void;
  unequipItem: (category: string) => void;
  incGamesPlayed: () => void;
  incDiaryEntries: () => void;
  updateStreak: () => void;
}

export const usePetStore = create<PetState>()(
  persist(
    (set) => ({
      petType: null,
      name: '',
      hunger: 50,
      happy: 50,
      energy: 50,
      clean: 50,
      coins: 100,
      isSleeping: false,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      ownedItems: [],
      equippedItems: {},
      achievementStats: {
        totalFeeds: 0,
        streak: 1,
        totalPurchases: 0,
        gamesPlayed: 0,
        diaryEntries: 0,
        hadPerfectStats: false,
        level: 3,
      },
      setPetType: (type) => set({ petType: type }),
      setName: (name) => set({ name }),
      feed: () => set((state) => {
        const newHunger = Math.min(100, state.hunger + 15);
        const newCoins = state.coins + 5;
        const newLevel = Math.floor(newCoins / 50) + 1;
        const isPerfect = newHunger === 100 && state.happy === 100 && state.energy === 100 && state.clean === 100;
        return { 
          hunger: newHunger, 
          coins: newCoins, 
          lastUpdated: Date.now(),
          achievementStats: {
            ...state.achievementStats,
            totalFeeds: state.achievementStats.totalFeeds + 1,
            level: newLevel,
            hadPerfectStats: state.achievementStats.hadPerfectStats || isPerfect,
          }
        };
      }),
      play: () => set((state) => {
        const newHappy = Math.min(100, state.happy + 20);
        const newEnergy = Math.max(0, state.energy - 10);
        const newHunger = Math.max(0, state.hunger - 5);
        const newCoins = state.coins + 10;
        const newLevel = Math.floor(newCoins / 50) + 1;
        const isPerfect = newHunger === 100 && newHappy === 100 && newEnergy === 100 && state.clean === 100;
        return { 
          happy: newHappy, 
          energy: newEnergy, 
          hunger: newHunger, 
          coins: newCoins, 
          lastUpdated: Date.now(),
          achievementStats: {
            ...state.achievementStats,
            level: newLevel,
            hadPerfectStats: state.achievementStats.hadPerfectStats || isPerfect,
          }
        };
      }),
      sleep: () => set((state) => {
        const newlySleeping = !state.isSleeping;
        return { 
          isSleeping: newlySleeping, 
          energy: newlySleeping ? state.energy : Math.min(100, state.energy + 30),
          lastUpdated: Date.now()
        };
      }),
      cleanPet: () => set((state) => {
        const newClean = Math.min(100, state.clean + 20);
        const newHappy = Math.min(100, state.happy + 5);
        const isPerfect = state.hunger === 100 && newHappy === 100 && state.energy === 100 && newClean === 100;
        return { 
          clean: newClean, 
          happy: newHappy, 
          lastUpdated: Date.now(),
          achievementStats: {
            ...state.achievementStats,
            hadPerfectStats: state.achievementStats.hadPerfectStats || isPerfect,
          }
        };
      }),
      decayStats: () => set((state) => ({
        hunger: Math.max(0, state.hunger - 2),
        happy: Math.max(0, state.happy - 1),
        energy: state.isSleeping ? Math.min(100, state.energy + 5) : Math.max(0, state.energy - 1),
        clean: Math.max(0, state.clean - 1),
        lastUpdated: Date.now()
      })),
      applyOfflineDecay: () => set((state) => {
        const now = Date.now();
        const hoursElapsed = (now - state.lastUpdated) / (1000 * 60 * 60);
        const decayRate = 5; // points per hour
        const decay = Math.floor(hoursElapsed * decayRate);
        if (decay <= 0) return {};

        return {
          hunger: Math.max(0, state.hunger - decay),
          happy: Math.max(0, state.happy - decay * 0.8),
          energy: Math.max(0, state.energy - decay * 0.6),
          clean: Math.max(0, state.clean - decay * 0.4),
          lastUpdated: now
        };
      }),
      addCoins: (amount) => set((state) => {
        const newCoins = state.coins + amount;
        return { 
          coins: newCoins,
          achievementStats: {
            ...state.achievementStats,
            level: Math.floor(newCoins / 50) + 1,
          }
        };
      }),
      spendCoins: (amount) => set((state) => ({ coins: Math.max(0, state.coins - amount) })),
      addOwnedItem: (id) => set((state) => ({ 
        ownedItems: [...state.ownedItems, id],
        achievementStats: {
          ...state.achievementStats,
          totalPurchases: state.achievementStats.totalPurchases + 1,
        }
      })),
      equipItem: (id, category) => set((state) => ({ 
        equippedItems: { ...state.equippedItems, [category]: id } 
      })),
      unequipItem: (category) => set((state) => {
        const newEquippedItems = { ...state.equippedItems };
        delete newEquippedItems[category];
        return { equippedItems: newEquippedItems };
      }),
      incGamesPlayed: () => set((state) => ({
        achievementStats: { ...state.achievementStats, gamesPlayed: state.achievementStats.gamesPlayed + 1 }
      })),
      incDiaryEntries: () => set((state) => ({
        achievementStats: { ...state.achievementStats, diaryEntries: state.achievementStats.diaryEntries + 1 }
      })),
      updateStreak: () => set((state) => ({
        achievementStats: { ...state.achievementStats, streak: state.achievementStats.streak + 1 }
      })),
    }),
    {
      name: 'pawpal-storage',
    }
  )
);
