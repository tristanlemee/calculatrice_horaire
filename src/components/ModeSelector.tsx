import type { CalculationMode } from '@models';

interface ModeSelectorProps {
  mode: CalculationMode;
  onChange: (mode: CalculationMode) => void;
}

const MODES: { value: CalculationMode; label: string }[] = [
  { value: 'arrival-to-departure', label: 'Arrivée → Départ' },
  { value: 'departure-to-arrival', label: 'Départ → Arrivée' },
  { value: 'both-to-gap', label: 'Vérifier écart' },
];

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="flex w-full">
      {MODES.map(({ value, label }) => {
        const isActive = mode === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={[
              'flex-1 px-2 py-3 text-sm font-medium text-center min-h-12',
              'border-b-2 outline-none rounded-none',
              'transition-colors duration-150',
              isActive
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200',
            ].join(' ')}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
