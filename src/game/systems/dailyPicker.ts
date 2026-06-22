export const hashSeed = (value: string) =>
  value.split('').reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 2166136261);

export const seededIndex = (seed: string, length: number) => (length <= 0 ? 0 : hashSeed(seed) % length);

export const pickDailyOne = <T>(items: T[], seed: string): T | undefined => items[seededIndex(seed, items.length)];

export const pickDailyMany = <T extends { id: string }>(items: T[], count: number, seed: string): T[] => {
  const ranked = [...items].sort((a, b) => hashSeed(`${seed}:${a.id}`) - hashSeed(`${seed}:${b.id}`));
  return ranked.slice(0, Math.max(0, Math.min(count, ranked.length)));
};
