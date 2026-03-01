import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, TaskStatus } from "@/types";
import { generateId } from "@/lib/time-utils";

interface TaskStore {
  tasks: Task[];
  addTask: (title: string) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleBigThree: (id: string, priority: 1 | 2 | 3) => void;
  removeBigThree: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  reorderTasks: (fromIndex: number, toIndex: number) => void;
  clearAll: () => void;
  getBigThreeTasks: () => Task[];
  getUnscheduledTasks: () => Task[];
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (title: string) => {
        const task: Task = {
          id: generateId(),
          title: title.trim(),
          subtasks: [],
          isBigThree: false,
          isScheduled: false,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ tasks: [...s.tasks, task] }));
      },

      removeTask: (id: string) => {
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
      },

      updateTask: (id: string, updates: Partial<Task>) => {
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      toggleBigThree: (id: string, priority: 1 | 2 | 3) => {
        set((s) => ({
          tasks: s.tasks.map((t) => {
            // 같은 priority를 가진 기존 태스크에서 제거
            if (t.id !== id && t.bigThreePriority === priority) {
              return { ...t, isBigThree: false, bigThreePriority: undefined };
            }
            if (t.id === id) {
              return { ...t, isBigThree: true, bigThreePriority: priority };
            }
            return t;
          }),
        }));
      },

      removeBigThree: (id: string) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, isBigThree: false, bigThreePriority: undefined } : t
          ),
        }));
      },

      setTaskStatus: (id: string, status: TaskStatus) => {
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
        }));
      },

      reorderTasks: (fromIndex: number, toIndex: number) => {
        set((s) => {
          const tasks = [...s.tasks];
          const [moved] = tasks.splice(fromIndex, 1);
          tasks.splice(toIndex, 0, moved);
          return { tasks };
        });
      },

      clearAll: () => set({ tasks: [] }),

      getBigThreeTasks: () => {
        return get()
          .tasks.filter((t) => t.isBigThree)
          .sort((a, b) => (a.bigThreePriority ?? 0) - (b.bigThreePriority ?? 0));
      },

      getUnscheduledTasks: () => {
        return get().tasks.filter((t) => !t.isScheduled);
      },
    }),
    { name: "timebox-tasks" }
  )
);
