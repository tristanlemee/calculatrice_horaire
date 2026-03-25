import { Settings } from 'lucide-react';

interface HeaderProps {
  onSettingsOpen: () => void;
}

export default function Header({ onSettingsOpen }: HeaderProps) {
  return (
    <header className="shrink-0">
      <div className="flex items-center justify-between px-4 py-4">
        <h1 className="text-white font-bold text-xl tracking-widest uppercase">
          Pointeuse
        </h1>
        <button
          type="button"
          onClick={onSettingsOpen}
          aria-label="Ouvrir les paramètres"
          className="text-slate-400 hover:text-white transition-colors duration-150 p-1 rounded-none"
        >
          <Settings size={22} />
        </button>
      </div>
      <div className="h-px bg-blue-600" />
    </header>
  );
}
