import { Clock, Sun, Moon, Settings } from 'lucide-react';

interface HeaderProps {
  onSettingsOpen: () => void;
  onThemeToggle: () => void;
  isDark: boolean;
}

export default function Header({ onSettingsOpen, onThemeToggle, isDark }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-10 pb-4 px-5 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md"
      style={{ paddingTop: 'max(env(safe-area-inset-top), 3rem)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
            <Clock size={18} className="text-blue-400" />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight leading-none text-slate-800 dark:text-white">
              Pointeuse
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Calcul horaire
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onThemeToggle}
            aria-label="Changer de thème"
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
          >
            {isDark ? (
              <Sun size={16} className="text-amber-400" />
            ) : (
              <Moon size={16} className="text-slate-600" />
            )}
          </button>
          <button
            type="button"
            onClick={onSettingsOpen}
            aria-label="Ouvrir les paramètres"
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
          >
            <Settings size={16} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
