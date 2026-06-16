export function loadState<T>(key: string, fallback: T): T { try { const raw = localStorage.getItem(key); return raw ? { ...fallback, ...JSON.parse(raw) } : fallback; } catch { return fallback; } }
export function saveState<T>(key: string, value: T) { localStorage.setItem(key, JSON.stringify(value)); }
