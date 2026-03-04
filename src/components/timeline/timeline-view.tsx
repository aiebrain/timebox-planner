"use client";

import { useRef, useCallback, useState } from "react";
import { useTimelineStore } from "@/stores/timeline-store";
import { useTaskStore } from "@/stores/task-store";
import { useTimerStore } from "@/stores/timer-store";
import { TIMELINE_CONFIG } from "@/lib/constants";
import { pixelsToSnappedTime, timeToMinutes, minutesToTime, timeToPixels } from "@/lib/time-utils";
import { TimeBlockItem } from "./time-block-item";
import { CurrentTimeIndicator } from "./current-time-indicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import type { TimeBlock } from "@/types";

export function TimelineDropArea({
  containerRef,
  totalHeight,
  hours,
  timeBlocks,
  isDropTarget,
  onDoubleClick,
  onStartTimer,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  totalHeight: number;
  hours: number[];
  timeBlocks: TimeBlock[];
  isDropTarget: boolean;
  onDoubleClick: (e: React.MouseEvent) => void;
  onStartTimer: (block: TimeBlock) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "timeline-drop-zone" });

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className="relative"
      style={{ height: totalHeight }}
      onDoubleClick={onDoubleClick}
    >
      {/* 드롭 오버레이 */}
      {(isOver || isDropTarget) && (
        <div className="absolute inset-0 bg-primary/5 border-2 border-dashed border-primary/30 rounded-lg z-10 pointer-events-none" />
      )}

      {/* 시간 눈금 */}
      {hours.map((hour) => (
        <div
          key={hour}
          className="absolute left-0 right-0 border-t border-dashed border-muted-foreground/15"
          style={{ top: (hour - TIMELINE_CONFIG.startHour) * TIMELINE_CONFIG.pixelsPerHour }}
        >
          <span className="absolute -top-2.5 left-2 text-[11px] text-muted-foreground tabular-nums">
            {String(hour).padStart(2, "0")}:00
          </span>
        </div>
      ))}

      {/* 시간 블록들 */}
      {timeBlocks.map((block) => (
        <TimeBlockItem key={block.id} block={block} onStartTimer={onStartTimer} />
      ))}

      {/* 현재 시각 표시 */}
      <CurrentTimeIndicator />
    </div>
  );
}

/** Timeline 내부 DnD 핸들링 로직 (공유 DndContext에서 사용) */
export function useTimelineDnd() {
  const moveTimeBlock = useTimelineStore((s) => s.moveTimeBlock);
  const scheduleTask = useTimelineStore((s) => s.scheduleTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const addTimeBlock = useTimelineStore((s) => s.addTimeBlock);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDropTarget, setIsDropTarget] = useState(false);

  const hours = Array.from(
    { length: TIMELINE_CONFIG.endHour - TIMELINE_CONFIG.startHour },
    (_, i) => TIMELINE_CONFIG.startHour + i
  );
  const totalHeight = hours.length * TIMELINE_CONFIG.pixelsPerHour;

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const y = e.clientY - rect.top + (containerRef.current?.parentElement?.scrollTop ?? 0);
      const startTime = pixelsToSnappedTime(y);
      const endMinutes = timeToMinutes(startTime) + 60;
      const endTime = minutesToTime(Math.min(endMinutes, TIMELINE_CONFIG.endHour * 60));

      addTimeBlock({
        type: "task",
        title: "새 블록",
        startTime,
        endTime,
        estimatedMinutes: timeToMinutes(endTime) - timeToMinutes(startTime),
      });
    },
    [addTimeBlock]
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active } = event;
    const data = active.data.current;
    if (data?.type === "braindump-task") {
      setIsDropTarget(true);
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setIsDropTarget(false);
      const { active, delta, over } = event;
      const data = active.data.current;

      if (data?.type === "timeblock") {
        const block = data.block as TimeBlock;
        const currentTop = timeToPixels(block.startTime);
        const newTop = currentTop + delta.y;
        const clampedTop = Math.max(0, Math.min(newTop, totalHeight - 30));
        const newStartTime = pixelsToSnappedTime(clampedTop);

        const duration = timeToMinutes(block.endTime) - timeToMinutes(block.startTime);
        const newStartMinutes = timeToMinutes(newStartTime);
        const newEndMinutes = newStartMinutes + duration;

        if (newEndMinutes <= TIMELINE_CONFIG.endHour * 60 && newStartMinutes >= TIMELINE_CONFIG.startHour * 60) {
          moveTimeBlock(block.id, newStartTime);
        }
      } else if (data?.type === "braindump-task" && over?.id === "timeline-drop-zone") {
        const task = data.task as { id: string; title: string };
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const activatorEvent = event.activatorEvent as PointerEvent;
        const pointerY = activatorEvent.clientY + delta.y - rect.top + (containerRef.current?.parentElement?.scrollTop ?? 0);
        const startTime = pixelsToSnappedTime(Math.max(0, pointerY));
        const durationMinutes = 60;
        const startMinutes = timeToMinutes(startTime);
        const endMinutes = Math.min(startMinutes + durationMinutes, TIMELINE_CONFIG.endHour * 60);

        if (startMinutes >= TIMELINE_CONFIG.startHour * 60) {
          scheduleTask(task.id, task.title, startTime, endMinutes - startMinutes);
          updateTask(task.id, { isScheduled: true });
        }
      }
    },
    [moveTimeBlock, scheduleTask, updateTask, totalHeight]
  );

  return {
    containerRef,
    isDropTarget,
    hours,
    totalHeight,
    handleDoubleClick,
    handleDragOver,
    handleDragEnd,
  };
}

interface TimelineViewProps {
  /** true면 자체 DndContext를 생성하지 않음 (외부에서 DndContext 감싸야 함) */
  externalDnd?: boolean;
  /** 외부 DndContext 사용 시 필요한 props */
  dndProps?: {
    containerRef: React.RefObject<HTMLDivElement | null>;
    isDropTarget: boolean;
    hours: number[];
    totalHeight: number;
    handleDoubleClick: (e: React.MouseEvent) => void;
  };
}

export function TimelineView({ externalDnd, dndProps }: TimelineViewProps = {}) {
  const timeBlocks = useTimelineStore((s) => s.getBlocksByTime());
  const timerStart = useTimerStore((s) => s.start);

  // 내부 DnD용 (externalDnd=false일 때)
  const internalDnd = useTimelineDnd();
  const {
    containerRef,
    isDropTarget,
    hours,
    totalHeight,
    handleDoubleClick,
  } = externalDnd && dndProps ? dndProps : internalDnd;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleStartTimer = useCallback(
    (block: TimeBlock) => {
      if (block.taskId) {
        timerStart(block.taskId, block.id);
      }
    },
    [timerStart]
  );

  const timelineContent = (
    <TimelineDropArea
      containerRef={containerRef}
      totalHeight={totalHeight}
      hours={hours}
      timeBlocks={timeBlocks}
      isDropTarget={isDropTarget}
      onDoubleClick={handleDoubleClick}
      onStartTimer={handleStartTimer}
    />
  );

  return (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4" />
          타임라인
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          더블클릭으로 블록 추가 / 할 일을 드래그하여 배치
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] lg:h-[600px]">
          {externalDnd ? (
            timelineContent
          ) : (
            <DndContext
              sensors={sensors}
              onDragOver={internalDnd.handleDragOver}
              onDragEnd={internalDnd.handleDragEnd}
            >
              {timelineContent}
            </DndContext>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
