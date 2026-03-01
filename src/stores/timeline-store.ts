import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TimeBlock, TimeBlockType } from "@/types";
import { generateId, timeToMinutes, minutesToTime, isOverlapping } from "@/lib/time-utils";

interface TimelineStore {
  timeBlocks: TimeBlock[];
  addTimeBlock: (block: Omit<TimeBlock, "id">) => string;
  removeTimeBlock: (id: string) => void;
  updateTimeBlock: (id: string, updates: Partial<TimeBlock>) => void;
  moveTimeBlock: (id: string, newStartTime: string) => void;
  resizeTimeBlock: (id: string, newEndTime: string) => void;
  setActualMinutes: (id: string, minutes: number) => void;
  getBlocksByTime: () => TimeBlock[];
  hasOverlap: (startTime: string, endTime: string, excludeId?: string) => boolean;
  clearAll: () => void;
  scheduleTask: (taskId: string, title: string, startTime: string, durationMinutes: number, type?: TimeBlockType) => string;
}

export const useTimelineStore = create<TimelineStore>()(
  persist(
    (set, get) => ({
      timeBlocks: [],

      addTimeBlock: (block) => {
        const id = generateId();
        set((s) => ({ timeBlocks: [...s.timeBlocks, { ...block, id }] }));
        return id;
      },

      removeTimeBlock: (id: string) => {
        set((s) => ({ timeBlocks: s.timeBlocks.filter((b) => b.id !== id) }));
      },

      updateTimeBlock: (id: string, updates: Partial<TimeBlock>) => {
        set((s) => ({
          timeBlocks: s.timeBlocks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        }));
      },

      moveTimeBlock: (id: string, newStartTime: string) => {
        set((s) => ({
          timeBlocks: s.timeBlocks.map((b) => {
            if (b.id !== id) return b;
            const duration = timeToMinutes(b.endTime) - timeToMinutes(b.startTime);
            const newEnd = minutesToTime(timeToMinutes(newStartTime) + duration);
            return { ...b, startTime: newStartTime, endTime: newEnd };
          }),
        }));
      },

      resizeTimeBlock: (id: string, newEndTime: string) => {
        set((s) => ({
          timeBlocks: s.timeBlocks.map((b) => {
            if (b.id !== id) return b;
            const newDuration = timeToMinutes(newEndTime) - timeToMinutes(b.startTime);
            return { ...b, endTime: newEndTime, estimatedMinutes: Math.max(15, newDuration) };
          }),
        }));
      },

      setActualMinutes: (id: string, minutes: number) => {
        set((s) => ({
          timeBlocks: s.timeBlocks.map((b) => (b.id === id ? { ...b, actualMinutes: minutes } : b)),
        }));
      },

      getBlocksByTime: () => {
        return [...get().timeBlocks].sort(
          (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
        );
      },

      hasOverlap: (startTime, endTime, excludeId) => {
        return get().timeBlocks.some(
          (b) => b.id !== excludeId && isOverlapping(startTime, endTime, b.startTime, b.endTime)
        );
      },

      clearAll: () => set({ timeBlocks: [] }),

      scheduleTask: (taskId, title, startTime, durationMinutes, type = "task") => {
        const id = generateId();
        const endTime = minutesToTime(timeToMinutes(startTime) + durationMinutes);
        const block: TimeBlock = {
          id,
          taskId,
          type,
          title,
          startTime,
          endTime,
          estimatedMinutes: durationMinutes,
        };
        set((s) => ({ timeBlocks: [...s.timeBlocks, block] }));
        return id;
      },
    }),
    { name: "timebox-timeline" }
  )
);
