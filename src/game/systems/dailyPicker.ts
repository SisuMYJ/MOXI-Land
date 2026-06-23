import { todayKey } from '../../utils/date';

const hashString = (value: string): number => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const seededScore = (seed: string, id: string): number => hashString(`${seed}:${id}`);

export const dailySeed = (namespace: string, date = todayKey()): string => `${date}:${namespace}`;

export const pickDailyItems = <T extends { id: string }>(items: T[], options: { count: number; namespace: string; date?: string }): T[] => {
  const seed = dailySeed(options.namespace, options.date);
  return [...items]
    .sort((a, b) => seededScore(seed, a.id) - seededScore(seed, b.id))
    .slice(0, Math.min(options.count, items.length));
};

export const pickDailyItem = <T extends { id: string }>(items: T[], options: { namespace: string; date?: string }): T | undefined =>
  pickDailyItems(items, { ...options, count: 1 })[0];
