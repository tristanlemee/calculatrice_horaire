import { useState } from 'react';
import { SettingsProvider } from '@contexts/SettingsContext';
import Header from '@components/Header';
import Calculator from '@components/Calculator';
import SettingsPanel from '@components/SettingsPanel';

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <SettingsProvider>
      <div
        className="min-h-screen bg-slate-950 text-white flex flex-col font-sans"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <Header onSettingsOpen={() => setSettingsOpen(true)} />
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-lg">
            <Calculator />
          </div>
        </main>
        <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </SettingsProvider>
  );
}
