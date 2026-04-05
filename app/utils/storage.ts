import type { Alert } from '~/store/alertesApi';

export interface SearchHistory {
  queries: string[];
}

export interface ViewedAlert {
  alerte: Alert;
  viewedAt: string;
}

export interface ViewedAlertHistory {
  alerts: ViewedAlert[];
}

export type ThemeMode = 'system' | 'light' | 'dark';

export const STORAGE_KEYS = {
  SEARCH_HISTORY: 'search_history',
  ALERT_HISTORY: 'alert_history',
  THEME_MODE: 'theme_mode'
} as const;

export const getThemeMode = (): ThemeMode => {
  try {
    const value = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
    if (value === 'light' || value === 'dark') {
      return value;
    }
  } catch { /* ignore */ }
  return 'system';
};

export const saveThemeMode = (mode: ThemeMode) => {
  localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
};

export const getSearchHistory = (): string[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveSearchQuery = (query: string) => {
  const history = getSearchHistory();
  const newHistory = [query, ...history.filter((q) => q !== query)].slice(0, 5);
  localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newHistory));
};

export const getViewedAlerts = (): ViewedAlert[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ALERT_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveViewedAlert = (alerte: Alert) => {
  const history = getViewedAlerts();
  const newEntry: ViewedAlert = { alerte, viewedAt: new Date().toISOString() };

  const newHistory = [
    newEntry,
    ...history.filter((h) => h.alerte.alertNumber !== alerte.alertNumber)
  ].slice(0, 15);

  localStorage.setItem(STORAGE_KEYS.ALERT_HISTORY, JSON.stringify(newHistory));
};

export const removeViewedAlert = (alertNumber: string) => {
  const history = getViewedAlerts();
  const newHistory = history.filter((h) => h.alerte.alertNumber !== alertNumber);
  localStorage.setItem(STORAGE_KEYS.ALERT_HISTORY, JSON.stringify(newHistory));
};
