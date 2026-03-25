import { useState, useEffect, useId } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
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

const numberInputCls = (hasError: boolean) =>
  [
    'rounded-xl px-4 py-3 border-2 w-full',
    'text-base font-mono font-bold',
    'text-slate-800 dark:text-white',
    'bg-white dark:bg-slate-800',
    'outline-none transition-all',
    'focus:border-blue-400 dark:focus:border-blue-500',
    hasError
      ? 'border-red-300 dark:border-red-700'
      : 'border-slate-200 dark:border-slate-700',
  ].join(' ');

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [draft, setDraft] = useState<Draft>(() => settingsToDraft(settings));
  const [errors, setErrors] = useState<ValidationErrors>({});

  const lunchId = useId();
  const workHoursId = useId();
  const workMinsId = useId();

  useEffect(() => {
    setDraft(settingsToDraft(settings));
    setErrors({});
  }, [settings]);

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

  const sectionCardCls = 'rounded-2xl p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50';
  const sectionTitleCls = 'text-xs font-bold uppercase tracking-widest mb-4 text-slate-500 dark:text-slate-400';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Paramètres"
      className={[
        'fixed inset-0 z-50 flex flex-col',
        'bg-slate-50 dark:bg-slate-900',
        'transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      ].join(' ')}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 pb-4 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shrink-0"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 3rem)' }}
      >
        <button
          onClick={onClose}
          aria-label="Retour"
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
        >
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
        </button>
        <h2 className="text-base font-black tracking-tight text-slate-800 dark:text-white">
          Paramètres
        </h2>
        <button
          onClick={resetSettings}
          aria-label="Réinitialiser"
          className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
        >
          <RotateCcw size={16} className="text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5">

        {/* Pause méridienne */}
        <div className={sectionCardCls}>
          <h3 className={sectionTitleCls}>Pause méridienne</h3>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={lunchId}
              className="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400"
            >
              Durée (minutes)
            </label>
            <input
              id={lunchId}
              type="number"
              min={0}
              value={draft.lunchBreakMinutes}
              onChange={(e) => update({ lunchBreakMinutes: e.target.value })}
              className={numberInputCls(!!errors.lunchBreak)}
            />
            {errors.lunchBreak && (
              <span className="text-xs text-red-500 dark:text-red-400">{errors.lunchBreak}</span>
            )}
          </div>
        </div>

        {/* Durée journée */}
        <div className={sectionCardCls}>
          <h3 className={sectionTitleCls}>Durée de la journée</h3>
          <div className="flex items-end gap-2">
            <div className="flex-1 flex flex-col gap-1.5">
              <label
                htmlFor={workHoursId}
                className="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400"
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
                className={numberInputCls(!!errors.workDay)}
              />
            </div>
            <span className="text-slate-400 dark:text-slate-500 font-mono text-xl mb-3">h</span>
            <div className="flex-1 flex flex-col gap-1.5">
              <label
                htmlFor={workMinsId}
                className="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400"
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
                className={numberInputCls(!!errors.workDay)}
              />
            </div>
          </div>
          {errors.workDay && (
            <span className="text-xs text-red-500 dark:text-red-400 mt-2 block">{errors.workDay}</span>
          )}
        </div>

        {/* Plage d'arrivée */}
        <div className={sectionCardCls}>
          <h3 className={sectionTitleCls}>Plage d'arrivée</h3>
          <div className="grid grid-cols-2 gap-3">
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
        </div>

        {/* Plage de départ */}
        <div className={sectionCardCls}>
          <h3 className={sectionTitleCls}>Plage de départ</h3>
          <div className="grid grid-cols-2 gap-3">
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
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-5 shrink-0"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 2.5rem)' }}
      >
        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-blue-500 text-white font-black text-base tracking-wide transition-all active:scale-95"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
