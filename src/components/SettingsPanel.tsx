import { useState, useEffect, useId } from 'react';
import { X, Settings, RotateCcw } from 'lucide-react';
import { useSettings } from '@contexts/SettingsContext';
import TimeInput from '@components/TimeInput';
import type { TimeString } from '@models';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Draft {
  lunchBreakMinutes: string;
  workDayHours: string;
  workDayMins: string;
  arrivalStart: TimeString;
  arrivalEnd: TimeString;
  departureStart: TimeString;
  departureEnd: TimeString;
}

interface ValidationErrors {
  lunchBreak?: string;
  workDay?: string;
  arrivalRange?: string;
  departureRange?: string;
}

function settingsToDraft(s: ReturnType<typeof useSettings>['settings']): Draft {
  const hours = Math.floor(s.workDayMinutes / 60);
  const mins = s.workDayMinutes % 60;
  return {
    lunchBreakMinutes: String(s.lunchBreakMinutes),
    workDayHours: String(hours),
    workDayMins: String(mins).padStart(2, '0'),
    arrivalStart: s.arrivalRange.start,
    arrivalEnd: s.arrivalRange.end,
    departureStart: s.departureRange.start,
    departureEnd: s.departureRange.end,
  };
}

function validate(d: Draft): ValidationErrors {
  const errors: ValidationErrors = {};

  const lunch = parseInt(d.lunchBreakMinutes, 10);
  if (isNaN(lunch) || lunch < 0) {
    errors.lunchBreak = 'Valeur invalide (entier ≥ 0)';
  }

  const h = parseInt(d.workDayHours, 10);
  const m = parseInt(d.workDayMins, 10);
  if (isNaN(h) || isNaN(m) || h < 0 || m < 0 || m > 59 || (h === 0 && m === 0)) {
    errors.workDay = 'Durée invalide';
  }

  if (d.arrivalStart >= d.arrivalEnd) {
    errors.arrivalRange = 'Le début doit être avant la fin';
  }

  if (d.departureStart >= d.departureEnd) {
    errors.departureRange = 'Le début doit être avant la fin';
  }

  return errors;
}

const NUMBER_INPUT_CLS = (hasError: boolean) =>
  [
    'bg-slate-900 text-white px-3 py-2 text-lg font-mono min-h-12',
    'border outline-none rounded-none w-20',
    'transition-colors duration-150',
    'focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/40',
    hasError
      ? 'border-red-500 focus:border-red-400'
      : 'border-slate-700 focus:border-blue-500',
  ].join(' ');

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [draft, setDraft] = useState<Draft>(() => settingsToDraft(settings));
  const [errors, setErrors] = useState<ValidationErrors>({});

  const lunchId = useId();
  const workHoursId = useId();
  const workMinsId = useId();

  // Sync draft when settings change externally (reset)
  useEffect(() => {
    setDraft(settingsToDraft(settings));
    setErrors({});
  }, [settings]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  function applyDraft(next: Draft) {
    const errs = validate(next);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      updateSettings({
        lunchBreakMinutes: parseInt(next.lunchBreakMinutes, 10),
        workDayMinutes: parseInt(next.workDayHours, 10) * 60 + parseInt(next.workDayMins, 10),
        arrivalRange: { start: next.arrivalStart, end: next.arrivalEnd },
        departureRange: { start: next.departureStart, end: next.departureEnd },
      });
    }
  }

  function update(partial: Partial<Draft>) {
    const next = { ...draft, ...partial };
    setDraft(next);
    applyDraft(next);
  }

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={[
          'fixed inset-0 bg-black/60 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Paramètres"
        className={[
          'fixed top-0 right-0 h-full w-full max-w-sm z-50',
          'bg-slate-950 border-l border-slate-800',
          'flex flex-col',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-blue-400" />
            <h2 className="text-white font-semibold uppercase tracking-wide text-sm">
              Paramètres
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-none outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">

          {/* Pause méridienne */}
          <section>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              Pause méridienne
            </h3>
            <div className="flex flex-col gap-1">
              <label
                htmlFor={lunchId}
                className="text-sm font-medium text-slate-300 uppercase tracking-wide"
              >
                Durée (minutes)
              </label>
              <input
                id={lunchId}
                type="number"
                min={0}
                value={draft.lunchBreakMinutes}
                onChange={(e) => update({ lunchBreakMinutes: e.target.value })}
                className={NUMBER_INPUT_CLS(!!errors.lunchBreak)}
              />
              {errors.lunchBreak && (
                <span className="text-sm text-red-400">{errors.lunchBreak}</span>
              )}
            </div>
          </section>

          {/* Durée journée */}
          <section>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              Durée de la journée
            </h3>
            <div className="flex items-end gap-2">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor={workHoursId}
                  className="text-sm font-medium text-slate-300 uppercase tracking-wide"
                >
                  Heures
                </label>
                <input
                  id={workHoursId}
                  type="number"
                  min={0}
                  max={23}
                  value={draft.workDayHours}
                  onChange={(e) => update({ workDayHours: e.target.value })}
                  className={NUMBER_INPUT_CLS(!!errors.workDay)}
                />
              </div>
              <span className="text-slate-400 font-mono text-xl pb-2">h</span>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor={workMinsId}
                  className="text-sm font-medium text-slate-300 uppercase tracking-wide"
                >
                  Min
                </label>
                <input
                  id={workMinsId}
                  type="number"
                  min={0}
                  max={59}
                  value={draft.workDayMins}
                  onChange={(e) => update({ workDayMins: e.target.value })}
                  className={NUMBER_INPUT_CLS(!!errors.workDay)}
                />
              </div>
            </div>
            {errors.workDay && (
              <span className="text-sm text-red-400 mt-1 block">{errors.workDay}</span>
            )}
          </section>

          {/* Plage d'arrivée */}
          <section>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              Plage d'arrivée
            </h3>
            <div className="flex gap-4">
              <TimeInput
                label="Début"
                value={draft.arrivalStart}
                onChange={(v) => update({ arrivalStart: v })}
              />
              <TimeInput
                label="Fin"
                value={draft.arrivalEnd}
                onChange={(v) => update({ arrivalEnd: v })}
                error={errors.arrivalRange}
              />
            </div>
          </section>

          {/* Plage de départ */}
          <section>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              Plage de départ
            </h3>
            <div className="flex gap-4">
              <TimeInput
                label="Début"
                value={draft.departureStart}
                onChange={(v) => update({ departureStart: v })}
              />
              <TimeInput
                label="Fin"
                value={draft.departureEnd}
                onChange={(v) => update({ departureEnd: v })}
                error={errors.departureRange}
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-800 shrink-0">
          <button
            onClick={resetSettings}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors uppercase tracking-wide outline-none rounded-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <RotateCcw size={14} />
            Réinitialiser les valeurs par défaut
          </button>
        </div>
      </div>
    </>
  );
}
