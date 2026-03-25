import { useId } from 'react';
import type { Minutes } from '@models';

interface GapInputProps {
  value: Minutes;
  onChange: (value: Minutes) => void;
  label?: string;
  disabled?: boolean;
}

export default function GapInput({
  value,
  onChange,
  label,
  disabled = false,
}: GapInputProps) {
  const hoursId = useId();
  const isNegative = value < 0;
  const absMinutes = Math.abs(value);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;

  const handleToggleSign = () => {
    if (value !== 0) onChange(-value);
  };

  const handleHoursChange = (h: number) => {
    const clamped = Math.max(0, Math.min(99, h));
    const newAbs = clamped * 60 + minutes;
    onChange(isNegative && newAbs !== 0 ? -newAbs : newAbs);
  };

  const handleMinutesChange = (m: number) => {
    const clamped = Math.max(0, Math.min(59, m));
    const newAbs = hours * 60 + clamped;
    onChange(isNegative && newAbs !== 0 ? -newAbs : newAbs);
  };

  const numberInputClass = [
    'w-full rounded-xl px-3 py-3 border-2',
    'text-lg font-mono font-bold text-center',
    'text-amber-600 dark:text-amber-400',
    'bg-white dark:bg-slate-800',
    'border-slate-200 dark:border-slate-700',
    'outline-none transition-all',
    'focus:border-amber-400 dark:focus:border-amber-500',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
  ].join(' ');

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={hoursId}
          className="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400"
        >
          {label}
        </label>
      )}
      <div className="flex items-end gap-2">
        <div className="flex flex-col items-center gap-0">
          <button
            type="button"
            onClick={handleToggleSign}
            disabled={disabled || value === 0}
            className={[
              'w-12 h-12 rounded-xl border-2 flex items-center justify-center',
              'text-2xl font-black transition-all active:scale-95',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              isNegative
                ? 'bg-red-50 dark:bg-red-900/40 border-red-300 dark:border-red-700 text-red-500 dark:text-red-400'
                : 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400',
            ].join(' ')}
            aria-label={isNegative ? 'Écart négatif' : 'Écart positif'}
          >
            {isNegative ? '−' : '+'}
          </button>
          <div className="h-5" />
        </div>

        <div className="flex-1 flex flex-col gap-0.5">
          <input
            id={hoursId}
            type="number"
            value={hours}
            onChange={(e) => handleHoursChange(Number(e.target.value))}
            disabled={disabled}
            min={0}
            max={99}
            className={numberInputClass}
            aria-label="Heures"
          />
          <span className="text-xs text-center text-slate-400 dark:text-slate-500">h</span>
        </div>

        <div className="flex flex-col items-center gap-0">
          <span className="h-12 flex items-center text-2xl font-black text-slate-400 dark:text-slate-500">:</span>
          <div className="h-5" />
        </div>

        <div className="flex-1 flex flex-col gap-0.5">
          <input
            type="number"
            value={String(minutes).padStart(2, '0')}
            onChange={(e) => handleMinutesChange(Number(e.target.value))}
            disabled={disabled}
            min={0}
            max={59}
            className={numberInputClass}
            aria-label="Minutes"
          />
          <span className="text-xs text-center text-slate-400 dark:text-slate-500">min</span>
        </div>
      </div>
    </div>
  );
}
