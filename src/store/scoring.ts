import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';
import type { Arrow, BlasonType, Discipline, Session, SessionStats } from '@/types/scoring';

interface ScoringState {
  currentSession: Session | null;
  sessions: Session[];
  startSession: (config: {
    discipline: Discipline;
    blason: BlasonType;
    distance: number;
    arrowsPerVolley: number;
    totalVolleys: number;
  }) => void;
  addArrow: (x: number, y: number) => void;
  removeLastArrow: () => void;
  cancelSession: () => void;
  endSession: () => void;
  getStats: () => SessionStats | null;
}

function scoreFromPosition(x: number, y: number): { score: number; isX: boolean } {
  const dist = Math.sqrt(x * x + y * y);
  if (dist <= 0.05) return { score: 10, isX: true };
  if (dist <= 0.10) return { score: 10, isX: false };
  if (dist <= 0.20) return { score: 9, isX: false };
  if (dist <= 0.30) return { score: 8, isX: false };
  if (dist <= 0.40) return { score: 7, isX: false };
  if (dist <= 0.50) return { score: 6, isX: false };
  if (dist <= 0.60) return { score: 5, isX: false };
  if (dist <= 0.70) return { score: 4, isX: false };
  if (dist <= 0.80) return { score: 3, isX: false };
  if (dist <= 0.90) return { score: 2, isX: false };
  if (dist <= 1.00) return { score: 1, isX: false };
  return { score: 0, isX: false };
}

export const useScoringStore = create<ScoringState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      sessions: [],

      startSession: (config) => {
        const session: Session = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          ...config,
          arrows: [],
        };
        set({ currentSession: session });
      },

      addArrow: (x, y) => {
        const { currentSession } = get();
        if (!currentSession) return;

        const totalArrows = currentSession.arrowsPerVolley * currentSession.totalVolleys;
        if (currentSession.arrows.length >= totalArrows) return;

        const currentVolley = Math.floor(currentSession.arrows.length / currentSession.arrowsPerVolley) + 1;
        const { score, isX } = scoreFromPosition(x, y);

        const arrow: Arrow = {
          id: Date.now().toString(),
          x,
          y,
          score,
          isX,
          volley: currentVolley,
        };

        set({
          currentSession: {
            ...currentSession,
            arrows: [...currentSession.arrows, arrow],
          },
        });
      },

      removeLastArrow: () => {
        const { currentSession } = get();
        if (!currentSession || currentSession.arrows.length === 0) return;
        set({
          currentSession: {
            ...currentSession,
            arrows: currentSession.arrows.slice(0, -1),
          },
        });
      },

      cancelSession: () => {
        set({ currentSession: null });
      },

      endSession: () => {
        const { currentSession, sessions } = get();
        if (!currentSession) return;
        set({
          sessions: [...sessions, currentSession],
          currentSession: null,
        });
      },

      getStats: () => {
        const { currentSession } = get();
        if (!currentSession) return null;

        const arrows = currentSession.arrows;
        const totalScore = arrows.reduce((sum, a) => sum + a.score, 0);
        const maxScore = currentSession.arrowsPerVolley * currentSession.totalVolleys * 10;

        return {
          totalScore,
          maxScore,
          average: arrows.length > 0 ? totalScore / arrows.length : 0,
          xCount: arrows.filter((a) => a.isX).length,
          tenCount: arrows.filter((a) => a.score === 10).length,
          arrowCount: arrows.length,
        };
      },
    }),
    {
      name: 'claude-arc-scoring',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({ sessions: state.sessions }),
    }
  )
);
