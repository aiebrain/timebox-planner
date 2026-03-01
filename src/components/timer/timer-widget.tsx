"use client";

import { useTimer } from "@/hooks/use-timer";
import { useTaskStore } from "@/stores/task-store";
import { useTimelineStore } from "@/stores/timeline-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pause, Play, Square, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/time-utils";

export function TimerWidget() {
  const { session, formattedTime, isRunning, isPaused, pause, resume, stop } = useTimer();
  const tasks = useTaskStore((s) => s.tasks);
  const timeBlocks = useTimelineStore((s) => s.timeBlocks);

  if (!session) return null;

  const task = tasks.find((t) => t.id === session.taskId);
  const block = timeBlocks.find((b) => b.id === session.timeBlockId);

  return (
    <Card className={cn(
      "fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50",
      "border-2 shadow-lg",
      isRunning ? "border-green-400 dark:border-green-600" : "border-yellow-400 dark:border-yellow-600"
    )}>
      <div className="flex items-center gap-3 p-3">
        <Timer className={cn("h-5 w-5 shrink-0", isRunning ? "text-green-500 animate-pulse" : "text-yellow-500")} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{task?.title ?? "작업 중"}</p>
          {block && (
            <p className="text-xs text-muted-foreground">
              예상: {formatDuration(block.estimatedMinutes)}
            </p>
          )}
        </div>
        <span className="text-lg font-mono font-bold tabular-nums">{formattedTime}</span>
        <div className="flex items-center gap-1">
          {isRunning ? (
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={pause}>
              <Pause className="h-4 w-4" />
            </Button>
          ) : isPaused ? (
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={resume}>
              <Play className="h-4 w-4" />
            </Button>
          ) : null}
          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={stop}>
            <Square className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
