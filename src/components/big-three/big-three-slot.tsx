"use client";

import { useTaskStore } from "@/stores/task-store";
import { BIG_THREE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import type { Task } from "@/types";

interface BigThreeSlotProps {
  priority: 1 | 2 | 3;
  task?: Task;
}

export function BigThreeSlot({ priority, task }: BigThreeSlotProps) {
  const removeBigThree = useTaskStore((s) => s.removeBigThree);
  const config = BIG_THREE_COLORS[priority];

  const { isOver, setNodeRef } = useDroppable({
    id: `big-three-slot-${priority}`,
    data: { type: "big-three-slot", priority },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex items-center gap-3 rounded-lg border-2 border-dashed px-4 py-3 transition-all min-h-[52px]",
        task ? `${config.bgColor} ${config.borderColor} border-solid` : "border-muted-foreground/20",
        isOver && "ring-2 scale-[1.02]",
        isOver && config.ring
      )}
    >
      <span className={cn("text-lg font-bold tabular-nums", config.color)}>
        {priority}
      </span>

      {task ? (
        <>
          <span className="flex-1 text-sm font-medium">{task.title}</span>
          <button
            onClick={() => removeBigThree(task.id)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </>
      ) : (
        <span className="flex-1 text-sm text-muted-foreground">
          할 일을 여기에 드래그하거나 클릭하세요
        </span>
      )}
    </div>
  );
}
