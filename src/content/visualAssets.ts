export type VisualAsset = {
  key: string;
  path: string;
  x?: number;
  y?: number;
  scale?: number;
  origin?: [number, number];
  labelOffset?: [number, number];
  footprint?: { w: number; h: number };
  depthRule?: 'y' | 'manual';
  status: 'usable' | 'blocked-checkerboard' | 'reference-only';
};

export const visualAssets: Record<string, VisualAsset> = {
  'cloud-01': { key: 'cloud-01', path: 'assets/generated/cloud-01.png', scale: 0.7, origin: [0.5, 0.5], status: 'usable' },
  'cloud-02': { key: 'cloud-02', path: 'assets/generated/cloud-02.png', scale: 0.7, origin: [0.5, 0.5], status: 'usable' },

  'task-cottage': { key: 'task-cottage', path: 'assets/generated/task-cottage.png', scale: 0.9, origin: [0.5, 0.9], labelOffset: [0, 40], footprint: { w: 140, h: 120 }, depthRule: 'y', status: 'usable' },
  'farm-plot': { key: 'farm-plot', path: 'assets/generated/farm-plot.png', scale: 0.9, origin: [0.5, 0.9], labelOffset: [0, 36], footprint: { w: 160, h: 100 }, depthRule: 'y', status: 'usable' },
  'lantern-shop': { key: 'lantern-shop', path: 'assets/generated/lantern-shop.png', scale: 0.9, origin: [0.5, 0.9], labelOffset: [0, 40], footprint: { w: 140, h: 120 }, depthRule: 'y', status: 'usable' },
  'message-board': { key: 'message-board', path: 'assets/generated/message-board.png', scale: 0.9, origin: [0.5, 0.9], labelOffset: [0, 36], footprint: { w: 120, h: 100 }, depthRule: 'y', status: 'usable' },
  'forest-gate': { key: 'forest-gate', path: 'assets/generated/forest-gate.png', scale: 1.0, origin: [0.5, 0.9], labelOffset: [0, 0], footprint: { w: 180, h: 90 }, depthRule: 'manual', status: 'usable' },
  'starlight-lake': { key: 'starlight-lake', path: 'assets/generated/starlight-lake.png', scale: 1.0, origin: [0.5, 0.5], labelOffset: [0, 50], footprint: { w: 220, h: 120 }, depthRule: 'manual', status: 'usable' },

  'tree-01': { key: 'tree-01', path: 'assets/generated/tree-01.png', scale: 0.8, origin: [0.5, 1.0], footprint: { w: 80, h: 120 }, depthRule: 'y', status: 'usable' },

  'mist-cat': { key: 'mist-cat', path: 'assets/generated/mist-cat.png', scale: 0.5, origin: [0.5, 1.0], footprint: { w: 56, h: 64 }, depthRule: 'y', status: 'usable' },
  'foko-fox': { key: 'foko-fox', path: 'assets/generated/foko-fox.png', scale: 0.5, origin: [0.5, 1.0], footprint: { w: 56, h: 64 }, depthRule: 'y', status: 'usable' },
  'deer-lamp': { key: 'deer-lamp', path: 'assets/generated/deer-lamp.png', scale: 0.6, origin: [0.5, 1.0], footprint: { w: 64, h: 72 }, depthRule: 'y', status: 'usable' },
  'slow-bear': { key: 'slow-bear', path: 'assets/generated/slow-bear.png', scale: 0.5, origin: [0.5, 1.0], footprint: { w: 56, h: 64 }, depthRule: 'y', status: 'usable' },
  'dango-rabbit': { key: 'dango-rabbit', path: 'assets/generated/dango-rabbit.png', scale: 0.5, origin: [0.5, 1.0], footprint: { w: 56, h: 64 }, depthRule: 'y', status: 'usable' },

  'lumo': { key: 'lumo', path: 'assets/generated/lumo.png', scale: 0.45, origin: [0.5, 1.0], footprint: { w: 40, h: 48 }, depthRule: 'manual', status: 'reference-only' },
  'style-reference': { key: 'style-reference', path: 'assets/generated/style-reference.png', scale: 1.0, origin: [0.5, 0.5], status: 'reference-only' },
};

export const assetList = Object.values(visualAssets);
