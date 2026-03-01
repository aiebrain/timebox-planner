export type TimeBlockType = "task" | "buffer" | "rest" | "fixed";

export interface TimeBlock {
  id: string;
  taskId?: string;
  type: TimeBlockType;
  title: string;
  startTime: string;   // "09:00"
  endTime: string;     // "10:30"
  estimatedMinutes: number;
  actualMinutes?: number;
}
