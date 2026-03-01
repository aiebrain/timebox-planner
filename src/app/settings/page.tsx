"use client";

import { useSettingsStore } from "@/stores/settings-store";
import { useTaskStore } from "@/stores/task-store";
import { useTimelineStore } from "@/stores/timeline-store";
import { useHistoryStore } from "@/stores/history-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, Trash2, Download } from "lucide-react";

export default function SettingsPage() {
  const settings = useSettingsStore();
  const clearTasks = useTaskStore((s) => s.clearAll);
  const clearTimeline = useTimelineStore((s) => s.clearAll);
  const plans = useHistoryStore((s) => s.plans);
  const tasks = useTaskStore((s) => s.tasks);
  const timeBlocks = useTimelineStore((s) => s.timeBlocks);

  const handleExport = () => {
    const data = { tasks, timeBlocks, history: plans, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `timebox-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetToday = () => {
    if (confirm("오늘의 모든 태스크와 타임라인을 초기화하시겠습니까?")) {
      clearTasks();
      clearTimeline();
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-4">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <Settings className="h-5 w-5" />
        설정
      </h2>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">타임라인 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">시작 시간</label>
              <Input
                type="number"
                value={settings.startHour}
                onChange={(e) => settings.setStartHour(Number(e.target.value))}
                min={0}
                max={12}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">종료 시간</label>
              <Input
                type="number"
                value={settings.endHour}
                onChange={(e) => settings.setEndHour(Number(e.target.value))}
                min={18}
                max={24}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">기본 블록 길이 (분)</label>
              <Input
                type="number"
                value={settings.defaultBlockMinutes}
                onChange={(e) => settings.setDefaultBlockMinutes(Number(e.target.value))}
                min={15}
                step={15}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">버퍼 시간 (분)</label>
              <Input
                type="number"
                value={settings.bufferMinutes}
                onChange={(e) => settings.setBufferMinutes(Number(e.target.value))}
                min={5}
                step={5}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">데이터 관리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            데이터 내보내기 (JSON)
          </Button>
          <Separator />
          <Button variant="destructive" className="w-full justify-start gap-2" onClick={handleResetToday}>
            <Trash2 className="h-4 w-4" />
            오늘 데이터 초기화
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
