import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsStore {
  startHour: number;
  endHour: number;
  defaultBlockMinutes: number;
  bufferMinutes: number;
  showCompletedTasks: boolean;
  setStartHour: (h: number) => void;
  setEndHour: (h: number) => void;
  setDefaultBlockMinutes: (m: number) => void;
  setBufferMinutes: (m: number) => void;
  toggleShowCompleted: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      startHour: 6,
      endHour: 24,
      defaultBlockMinutes: 60,
      bufferMinutes: 15,
      showCompletedTasks: true,
      setStartHour: (h) => set({ startHour: h }),
      setEndHour: (h) => set({ endHour: h }),
      setDefaultBlockMinutes: (m) => set({ defaultBlockMinutes: m }),
      setBufferMinutes: (m) => set({ bufferMinutes: m }),
      toggleShowCompleted: () => set((s) => ({ showCompletedTasks: !s.showCompletedTasks })),
    }),
    { name: "timebox-settings" }
  )
);
