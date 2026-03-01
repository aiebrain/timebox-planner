"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTimelineStore } from "@/stores/timeline-store";
import { useTaskStore } from "@/stores/task-store";
import type { Task } from "@/types";

interface ScheduleDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleDialog({ task, open, onOpenChange }: ScheduleDialogProps) {
  const [startTime, setStartTime] = useState("09:00");
  const [duration, setDuration] = useState(60);
  const scheduleTask = useTimelineStore((s) => s.scheduleTask);
  const updateTask = useTaskStore((s) => s.updateTask);

  const handleSchedule = () => {
    if (!task) return;
    scheduleTask(task.id, task.title, startTime, duration);
    updateTask(task.id, { isScheduled: true });
    onOpenChange(false);
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>타임 블록 배치</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm font-medium">{task.title}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">시작 시간</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">소요 시간 (분)</label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={15}
                step={15}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
          <Button onClick={handleSchedule}>배치하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
