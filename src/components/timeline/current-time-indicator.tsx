"use client";

import { useEffect, useState } from "react";
import { timeToPixels, getCurrentTime } from "@/lib/time-utils";

export function CurrentTimeIndicator() {
  const [now, setNow] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => setNow(getCurrentTime()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const top = timeToPixels(now);

  return (
    <div className="absolute left-0 right-0 z-20 pointer-events-none" style={{ top }}>
      <div className="flex items-center">
        <div className="h-3 w-3 rounded-full bg-red-500 -ml-1.5" />
        <div className="flex-1 h-0.5 bg-red-500" />
      </div>
      <span className="absolute -top-3 left-4 text-[10px] font-medium text-red-500">{now}</span>
    </div>
  );
}
