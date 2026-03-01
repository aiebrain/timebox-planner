"use client";

import { useTaskStore } from "@/stores/task-store";
import { BigThreeSlot } from "./big-three-slot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { cn } from "@/lib/utils";

export function BigThreePanel() {
  const tasks = useTaskStore((s) => s.tasks);
  const toggleBigThree = useTaskStore((s) => s.toggleBigThree);

  const bigThree = [1, 2, 3].map((p) =>
    tasks.find((t) => t.isBigThree && t.bigThreePriority === p)
  );

  const bigThreeCount = bigThree.filter(Boolean).length;

  // 빅3에 선정되지 않은 미완료 태스크
  const available = tasks.filter(
    (t) => !t.isBigThree && t.status !== "completed"
  );

  // 빈 슬롯의 priority 찾기
  const getNextEmptySlot = (): (1 | 2 | 3) | null => {
    for (const p of [1, 2, 3] as const) {
      if (!bigThree[p - 1]) return p;
    }
    return null;
  };

  const handleClickAssign = (taskId: string) => {
    const slot = getNextEmptySlot();
    if (slot) toggleBigThree(taskId, slot);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4" />
            빅 3 선정
          </CardTitle>
          <Badge variant={bigThreeCount === 3 ? "default" : "secondary"}>
            {bigThreeCount}/3
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          오늘 반드시 끝낼 3가지만 선택하세요
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {([1, 2, 3] as const).map((p) => (
          <BigThreeSlot key={p} priority={p} task={bigThree[p - 1]} />
        ))}

        {available.length > 0 && bigThreeCount < 3 && (
          <div className="pt-3 border-t space-y-1">
            <p className="text-xs text-muted-foreground mb-2">클릭하여 빅3에 추가:</p>
            {available.map((task) => (
              <button
                key={task.id}
                onClick={() => handleClickAssign(task.id)}
                className={cn(
                  "w-full text-left text-sm px-3 py-2 rounded-md",
                  "hover:bg-accent transition-colors"
                )}
              >
                {task.title}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
