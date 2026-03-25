import { useState } from 'react';
import { SettingsProvider } from '@contexts/SettingsContext';
import Header from '@components/Header';
import Calculator from '@components/Calculator';
import SettingsPanel from '@components/SettingsPanel';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <SettingsProvider>
      <div
        className={`${isDark ? 'dark' : ''} min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white flex flex-col font-sans transition-colors duration-300`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Header
          onSettingsOpen={() => setSettingsOpen(true)}
          onThemeToggle={() => setIsDark(d => !d)}
          isDark={isDark}
        />
        <main className="flex-1 px-5 pb-8">
          <Calculator />
        </main>
        <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </SettingsProvider>
  );
}
