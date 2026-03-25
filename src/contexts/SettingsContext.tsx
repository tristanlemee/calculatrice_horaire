import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { DEFAULT_SETTINGS, type Settings } from '@models/settings';

const STORAGE_KEY = 'pointeuse_settings';

function isValidSettings(value: unknown): value is Settings {
  if (!value || typeof value !== 'object') return false;
  const s = value as Record<string, unknown>;
  return (
    typeof s.lunchBreakMinutes === 'number' &&
    typeof s.workDayMinutes === 'number' &&
    s.arrivalRange !== null &&
    typeof s.arrivalRange === 'object' &&
    typeof (s.arrivalRange as Record<string, unknown>).start === 'string' &&
    typeof (s.arrivalRange as Record<string, unknown>).end === 'string' &&
    s.departureRange !== null &&
    typeof s.departureRange === 'object' &&
    typeof (s.departureRange as Record<string, unknown>).start === 'string' &&
    typeof (s.departureRange as Record<string, unknown>).end === 'string'
  );
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed: unknown = JSON.parse(raw);
    return isValidSettings(parsed) ? parsed : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  function updateSettings(partial: Partial<Settings>) {
    setSettings(prev => ({ ...prev, ...partial }));
  }

  function resetSettings() {
    setSettings(DEFAULT_SETTINGS);
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings doit être utilisé dans un SettingsProvider');
  return ctx;
}
