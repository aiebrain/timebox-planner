export type TaskCategory = "work" | "study" | "health" | "personal" | "creative" | "rest";

export type TaskStatus = "pending" | "in-progress" | "completed" | "deferred";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: TaskCategory;
  subtasks: SubTask[];
  isBigThree: boolean;
  bigThreePriority?: 1 | 2 | 3;
  isScheduled: boolean;
  status: TaskStatus;
  createdAt: string;
}
