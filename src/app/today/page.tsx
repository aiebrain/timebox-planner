"use client";

import { useState } from "react";
import { BrainDumpList } from "@/components/brain-dump/brain-dump-list";
import { BigThreePanel } from "@/components/big-three/big-three-panel";
import { TimelineView } from "@/components/timeline/timeline-view";
import { ScheduleDialog } from "@/components/timeline/schedule-dialog";
import { TimerWidget } from "@/components/timer/timer-widget";
import { DailyReview } from "@/components/review/daily-review";
import { StepIndicator } from "@/components/shared/step-indicator";
import { useTaskStore } from "@/stores/task-store";
import type { Task } from "@/types";

export default function TodayPage() {
  const [step, setStep] = useState(1);
  const [scheduleTask, setScheduleTask] = useState<Task | null>(null);
  const tasks = useTaskStore((s) => s.tasks);

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

      {/* 스텝 3: 타임라인 */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
          {/* 미배치 태스크 목록 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground px-1">배치할 태스크</h3>
            {tasks
              .filter((t) => !t.isScheduled && t.status !== "completed")
              .map((task) => (
                <button
                  key={task.id}
                  onClick={() => setScheduleTask(task)}
                  className="w-full text-left rounded-lg border px-3 py-2 text-sm hover:bg-accent transition-colors"
                >
                  {task.isBigThree && (
                    <span className="text-xs font-bold text-red-500 mr-1">#{task.bigThreePriority}</span>
                  )}
                  {task.title}
                </button>
              ))}
            {tasks.filter((t) => !t.isScheduled && t.status !== "completed").length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                모든 태스크가 배치되었습니다
              </p>
            )}
          </div>
          <TimelineView />
        </div>
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
