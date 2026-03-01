"use client";

import { useState, useEffect, useCallback } from "react";
import { useTimerStore } from "@/stores/timer-store";
import { useTimelineStore } from "@/stores/timeline-store";
import { useTaskStore } from "@/stores/task-store";

export function useTimer() {
  const session = useTimerStore((s) => s.session);
  const getElapsedMs = useTimerStore((s) => s.getElapsedMs);
  const stop = useTimerStore((s) => s.stop);
  const pause = useTimerStore((s) => s.pause);
  const resume = useTimerStore((s) => s.resume);
  const setActualMinutes = useTimelineStore((s) => s.setActualMinutes);
  const setTaskStatus = useTaskStore((s) => s.setTaskStatus);

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!session || session.state !== "running") return;
    const interval = setInterval(() => {
      setElapsed(getElapsedMs());
    }, 1000);
    return () => clearInterval(interval);
  }, [session, session?.state, getElapsedMs]);

  useEffect(() => {
    if (session?.state === "paused") {
      setElapsed(getElapsedMs());
    }
  }, [session?.state, getElapsedMs]);

  const handleStop = useCallback(() => {
    if (!session) return;
    const totalMs = stop();
    const actualMinutes = Math.round(totalMs / 60_000);
    setActualMinutes(session.timeBlockId, actualMinutes);
    setTaskStatus(session.taskId, "completed");
  }, [session, stop, setActualMinutes, setTaskStatus]);

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return {
    session,
    elapsed,
    formattedTime: formatTime(elapsed),
    isRunning: session?.state === "running",
    isPaused: session?.state === "paused",
    pause,
    resume,
    stop: handleStop,
  };
}
