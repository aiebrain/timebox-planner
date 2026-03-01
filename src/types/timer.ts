export type TimerState = "idle" | "running" | "paused";

export interface TimerSession {
  taskId: string;
  timeBlockId: string;
  startedAt: number;      // Date.now() timestamp
  pausedAt?: number;
  accumulatedMs: number;  // 일시정지 포함 누적 시간
  state: TimerState;
}
