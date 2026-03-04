"use client";

import { useTaskStore } from "@/stores/task-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, GripVertical, Check } from "lucide-react";
import { BIG_THREE_COLORS, CATEGORY_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

interface BrainDumpItemProps {
  task: Task;
  /** SortableItem에서 전달받는 드래그 핸들 props (useSortable의 attributes + listeners) */
  dragHandleProps?: Record<string, unknown>;
}

export function BrainDumpItem({ task, dragHandleProps }: BrainDumpItemProps) {
  const { removeTask, setTaskStatus } = useTaskStore();
  const isCompleted = task.status === "completed";
  const bigThreeConfig = task.bigThreePriority ? BIG_THREE_COLORS[task.bigThreePriority] : null;

  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors",
        isCompleted && "opacity-50",
        bigThreeConfig && `${bigThreeConfig.bgColor} ${bigThreeConfig.borderColor}`,
        !bigThreeConfig && "bg-card hover:bg-accent/50",
      )}
    >
      {dragHandleProps && (
        <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground">
          <GripVertical className="h-4 w-4" />
        </div>
      )}

      <button
        onClick={() => setTaskStatus(task.id, isCompleted ? "pending" : "completed")}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          isCompleted ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
        )}
      >
        {isCompleted && <Check className="h-3 w-3" />}
      </button>

      <span className={cn("flex-1 text-sm", isCompleted && "line-through text-muted-foreground")}>
        {task.title}
      </span>

      {task.category && (
        <Badge variant="secondary" className={cn("text-xs", CATEGORY_CONFIG[task.category].color)}>
          {CATEGORY_CONFIG[task.category].label}
        </Badge>
      )}

      {task.bigThreePriority && (
        <Badge variant="outline" className={cn("text-xs font-bold", bigThreeConfig?.color)}>
          {task.bigThreePriority}
        </Badge>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => removeTask(task.id)}
      >
        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
    </div>
  );
}
