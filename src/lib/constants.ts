import type { TaskCategory } from "@/types";

export const CATEGORY_CONFIG: Record<TaskCategory, { label: string; color: string; bgColor: string }> = {
  work: { label: "업무", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  study: { label: "학습", color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
  health: { label: "건강", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" },
  personal: { label: "개인", color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
  creative: { label: "창작", color: "text-pink-600", bgColor: "bg-pink-100 dark:bg-pink-900/30" },
  rest: { label: "휴식", color: "text-teal-600", bgColor: "bg-teal-100 dark:bg-teal-900/30" },
};

export const BIG_THREE_COLORS = {
  1: { label: "1순위", color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-900/20", borderColor: "border-red-400", ring: "ring-red-400" },
  2: { label: "2순위", color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-900/20", borderColor: "border-yellow-400", ring: "ring-yellow-400" },
  3: { label: "3순위", color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/20", borderColor: "border-blue-400", ring: "ring-blue-400" },
} as const;

export const TIMELINE_CONFIG = {
  startHour: 6,
  endHour: 24,
  pixelsPerHour: 80,
  slotMinutes: 15,
  snapMinutes: 15,
} as const;

export const DEFAULT_BUFFER_MINUTES = 15;
export const DEFAULT_REST_MINUTES = 60;
