import { AlertTriangle } from 'lucide-react';
import type { TimeString, Minutes } from '@models';

interface ResultDisplayProps {
  label: string;
  time?: TimeString;
  gap?: Minutes;
  warnings?: string[];
}

function formatGap(gap: Minutes): string {
  const abs = Math.abs(gap);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const sign = gap > 0 ? '+' : gap < 0 ? '−' : '';
  return `${sign}${h}h${String(m).padStart(2, '0')}`;
}

function gapColorClass(gap: Minutes): string {
  if (gap > 0) return 'text-blue-400';
  if (gap < 0) return 'text-red-400';
  return 'text-white';
}

export default function ResultDisplay({
  label,
  time,
  gap,
  warnings = [],
}: ResultDisplayProps) {
  return (
    <div className="flex flex-col gap-3 border border-slate-700 bg-slate-900/50 p-4">
      <span className="text-sm font-medium text-slate-400 uppercase tracking-wide">
        {label}
      </span>

      {time !== undefined && (
        <span className="text-5xl font-mono font-bold text-white tracking-tight">
          {time || '––:––'}
        </span>
      )}

      {gap !== undefined && (
        <span className={`text-2xl font-mono font-semibold ${gapColorClass(gap)}`}>
          {formatGap(gap)}
        </span>
      )}

      {warnings.length > 0 && (
        <ul className="flex flex-col gap-1 mt-1">
          {warnings.map((w, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-red-400">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-500" />
              <span>{w}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
