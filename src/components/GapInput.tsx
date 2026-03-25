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

  const inputClass = [
    'bg-slate-900 text-white text-lg font-mono px-2 w-16 min-h-12',
    'border border-slate-700 outline-none rounded-none',
    'focus:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/40',
    'transition-colors duration-150',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
  ].join(' ');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={hoursId}
          className="text-sm font-medium text-slate-300 uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleSign}
          disabled={disabled || value === 0}
          className={[
            'w-12 min-h-12 text-lg font-bold border outline-none rounded-none',
            'transition-colors duration-150',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            isNegative
              ? 'bg-red-900/40 border-red-600 text-red-400 hover:bg-red-900/60'
              : 'bg-blue-900/40 border-blue-600 text-blue-400 hover:bg-blue-900/60',
          ].join(' ')}
          aria-label={isNegative ? 'Écart négatif' : 'Écart positif'}
        >
          {isNegative ? '−' : '+'}
        </button>
        <input
          id={hoursId}
          type="number"
          value={hours}
          onChange={(e) => handleHoursChange(Number(e.target.value))}
          disabled={disabled}
          min={0}
          max={99}
          className={inputClass}
          aria-label="Heures"
        />
        <span className="text-slate-400 font-mono text-lg">h</span>
        <input
          type="number"
          value={String(minutes).padStart(2, '0')}
          onChange={(e) => handleMinutesChange(Number(e.target.value))}
          disabled={disabled}
          min={0}
          max={59}
          className={inputClass}
          aria-label="Minutes"
        />
        <span className="text-slate-400 font-mono text-lg">min</span>
      </div>
    </div>
  );
}
