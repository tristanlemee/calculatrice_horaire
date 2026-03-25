import { useId } from 'react';
import type { TimeString } from '@models';

interface TimeInputProps {
  value: TimeString;
  onChange: (value: TimeString) => void;
  label: string;
  min?: TimeString;
  max?: TimeString;
  disabled?: boolean;
  error?: string;
  hint?: string;
}

export default function TimeInput({
  value,
  onChange,
  label,
  min,
  max,
  disabled = false,
  error,
  hint,
}: TimeInputProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400"
      >
        {label}
      </label>
      <input
        id={id}
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        disabled={disabled}
        className={[
          'rounded-xl px-4 py-3 border-2 w-full',
          'text-lg font-mono font-bold tracking-wider',
          'text-slate-800 dark:text-white',
          'bg-white dark:bg-slate-800',
          'outline-none transition-all',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          error
            ? 'border-red-300 dark:border-red-700'
            : 'border-slate-200 dark:border-slate-700 focus:border-blue-400 dark:focus:border-blue-500',
        ].join(' ')}
      />
      {hint && !error && (
        <span className="text-xs text-slate-400 dark:text-slate-500">{hint}</span>
      )}
      {error && (
        <span className="text-xs text-red-500 dark:text-red-400">{error}</span>
      )}
    </div>
  );
}
