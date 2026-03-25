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
}

export default function TimeInput({
  value,
  onChange,
  label,
  min,
  max,
  disabled = false,
  error,
}: TimeInputProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-slate-300 uppercase tracking-wide"
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
          'bg-slate-900 text-white px-3 text-lg font-mono min-h-12',
          'border outline-none rounded-none',
          'transition-colors duration-150',
          'focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          error
            ? 'border-red-500 focus:border-red-400'
            : 'border-slate-700 focus:border-blue-500',
        ].join(' ')}
      />
      {error && (
        <span className="text-sm text-red-400">{error}</span>
      )}
    </div>
  );
}
