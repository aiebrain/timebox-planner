"use client";

import { useMemo } from "react";
import { useHistoryStore } from "@/stores/history-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Target, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { formatDuration } from "@/lib/time-utils";

export default function AnalyticsPage() {
  const plans = useHistoryStore((s) => s.plans);

  const stats = useMemo(() => {
    if (plans.length === 0) return null;

    const reviewed = plans.filter((p) => p.review);
    const totalDays = reviewed.length;
    const totalTasks = reviewed.reduce((s, p) => s + (p.review?.tasksCompleted ?? 0), 0);
    const totalBigThree = reviewed.reduce((s, p) => s + (p.review?.bigThreeCompleted ?? 0), 0);
    const avgAccuracy = totalDays > 0
      ? Math.round(reviewed.reduce((s, p) => s + (p.review?.estimationAccuracy ?? 0), 0) / totalDays)
      : 0;
    const totalPlanned = reviewed.reduce((s, p) => s + (p.review?.totalPlannedMinutes ?? 0), 0);
    const totalActual = reviewed.reduce((s, p) => s + (p.review?.totalActualMinutes ?? 0), 0);

    // 최근 7개 기록
    const recent = reviewed
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 7)
      .reverse();

    return { totalDays, totalTasks, totalBigThree, avgAccuracy, totalPlanned, totalActual, recent };
  }, [plans]);

  if (!stats) {
    return (
      <div className="p-4 lg:p-6 max-w-4xl mx-auto">
        <h2 className="flex items-center gap-2 text-lg font-bold mb-4">
          <BarChart3 className="h-5 w-5" />
          분석 대시보드
        </h2>
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">아직 분석할 데이터가 없습니다</p>
            <p className="text-xs text-muted-foreground mt-1">일일 리뷰를 저장하면 여기서 트렌드를 확인할 수 있어요</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <BarChart3 className="h-5 w-5" />
        분석 대시보드
      </h2>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{stats.totalDays}</p>
            <p className="text-xs text-muted-foreground">기록된 날</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{stats.totalTasks}</p>
            <p className="text-xs text-muted-foreground">완료한 태스크</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{stats.totalBigThree}</p>
            <p className="text-xs text-muted-foreground">빅3 달성</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-2xl font-bold">{stats.avgAccuracy}%</p>
            <p className="text-xs text-muted-foreground">평균 예측 정확도</p>
          </CardContent>
        </Card>
      </div>

      {/* 시간 총합 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" />
            누적 시간
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xl font-bold">{formatDuration(stats.totalPlanned)}</p>
              <p className="text-xs text-muted-foreground">총 예상 시간</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{formatDuration(stats.totalActual)}</p>
              <p className="text-xs text-muted-foreground">총 실제 시간</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 최근 트렌드 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" />
            최근 기록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.recent.map((plan) => (
              <div key={plan.date} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                <span className="text-muted-foreground">
                  {format(parseISO(plan.date), "M/d (EEE)", { locale: ko })}
                </span>
                <div className="flex items-center gap-3">
                  <span>빅3 {plan.review?.bigThreeCompleted}/3</span>
                  <span className="text-muted-foreground">|</span>
                  <span>정확도 {plan.review?.estimationAccuracy}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
