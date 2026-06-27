import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';
import type { BowSetup, ArrowSet, EquipmentSettings } from '@/types/equipment';

interface EquipmentState {
  bows: BowSetup[];
  arrowSets: ArrowSet[];
  settings: EquipmentSettings[];
  addBow: (bow: Omit<BowSetup, 'id' | 'createdAt'>) => void;
  updateBow: (id: string, data: Partial<BowSetup>) => void;
  removeBow: (id: string) => void;
  addArrowSet: (arrows: Omit<ArrowSet, 'id' | 'createdAt'>) => void;
  updateArrowSet: (id: string, data: Partial<ArrowSet>) => void;
  removeArrowSet: (id: string) => void;
  addSettings: (s: Omit<EquipmentSettings, 'id'>) => void;
}

export const useEquipmentStore = create<EquipmentState>()(
  persist(
    (set) => ({
      bows: [],
      arrowSets: [],
      settings: [],

      addBow: (bow) => set((s) => ({
        bows: [...s.bows, { ...bow, id: Date.now().toString(), createdAt: new Date().toISOString() }],
      })),
      updateBow: (id, data) => set((s) => ({
        bows: s.bows.map((b) => (b.id === id ? { ...b, ...data } : b)),
      })),
      removeBow: (id) => set((s) => ({
        bows: s.bows.filter((b) => b.id !== id),
      })),

      addArrowSet: (arrows) => set((s) => ({
        arrowSets: [...s.arrowSets, { ...arrows, id: Date.now().toString(), createdAt: new Date().toISOString() }],
      })),
      updateArrowSet: (id, data) => set((s) => ({
        arrowSets: s.arrowSets.map((a) => (a.id === id ? { ...a, ...data } : a)),
      })),
      removeArrowSet: (id) => set((s) => ({
        arrowSets: s.arrowSets.filter((a) => a.id !== id),
      })),

      addSettings: (settings) => set((s) => ({
        settings: [...s.settings, { ...settings, id: Date.now().toString() }],
      })),
    }),
    {
      name: 'claude-arc-equipment',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
