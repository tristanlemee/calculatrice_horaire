import { useState } from 'react';
import type { CalculationMode, TimeString, Minutes } from '@models';
import { useSettings } from '@contexts/SettingsContext';
import { useCalculation } from '@hooks/useCalculation';
import { timeToMinutes } from '@hooks/useTimeUtils';
import ModeSelector from '@components/ModeSelector';
import TimeInput from '@components/TimeInput';
import GapInput from '@components/GapInput';
import ResultDisplay from '@components/ResultDisplay';

const GAP_MAX_MINUTES = 24 * 60;

export default function Calculator() {
  const { settings } = useSettings();
  const [mode, setMode] = useState<CalculationMode>('arrival-to-departure');
  const [arrival, setArrival] = useState<TimeString>('');
  const [departure, setDeparture] = useState<TimeString>('');
  const [currentGap, setCurrentGap] = useState<Minutes>(0);

  function handleModeChange(newMode: CalculationMode) {
    setMode(newMode);
    setArrival('');
    setDeparture('');
    setCurrentGap(0);
  }

  const result = useCalculation({ mode, arrival, departure, currentGap }, settings);

  const arrivalWarning: string | undefined = (() => {
    if (!arrival) return undefined;
    const arrMin = timeToMinutes(arrival);
    const rangeStart = timeToMinutes(settings.arrivalRange.start);
    const rangeEnd = timeToMinutes(settings.arrivalRange.end);
    if (arrMin < rangeStart) return `Arrivée avant la plage autorisée (min. ${settings.arrivalRange.start})`;
    if (arrMin > rangeEnd) return `Arrivée après la plage autorisée (max. ${settings.arrivalRange.end})`;
    return undefined;
  })();

  const showArrivalWarning = mode !== 'departure-to-arrival' && !!arrivalWarning;

  const gapWarning: string | undefined =
    Math.abs(currentGap) > GAP_MAX_MINUTES
      ? `Écart inhabituellement élevé (${Math.floor(Math.abs(currentGap) / 60)}h) — vérifiez la valeur saisie`
      : undefined;

  const resultLabel =
    mode === 'arrival-to-departure'
      ? 'Heure de départ'
      : mode === 'departure-to-arrival'
      ? "Heure d'arrivée nécessaire"
      : 'Écart résultant';

  return (
    <div className="flex flex-col w-full">
      <ModeSelector mode={mode} onChange={handleModeChange} />

      <div className="flex flex-col gap-6 p-4 border border-t-0 border-slate-800 bg-slate-900/20">
        <div key={mode} className="flex flex-col gap-4 animate-mode-enter">
          {(mode === 'arrival-to-departure' || mode === 'both-to-gap') && (
            <TimeInput
              label="Arrivée"
              value={arrival}
              onChange={setArrival}
              error={showArrivalWarning ? arrivalWarning : undefined}
            />
          )}

          {(mode === 'departure-to-arrival' || mode === 'both-to-gap') && (
            <TimeInput
              label="Départ"
              value={departure}
              onChange={setDeparture}
            />
          )}

          <GapInput
            label="Écart actuel (optionnel)"
            value={currentGap}
            onChange={setCurrentGap}
          />

          {gapWarning && (
            <p className="text-sm text-red-400">{gapWarning}</p>
          )}
        </div>

        {result ? (
          <ResultDisplay
            label={resultLabel}
            time={mode !== 'both-to-gap' ? result.computedTime : undefined}
            gap={result.newGap}
            warnings={result.warnings}
          />
        ) : (
          <div className="flex items-center justify-center py-8 text-slate-500 text-sm tracking-wide">
            Saisissez une heure pour calculer
          </div>
        )}
      </div>
    </div>
  );
}
