import type { Minutes, TimeString, TimeRange } from '@models';

export function timeToMinutes(time: TimeString): Minutes {
  const [hours, mins] = time.split(':').map(Number);
  return hours * 60 + mins;
}

export function minutesToTime(minutes: Minutes): TimeString {
  const sign = minutes < 0 ? '-' : '';
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatGap(minutes: Minutes): string {
  if (minutes === 0) return '00:00';
  const sign = minutes > 0 ? '+' : '-';
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function clampTime(
  time: Minutes,
  range: TimeRange
): { clamped: Minutes; diff: Minutes } {
  const rangeStart = timeToMinutes(range.start);
  const rangeEnd = timeToMinutes(range.end);
  const clamped = Math.min(Math.max(time, rangeStart), rangeEnd);
  return { clamped, diff: clamped - time };
}
