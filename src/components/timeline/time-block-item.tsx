"use client";

import { useTimelineStore } from "@/stores/timeline-store";
import { useTaskStore } from "@/stores/task-store";
import { timeToPixels, minutesToPixels, formatDuration, timeToMinutes } from "@/lib/time-utils";
import { BIG_THREE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { X, GripVertical, Play } from "lucide-react";
import type { TimeBlock } from "@/types";

interface TimeBlockItemProps {
  block: TimeBlock;
  onStartTimer?: (block: TimeBlock) => void;
}

const BLOCK_COLORS: Record<string, string> = {
  task: "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700",
  buffer: "bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700",
  rest: "bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700",
  fixed: "bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700",
};

export function TimeBlockItem({ block, onStartTimer }: TimeBlockItemProps) {
  const removeTimeBlock = useTimelineStore((s) => s.removeTimeBlock);
  const tasks = useTaskStore((s) => s.tasks);

  const top = timeToPixels(block.startTime);
  const height = minutesToPixels(timeToMinutes(block.endTime) - timeToMinutes(block.startTime));
  const task = block.taskId ? tasks.find((t) => t.id === block.taskId) : null;
  const bigThreeConfig = task?.bigThreePriority ? BIG_THREE_COLORS[task.bigThreePriority] : null;

  const colorClass = bigThreeConfig
    ? `${bigThreeConfig.bgColor} ${bigThreeConfig.borderColor}`
    : BLOCK_COLORS[block.type] || BLOCK_COLORS.task;

  return (
    <div
      className={cn(
        "absolute left-16 right-2 rounded-lg border px-3 py-1.5 group cursor-pointer transition-shadow hover:shadow-md overflow-hidden",
        colorClass
      )}
      style={{ top, height: Math.max(height, 30) }}
    >
      <div className="flex items-start justify-between h-full">
        <div className="flex items-start gap-1.5 min-w-0 flex-1">
          <GripVertical className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground/40 cursor-grab" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              {task?.bigThreePriority && (
                <span className={cn("text-xs font-bold", bigThreeConfig?.color)}>
                  #{task.bigThreePriority}
                </span>
              )}
              <p className="text-sm font-medium truncate">{block.title}</p>
            </div>
            {height > 40 && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {block.startTime}–{block.endTime} ({formatDuration(block.estimatedMinutes)})
                {block.actualMinutes != null && (
                  <span className="ml-1">/ 실제 {formatDuration(block.actualMinutes)}</span>
                )}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {block.type === "task" && onStartTimer && (
            <button
              onClick={(e) => { e.stopPropagation(); onStartTimer(block); }}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
            >
              <Play className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); removeTimeBlock(block.id); }}
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
