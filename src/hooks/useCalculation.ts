import { useMemo } from 'react';
import type { CalculationInput, CalculationResult, Settings } from '@models';
import { timeToMinutes, minutesToTime, clampTime } from './useTimeUtils';

export function useCalculation(
  input: CalculationInput,
  settings: Settings
): CalculationResult | null {
  const { mode, arrival, departure, currentGap } = input;
  const { lunchBreakMinutes, workDayMinutes, arrivalRange, departureRange } = settings;

  return useMemo(() => {
    if (mode === 'arrival-to-departure') {
      if (!arrival) return null;

      const arrivalMin = timeToMinutes(arrival);
      // Heure de départ théorique sans écart
      const departureBase = arrivalMin + workDayMinutes + lunchBreakMinutes;
      // Ajuster pour absorber l'écart : écart positif → partir plus tôt
      const departureAdjusted = departureBase - currentGap;

      const { clamped: departureFinal, diff } = clampTime(departureAdjusted, departureRange);

      const warnings: string[] = [];
      if (diff !== 0) {
        const bound = diff > 0 ? `minimum (${departureRange.start})` : `maximum (${departureRange.end})`;
        warnings.push(`Heure de départ limitée au ${bound}`);
      }

      // Écart absorbé = départ_base - départ_final (combien on a avancé/reculé par rapport au neutre)
      const newGap = currentGap - (departureBase - departureFinal);

      return { computedTime: minutesToTime(departureFinal), newGap, warnings };
    }

    if (mode === 'departure-to-arrival') {
      if (!departure) return null;

      const departureMin = timeToMinutes(departure);
      // Heure d'arrivée théorique sans écart
      const arrivalBase = departureMin - workDayMinutes - lunchBreakMinutes;
      // Ajuster pour absorber l'écart : écart négatif → arriver plus tôt pour rattraper
      const arrivalAdjusted = arrivalBase + currentGap;

      const { clamped: arrivalFinal, diff } = clampTime(arrivalAdjusted, arrivalRange);

      const warnings: string[] = [];
      if (diff !== 0) {
        const bound = diff > 0 ? `minimum (${arrivalRange.start})` : `maximum (${arrivalRange.end})`;
        warnings.push(`Heure d'arrivée limitée au ${bound}`);
      }

      // Écart absorbé = arrivée_base - arrivée_finale (arriver plus tôt = travailler plus = absorber du déficit)
      const newGap = currentGap + (arrivalBase - arrivalFinal);

      return { computedTime: minutesToTime(arrivalFinal), newGap, warnings };
    }

    if (mode === 'both-to-gap') {
      if (!arrival || !departure) return null;

      const arrivalMin = timeToMinutes(arrival);
      const departureMin = timeToMinutes(departure);
      const workedTime = departureMin - arrivalMin - lunchBreakMinutes;
      const delta = workedTime - workDayMinutes;
      const newGap = currentGap + delta;

      return { computedTime: '', newGap, warnings: [] };
    }

    return null;
  }, [
    mode, arrival, departure, currentGap,
    lunchBreakMinutes, workDayMinutes,
    arrivalRange.start, arrivalRange.end,
    departureRange.start, departureRange.end,
  ]);
}
