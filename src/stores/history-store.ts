import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DailyPlan } from "@/types";

interface HistoryStore {
  plans: DailyPlan[];
  archivePlan: (plan: DailyPlan) => void;
  getPlan: (date: string) => DailyPlan | undefined;
  getAllDates: () => string[];
  removePlan: (date: string) => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      plans: [],

      archivePlan: (plan) => {
        set((s) => ({
          plans: [
            ...s.plans.filter((p) => p.date !== plan.date),
            { ...plan, archivedAt: new Date().toISOString() },
          ],
        }));
      },

      getPlan: (date) => get().plans.find((p) => p.date === date),

      getAllDates: () =>
        get()
          .plans.map((p) => p.date)
          .sort()
          .reverse(),

      removePlan: (date) => {
        set((s) => ({ plans: s.plans.filter((p) => p.date !== date) }));
      },
    }),
    { name: "timebox-history" }
  )
);
