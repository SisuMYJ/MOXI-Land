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

const blockedNote = 'Disabled for now: generated PNG assets need real transparent alpha, tight crop, and consistent scale before scene rendering.';

const blocked = (asset: Omit<VisualAsset, 'status'>): VisualAsset => ({
  ...asset,
  status: 'blocked-checkerboard',
});

export const visualAssets: Record<string, VisualAsset> = {
  // Baseland is the only generated PNG currently allowed into the scene.
  // Keep every other generated PNG blocked until it is cleaned and scale-tested one by one.
  'baseland': {
    key: 'baseland',
    path: 'https://raw.githubusercontent.com/SisuMYJ/MOXI-Land/main/public/assets/generated/baseland_clean_cropped.png',
    scale: 1,
    origin: [0.5, 0.5],
    footprint: { w: 520, h: 520 },
    depthRule: 'manual',
    status: 'usable',
  },

  'cloud-01': blocked({ key: 'cloud-01', path: 'assets/generated/cloud-01.png', scale: 0.7, origin: [0.5, 0.5] }),
  'cloud-02': blocked({ key: 'cloud-02', path: 'assets/generated/cloud-02.png', scale: 0.7, origin: [0.5, 0.5] }),

  'task-cottage': blocked({ key: 'task-cottage', path: 'assets/generated/task-cottage.png', scale: 0.9, origin: [0.5, 0.9], labelOffset: [0, 40], footprint: { w: 140, h: 120 }, depthRule: 'y' }),
  'farm-plot': blocked({ key: 'farm-plot', path: 'assets/generated/farm-plot.png', scale: 0.9, origin: [0.5, 0.9], labelOffset: [0, 36], footprint: { w: 160, h: 100 }, depthRule: 'y' }),
  'lantern-shop': blocked({ key: 'lantern-shop', path: 'assets/generated/lantern-shop.png', scale: 0.9, origin: [0.5, 0.9], labelOffset: [0, 40], footprint: { w: 140, h: 120 }, depthRule: 'y' }),
  'message-board': blocked({ key: 'message-board', path: 'assets/generated/message-board.png', scale: 0.9, origin: [0.5, 0.9], labelOffset: [0, 36], footprint: { w: 120, h: 100 }, depthRule: 'y' }),
  'forest-gate': blocked({ key: 'forest-gate', path: 'assets/generated/forest-gate.png', scale: 1.0, origin: [0.5, 0.9], labelOffset: [0, 0], footprint: { w: 180, h: 90 }, depthRule: 'manual' }),
  'starlight-lake': blocked({ key: 'starlight-lake', path: 'assets/generated/starlight-lake.png', scale: 1.0, origin: [0.5, 0.5], labelOffset: [0, 50], footprint: { w: 220, h: 120 }, depthRule: 'manual' }),

  'tree-01': blocked({ key: 'tree-01', path: 'assets/generated/tree-01.png', scale: 0.8, origin: [0.5, 1.0], footprint: { w: 80, h: 120 }, depthRule: 'y' }),

  'mist-cat': blocked({ key: 'mist-cat', path: 'assets/generated/mist-cat.png', scale: 0.5, origin: [0.5, 1.0], footprint: { w: 56, h: 64 }, depthRule: 'y' }),
  'foko-fox': blocked({ key: 'foko-fox', path: 'assets/generated/foko-fox.png', scale: 0.5, origin: [0.5, 1.0], footprint: { w: 56, h: 64 }, depthRule: 'y' }),
  'deer-lamp': blocked({ key: 'deer-lamp', path: 'assets/generated/deer-lamp.png', scale: 0.6, origin: [0.5, 1.0], footprint: { w: 64, h: 72 }, depthRule: 'y' }),
  'slow-bear': blocked({ key: 'slow-bear', path: 'assets/generated/slow-bear.png', scale: 0.5, origin: [0.5, 1.0], footprint: { w: 56, h: 64 }, depthRule: 'y' }),
  'dango-rabbit': blocked({ key: 'dango-rabbit', path: 'assets/generated/dango-rabbit.png', scale: 0.5, origin: [0.5, 1.0], footprint: { w: 56, h: 64 }, depthRule: 'y' }),

  'lumo': { key: 'lumo', path: 'assets/generated/lumo.png', scale: 0.45, origin: [0.5, 1.0], footprint: { w: 40, h: 48 }, depthRule: 'manual', status: 'reference-only' },
  'style-reference': { key: 'style-reference', path: 'assets/generated/style-reference.png', scale: 1.0, origin: [0.5, 0.5], status: 'reference-only' },
};

export const visualAssetNote = blockedNote;
export const assetList = Object.values(visualAssets);
