import { ArrowRight, ArrowLeft, Calculator } from 'lucide-react';
import type { CalculationMode } from '@models';

interface ModeSelectorProps {
  mode: CalculationMode;
  onChange: (mode: CalculationMode) => void;
}

const MODES: { value: CalculationMode; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { value: 'arrival-to-departure', label: 'Arrivée', Icon: ArrowRight },
  { value: 'departure-to-arrival', label: 'Départ', Icon: ArrowLeft },
  { value: 'both-to-gap', label: 'Écart', Icon: Calculator },
];

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-1 rounded-2xl p-2 bg-slate-200/70 dark:bg-slate-800 mb-6">
      {MODES.map(({ value, label, Icon }) => {
        const isActive = mode === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={[
              'flex-1 flex flex-col items-center gap-1.5 rounded-xl py-3 transition-all',
              'text-xs font-bold tracking-wide outline-none',
              isActive
                ? 'bg-blue-500 text-white dark:bg-blue-500/20 dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400',
            ].join(' ')}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
