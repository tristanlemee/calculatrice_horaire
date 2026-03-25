import type { Minutes, TimeRange } from './time';

export interface Settings {
  lunchBreakMinutes: Minutes;
  workDayMinutes: Minutes;
  arrivalRange: TimeRange;
  departureRange: TimeRange;
}

export const DEFAULT_SETTINGS: Settings = {
  lunchBreakMinutes: 45,
  workDayMinutes: 420,
  arrivalRange: { start: '07:00', end: '10:00' },
  departureRange: { start: '15:15', end: '19:15' },
};
