"use client";

import { useState } from "react";
import { BrainDumpList } from "@/components/brain-dump/brain-dump-list";
import { BigThreePanel } from "@/components/big-three/big-three-panel";
import { TimelineView, useTimelineDnd } from "@/components/timeline/timeline-view";
import { ScheduleDialog } from "@/components/timeline/schedule-dialog";
import { TimerWidget } from "@/components/timer/timer-widget";
import { DailyReview } from "@/components/review/daily-review";
import { StepIndicator } from "@/components/shared/step-indicator";
import { useTaskStore } from "@/stores/task-store";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";
import { BIG_THREE_COLORS, CATEGORY_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
} from "@dnd-kit/core";
import type { Task } from "@/types";

/** 사이드바 드래그 가능한 태스크 카드 */
function DraggableTaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `braindump-${task.id}`,
    data: { type: "braindump-task", task: { id: task.id, title: task.title } },
  });

  const bigThreeConfig = task.bigThreePriority ? BIG_THREE_COLORS[task.bigThreePriority] : null;

  const style: React.CSSProperties = {
    ...(transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : {}),
    ...(isDragging ? { opacity: 0.4, zIndex: 100 } : {}),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors bg-card hover:bg-accent/50",
        bigThreeConfig && `${bigThreeConfig.bgColor} ${bigThreeConfig.borderColor}`,
        isDragging && "shadow-lg ring-2 ring-primary/40"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <button onClick={onClick} className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-1.5">
          {task.bigThreePriority && (
            <span className={cn("text-xs font-bold", bigThreeConfig?.color)}>
              #{task.bigThreePriority}
            </span>
          )}
          <span className="truncate">{task.title}</span>
        </div>
      </button>
      {task.category && (
        <Badge variant="secondary" className={cn("text-xs shrink-0", CATEGORY_CONFIG[task.category].color)}>
          {CATEGORY_CONFIG[task.category].label}
        </Badge>
      )}
    </div>
  );
}

/** Step 3: 공유 DndContext로 사이드바 + 타임라인 통합 */
function TimelineStep({ onScheduleClick }: { onScheduleClick: (task: Task) => void }) {
  const tasks = useTaskStore((s) => s.tasks);
  const [activeDragTask, setActiveDragTask] = useState<{ id: string; title: string } | null>(null);

  const timelineDnd = useTimelineDnd();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const unscheduledTasks = tasks.filter((t) => !t.isScheduled && t.status !== "completed");

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(event) => {
        const data = event.active.data.current;
        if (data?.type === "braindump-task") {
          setActiveDragTask(data.task as { id: string; title: string });
        }
      }}
      onDragOver={timelineDnd.handleDragOver}
      onDragEnd={(event) => {
        setActiveDragTask(null);
        timelineDnd.handleDragEnd(event);
      }}
      onDragCancel={() => setActiveDragTask(null)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* 미배치 태스크 목록 (드래그 가능) */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground px-1">
            배치할 태스크
            <span className="ml-1 text-xs">({unscheduledTasks.length})</span>
          </h3>
          <p className="text-[11px] text-muted-foreground/70 px-1">
            드래그하여 타임라인에 배치하거나, 클릭하여 시간 지정
          </p>
          {unscheduledTasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onClick={() => onScheduleClick(task)}
            />
          ))}
          {unscheduledTasks.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              모든 태스크가 배치되었습니다 ✅
            </p>
          )}
        </div>

        {/* 타임라인 (외부 DndContext 사용) */}
        <TimelineView
          externalDnd
          dndProps={{
            containerRef: timelineDnd.containerRef,
            isDropTarget: timelineDnd.isDropTarget,
            hours: timelineDnd.hours,
            totalHeight: timelineDnd.totalHeight,
            handleDoubleClick: timelineDnd.handleDoubleClick,
          }}
        />
      </div>

      {/* DragOverlay: 드래그 중 시각적 피드백 */}
      <DragOverlay dropAnimation={null}>
        {activeDragTask && (
          <div className="rounded-lg border border-primary/50 bg-primary/10 backdrop-blur-sm px-3 py-2 text-sm font-medium shadow-xl max-w-[200px]">
            <span className="truncate block">{activeDragTask.title}</span>
            <span className="text-[10px] text-muted-foreground">타임라인에 놓으세요</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default function TodayPage() {
  const [step, setStep] = useState(1);
  const [scheduleTask, setScheduleTask] = useState<Task | null>(null);

  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-6xl mx-auto">
      {/* 스텝 인디케이터 */}
      <StepIndicator currentStep={step} onStepChange={setStep} />

      {/* 스텝 1+2: 브레인 덤프 + 빅3 (나란히 표시) */}
      {(step === 1 || step === 2) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BrainDumpList />
          <BigThreePanel />
        </div>
      )}

      {/* 스텝 3: 타임라인 (공유 DndContext) */}
      {step === 3 && (
        <TimelineStep onScheduleClick={(task) => setScheduleTask(task)} />
      )}

      {/* 스텝 4: 리뷰 */}
      {step === 4 && (
        <div className="max-w-lg mx-auto">
          <DailyReview />
        </div>
      )}

      {/* 플로팅 타이머 */}
      <TimerWidget />

      {/* 스케줄 다이얼로그 */}
      <ScheduleDialog
        task={scheduleTask}
        open={scheduleTask !== null}
        onOpenChange={(open) => { if (!open) setScheduleTask(null); }}
      />
    </div>
  );
}
