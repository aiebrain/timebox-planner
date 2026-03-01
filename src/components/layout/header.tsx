"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Timer } from "lucide-react";

export function Header() {
  const today = new Date();
  const dateStr = format(today, "yyyy년 M월 d일 EEEE", { locale: ko });

  return (
    <header className="flex items-center justify-between border-b px-4 lg:px-6 h-14">
      <div className="flex items-center gap-2">
        <Timer className="h-5 w-5 text-primary" />
        <h1 className="text-base font-bold tracking-tight">타임박싱 플래너</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground hidden sm:inline">{dateStr}</span>
        <ThemeToggle />
      </div>
    </header>
  );
}
