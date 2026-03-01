"use client";

import { useParams } from "next/navigation";
import { useHistoryStore } from "@/stores/history-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { ArrowLeft, Clock, Target, TrendingUp } from "lucide-react";
import { formatDuration } from "@/lib/time-utils";
import { BIG_THREE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function HistoryDetailPage() {
  const params = useParams();
  const date = params.date as string;
  const plan = useHistoryStore((s) => s.getPlan(date));

  if (!plan) {
    return (
      <div className="p-4 lg:p-6 max-w-3xl mx-auto text-center py-12">
        <p className="text-muted-foreground">해당 날짜의 기록을 찾을 수 없습니다</p>
        <Link href="/history">
          <Button variant="outline" className="mt-4">목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const review = plan.review;
  const bigThreeTasks = plan.tasks.filter((t) => t.isBigThree).sort((a, b) => (a.bigThreePriority ?? 0) - (b.bigThreePriority ?? 0));
  const completionRate = plan.tasks.length > 0 ? Math.round((plan.tasks.filter((t) => t.status === "completed").length / plan.tasks.length) * 100) : 0;

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/history">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h2 className="text-lg font-bold">
          {format(parseISO(date), "yyyy년 M월 d일 EEEE", { locale: ko })}
        </h2>
      </div>

      {/* 빅3 달성 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4" />
            빅 3 결과
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {bigThreeTasks.map((task) => {
            const config = task.bigThreePriority ? BIG_THREE_COLORS[task.bigThreePriority] : null;
            return (
              <div key={task.id} className={cn("flex items-center gap-3 rounded-lg px-3 py-2", config?.bgColor)}>
                <span className={cn("font-bold", config?.color)}>{task.bigThreePriority}</span>
                <span className={cn("flex-1 text-sm", task.status === "completed" && "line-through")}>{task.title}</span>
                <Badge variant={task.status === "completed" ? "default" : "secondary"}>
                  {task.status === "completed" ? "완료" : "미완료"}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 통계 */}
      {review && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              통계
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>완료율</span><span>{completionRate}%</span>
              </div>
              <Progress value={completionRate} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xl font-bold">{formatDuration(review.totalPlannedMinutes)}</p>
                <p className="text-xs text-muted-foreground">예상 시간</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xl font-bold">{formatDuration(review.totalActualMinutes)}</p>
                <p className="text-xs text-muted-foreground">실제 시간</p>
              </div>
            </div>
            {review.reflection && (
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1">회고</p>
                <p className="text-sm">{review.reflection}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 타임 블록 목록 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" />
            타임 블록
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {plan.timeBlocks
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((block) => (
              <div key={block.id} className="flex items-center gap-3 text-sm py-1.5 border-b last:border-0">
                <span className="text-muted-foreground tabular-nums w-24">{block.startTime}–{block.endTime}</span>
                <span className="flex-1">{block.title}</span>
                {block.actualMinutes != null && (
                  <span className="text-xs text-muted-foreground">실제 {formatDuration(block.actualMinutes)}</span>
                )}
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
