import { TIMELINE_CONFIG } from "./constants";

/** "09:30" → 분(570) */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** 분(570) → "09:30" */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** 분 → 시간 표시 ("1시간 30분") */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

/** 시간 문자열 → 타임라인 Y 픽셀 위치 */
export function timeToPixels(time: string): number {
  const minutes = timeToMinutes(time);
  const startMinutes = TIMELINE_CONFIG.startHour * 60;
  return ((minutes - startMinutes) / 60) * TIMELINE_CONFIG.pixelsPerHour;
}

/** 분 → 픽셀 높이 */
export function minutesToPixels(minutes: number): number {
  return (minutes / 60) * TIMELINE_CONFIG.pixelsPerHour;
}

/** 픽셀 Y → 스냅된 시간 문자열 */
export function pixelsToSnappedTime(pixels: number): string {
  const startMinutes = TIMELINE_CONFIG.startHour * 60;
  const totalMinutes = startMinutes + (pixels / TIMELINE_CONFIG.pixelsPerHour) * 60;
  const snapped = Math.round(totalMinutes / TIMELINE_CONFIG.snapMinutes) * TIMELINE_CONFIG.snapMinutes;
  return minutesToTime(Math.max(TIMELINE_CONFIG.startHour * 60, Math.min(TIMELINE_CONFIG.endHour * 60, snapped)));
}

/** 두 시간 블록이 겹치는지 확인 */
export function isOverlapping(
  aStart: string, aEnd: string,
  bStart: string, bEnd: string,
): boolean {
  const a0 = timeToMinutes(aStart);
  const a1 = timeToMinutes(aEnd);
  const b0 = timeToMinutes(bStart);
  const b1 = timeToMinutes(bEnd);
  return a0 < b1 && b0 < a1;
}

/** 현재 시각을 "HH:MM" 형식으로 */
export function getCurrentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

/** 오늘 날짜를 "YYYY-MM-DD" 형식으로 */
export function getTodayDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/** ID 생성 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
