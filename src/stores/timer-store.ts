import { create } from "zustand";
import type { TimerSession, TimerState } from "@/types";

interface TimerStore {
  session: TimerSession | null;
  start: (taskId: string, timeBlockId: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => number; // 반환: 총 경과 ms
  reset: () => void;
  getElapsedMs: () => number;
}

export const useTimerStore = create<TimerStore>()((set, get) => ({
  session: null,

  start: (taskId, timeBlockId) => {
    set({
      session: {
        taskId,
        timeBlockId,
        startedAt: Date.now(),
        accumulatedMs: 0,
        state: "running",
      },
    });
  },

  pause: () => {
    const { session } = get();
    if (!session || session.state !== "running") return;
    const elapsed = Date.now() - session.startedAt;
    set({
      session: {
        ...session,
        state: "paused",
        pausedAt: Date.now(),
        accumulatedMs: session.accumulatedMs + elapsed,
      },
    });
  },

  resume: () => {
    const { session } = get();
    if (!session || session.state !== "paused") return;
    set({
      session: {
        ...session,
        state: "running",
        startedAt: Date.now(),
        pausedAt: undefined,
      },
    });
  },

  stop: () => {
    const elapsed = get().getElapsedMs();
    set({ session: null });
    return elapsed;
  },

  reset: () => set({ session: null }),

  getElapsedMs: () => {
    const { session } = get();
    if (!session) return 0;
    if (session.state === "paused") return session.accumulatedMs;
    return session.accumulatedMs + (Date.now() - session.startedAt);
  },
}));
