"use client";

import { useRef, useCallback } from "react";
import { useTimelineStore } from "@/stores/timeline-store";
import { useTaskStore } from "@/stores/task-store";
import { useTimerStore } from "@/stores/timer-store";
import { TIMELINE_CONFIG } from "@/lib/constants";
import { pixelsToSnappedTime, timeToMinutes, minutesToTime } from "@/lib/time-utils";
import { TimeBlockItem } from "./time-block-item";
import { CurrentTimeIndicator } from "./current-time-indicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";
import type { TimeBlock } from "@/types";

export function TimelineView() {
  const timeBlocks = useTimelineStore((s) => s.getBlocksByTime());
  const addTimeBlock = useTimelineStore((s) => s.addTimeBlock);
  const timerStart = useTimerStore((s) => s.start);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleStartTimer = useCallback(
    (block: TimeBlock) => {
      if (block.taskId) {
        timerStart(block.taskId, block.id);
      }
    },
    [timerStart]
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
          <div
            ref={containerRef}
            className="relative"
            style={{ height: totalHeight }}
            onDoubleClick={handleDoubleClick}
          >
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
              <TimeBlockItem key={block.id} block={block} onStartTimer={handleStartTimer} />
            ))}

            {/* 현재 시각 표시 */}
            <CurrentTimeIndicator />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
