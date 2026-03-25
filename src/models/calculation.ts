import type { Minutes, TimeString } from './time';

export type CalculationMode =
  | 'arrival-to-departure'
  | 'departure-to-arrival'
  | 'both-to-gap';

export interface CalculationInput {
  mode: CalculationMode;
  arrival?: TimeString;
  departure?: TimeString;
  currentGap: Minutes;
}

export interface CalculationResult {
  computedTime: TimeString;
  newGap: Minutes;
  warnings: string[];
}
