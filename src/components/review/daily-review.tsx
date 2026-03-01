"use client";

import { useMemo, useState } from "react";
import { useTaskStore } from "@/stores/task-store";
import { useTimelineStore } from "@/stores/timeline-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useHistoryStore } from "@/stores/history-store";
import { getTodayDate, formatDuration } from "@/lib/time-utils";
import { ClipboardCheck, TrendingUp } from "lucide-react";

export function DailyReview() {
  const tasks = useTaskStore((s) => s.tasks);
  const timeBlocks = useTimelineStore((s) => s.timeBlocks);
  const archivePlan = useHistoryStore((s) => s.archivePlan);
  const [reflection, setReflection] = useState("");

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const bigThree = tasks.filter((t) => t.isBigThree);
    const bigThreeCompleted = bigThree.filter((t) => t.status === "completed").length;

    const taskBlocks = timeBlocks.filter((b) => b.type === "task");
    const totalPlanned = taskBlocks.reduce((s, b) => s + b.estimatedMinutes, 0);
    const totalActual = taskBlocks.reduce((s, b) => s + (b.actualMinutes ?? 0), 0);
    const blocksWithActual = taskBlocks.filter((b) => b.actualMinutes != null);
    const accuracy =
      blocksWithActual.length > 0
        ? Math.round(
            (blocksWithActual.reduce((s, b) => {
              const ratio = Math.min(b.actualMinutes!, b.estimatedMinutes) / Math.max(b.actualMinutes!, b.estimatedMinutes);
              return s + ratio;
            }, 0) /
              blocksWithActual.length) *
              100
          )
        : 0;

    return { totalTasks, completed, bigThreeCompleted, bigThreeTotal: bigThree.length, totalPlanned, totalActual, accuracy };
  }, [tasks, timeBlocks]);

  const completionRate = stats.totalTasks > 0 ? Math.round((stats.completed / stats.totalTasks) * 100) : 0;

  const handleArchive = () => {
    archivePlan({
      date: getTodayDate(),
      tasks: [...tasks],
      timeBlocks: [...timeBlocks],
      review: {
        totalPlannedMinutes: stats.totalPlanned,
        totalActualMinutes: stats.totalActual,
        tasksCompleted: stats.completed,
        bigThreeCompleted: stats.bigThreeCompleted,
        estimationAccuracy: stats.accuracy,
        reflection,
      },
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardCheck className="h-4 w-4" />
          일일 리뷰
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold">{stats.completed}/{stats.totalTasks}</p>
            <p className="text-xs text-muted-foreground">완료한 태스크</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold">{stats.bigThreeCompleted}/3</p>
            <p className="text-xs text-muted-foreground">빅3 달성</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span>전체 완료율</span>
            <span className="font-medium">{completionRate}%</span>
          </div>
          <Progress value={completionRate} />
        </div>

        {stats.totalPlanned > 0 && (
          <div className="rounded-lg border p-3 space-y-1">
            <div className="flex items-center gap-1 text-sm font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              시간 분석
            </div>
            <div className="grid grid-cols-2 text-xs text-muted-foreground gap-1">
              <span>예상 시간:</span><span className="text-right">{formatDuration(stats.totalPlanned)}</span>
              <span>실제 시간:</span><span className="text-right">{formatDuration(stats.totalActual)}</span>
              <span>예측 정확도:</span><span className="text-right">{stats.accuracy}%</span>
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium mb-1 block">오늘의 회고</label>
          <Textarea
            placeholder="오늘 하루를 돌아보며..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={3}
          />
        </div>

        <Button className="w-full" variant="outline" onClick={handleArchive}>
          오늘 기록 저장하기
        </Button>
      </CardContent>
    </Card>
  );
}
