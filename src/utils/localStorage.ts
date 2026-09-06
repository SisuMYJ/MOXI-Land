export const SAVE_SCHEMA_VERSION = 2;

type SaveEnvelope<T> = {
  schemaVersion: number;
  data: T;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export function loadState<T>(key: string, fallback: T): T {
  try {
    const serialized = localStorage.getItem(key);
    if (!serialized) return fallback;
    const parsed: unknown = JSON.parse(serialized);
    if (!isRecord(parsed)) return fallback;
    const candidate = isRecord(parsed.data) && typeof parsed.schemaVersion === 'number' ? parsed.data : parsed;
    return { ...fallback, ...candidate };
  } catch {
    return fallback;
  }
}

export function saveState<T>(key: string, value: T): boolean {
  try {
    const envelope: SaveEnvelope<T> = { schemaVersion: SAVE_SCHEMA_VERSION, data: value };
    localStorage.setItem(key, JSON.stringify(envelope));
    return true;
  } catch {
    return false;
  }
}
