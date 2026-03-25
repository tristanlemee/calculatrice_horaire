import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { TimeString, Minutes } from '@models';

interface ResultDisplayProps {
  label: string;
  time?: TimeString;
  gap?: Minutes;
  warnings?: string[];
}

function formatGap(gap: Minutes): string {
  if (gap === 0) return '00h00';
  const sign = gap > 0 ? '+' : '−';
  const abs = Math.abs(gap);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${h}h${String(m).padStart(2, '0')}`;
}

function GapIcon({ gap }: { gap: Minutes }) {
  if (gap === 0) return <CheckCircle2 size={16} className="text-emerald-500" />;
  if (gap > 0) return <AlertCircle size={16} className="text-amber-400" />;
  return <AlertCircle size={16} className="text-red-400" />;
}

function gapBadgeClass(gap: Minutes): string {
  if (gap === 0) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400';
  if (gap > 0) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
  return 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400';
}

function gapValueClass(gap: Minutes): string {
  if (gap === 0) return 'text-emerald-600 dark:text-emerald-400';
  if (gap > 0) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-500 dark:text-red-400';
}

export default function ResultDisplay({
  label,
  time,
  gap,
  warnings = [],
}: ResultDisplayProps) {
  const isGapMode = time === undefined;

  return (
    <div className="rounded-2xl p-5 border-2 bg-emerald-50 dark:bg-slate-800/80 border-emerald-200 dark:border-emerald-700/50">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
          {label}
        </span>
        {gap !== undefined && <GapIcon gap={gap} />}
      </div>

      {isGapMode ? (
        <span className={`text-4xl font-mono font-black tracking-tight ${gap !== undefined ? gapValueClass(gap) : 'text-slate-800 dark:text-white'}`}>
          {gap !== undefined ? formatGap(gap) : '––h––'}
        </span>
      ) : (
        <>
          <span className="text-4xl font-mono font-black tracking-tight text-slate-800 dark:text-white">
            {time || '––:––'}
          </span>
          {gap !== undefined && (
            <div className="mt-4">
              <span className={`inline-flex items-center rounded-xl px-3 py-2 text-sm font-mono font-bold ${gapBadgeClass(gap)}`}>
                {formatGap(gap)}
              </span>
            </div>
          )}
        </>
      )}

      {warnings.length > 0 && (
        <ul className="flex flex-col gap-1 mt-3">
          {warnings.map((w, i) => (
            <li key={i} className="text-xs text-amber-600 dark:text-amber-400">
              {w}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
