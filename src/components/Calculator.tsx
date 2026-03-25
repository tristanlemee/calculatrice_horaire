import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
    <div className="flex flex-col w-full pt-5">
      <ModeSelector mode={mode} onChange={handleModeChange} />

      <div key={mode} className="flex flex-col gap-5 animate-mode-enter">
        {mode === 'both-to-gap' ? (
          <div className="grid grid-cols-2 gap-3">
            <TimeInput
              label="Arrivée"
              value={arrival}
              onChange={setArrival}
              error={showArrivalWarning ? arrivalWarning : undefined}
            />
            <TimeInput
              label="Départ"
              value={departure}
              onChange={setDeparture}
            />
          </div>
        ) : (
          <>
            {mode === 'arrival-to-departure' && (
              <TimeInput
                label="Arrivée"
                value={arrival}
                onChange={setArrival}
                error={showArrivalWarning ? arrivalWarning : undefined}
              />
            )}
            {mode === 'departure-to-arrival' && (
              <TimeInput
                label="Départ"
                value={departure}
                onChange={setDeparture}
              />
            )}
          </>
        )}

        <GapInput
          label="Écart actuel (optionnel)"
          value={currentGap}
          onChange={setCurrentGap}
        />

        {gapWarning && (
          <p className="text-xs text-red-500 dark:text-red-400">{gapWarning}</p>
        )}
      </div>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      </div>

      {result ? (
        <ResultDisplay
          label={resultLabel}
          time={mode !== 'both-to-gap' ? result.computedTime : undefined}
          gap={result.newGap}
          warnings={result.warnings}
        />
      ) : (
        <div className="flex items-center justify-center py-8 text-xs text-slate-400 dark:text-slate-500 tracking-wide">
          Saisissez une heure pour calculer
        </div>
      )}
    </div>
  );
}
