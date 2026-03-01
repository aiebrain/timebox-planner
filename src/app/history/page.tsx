"use client";

import { useHistoryStore } from "@/stores/history-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { History, CalendarDays } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const plans = useHistoryStore((s) => s.plans);
  const dates = useHistoryStore((s) => s.getAllDates());

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <History className="h-5 w-5" />
        과거 기록
      </h2>

      {dates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CalendarDays className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">아직 저장된 기록이 없습니다</p>
            <p className="text-xs text-muted-foreground mt-1">오늘 페이지에서 일일 리뷰를 저장해보세요</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {dates.map((date) => {
            const plan = plans.find((p) => p.date === date);
            if (!plan) return null;
            const review = plan.review;
            return (
              <Link key={date} href={`/history/${date}`}>
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">
                        {format(parseISO(date), "yyyy년 M월 d일 EEEE", { locale: ko })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        태스크 {plan.tasks.length}개 / 블록 {plan.timeBlocks.length}개
                      </p>
                    </div>
                    {review && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">빅3 {review.bigThreeCompleted}/3</Badge>
                        <Badge variant="outline">정확도 {review.estimationAccuracy}%</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
