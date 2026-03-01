import type { Task } from "./task";
import type { TimeBlock } from "./time-block";

export interface DailyReview {
  totalPlannedMinutes: number;
  totalActualMinutes: number;
  tasksCompleted: number;
  bigThreeCompleted: number;
  estimationAccuracy: number;
  reflection?: string;
}

export interface DailyPlan {
  date: string;           // "2026-03-01"
  tasks: Task[];
  timeBlocks: TimeBlock[];
  review?: DailyReview;
  archivedAt?: string;
}
