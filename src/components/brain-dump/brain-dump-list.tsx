"use client";

import { useTaskStore } from "@/stores/task-store";
import { BrainDumpInput } from "./brain-dump-input";
import { BrainDumpItem } from "./brain-dump-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types";

function SortableItem({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <BrainDumpItem task={task} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}

export function BrainDumpList() {
  const tasks = useTaskStore((s) => s.tasks);
  const reorderTasks = useTaskStore((s) => s.reorderTasks);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = tasks.findIndex((t) => t.id === active.id);
    const toIndex = tasks.findIndex((t) => t.id === over.id);
    if (fromIndex !== -1 && toIndex !== -1) {
      reorderTasks(fromIndex, toIndex);
    }
  };

  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Brain className="h-4 w-4" />
          브레인 덤프
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          머릿속 할 일을 전부 쏟아내세요 — 정리는 나중에!
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <BrainDumpInput />
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={pendingTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-1.5">
              {pendingTasks.map((task) => (
                <SortableItem key={task.id} task={task} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        {completedTasks.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t">
            <p className="text-xs text-muted-foreground">완료됨 ({completedTasks.length})</p>
            {completedTasks.map((task) => (
              <BrainDumpItem key={task.id} task={task} />
            ))}
          </div>
        )}
        {tasks.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            아직 할 일이 없습니다. 위에서 추가해보세요!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
