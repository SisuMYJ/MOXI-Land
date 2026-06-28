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

const assetVersion = 'portrait-baseland-animal-garden-20260627-03';
const generatedUrl = (fileName: string) =>
  `https://raw.githubusercontent.com/SisuMYJ/MOXI-Land/main/public/assets/generated/${fileName}?v=${assetVersion}`;

const blockedNote = 'Generated assets must be cleaned, tightly cropped, scale-tested, and enabled one by one before scene rendering.';

const blocked = (asset: Omit<VisualAsset, 'status'>): VisualAsset => ({
  ...asset,
  status: 'blocked-checkerboard',
});

const usable = (asset: Omit<VisualAsset, 'status'>): VisualAsset => ({
  ...asset,
  status: 'usable',
});

export const visualAssets: Record<string, VisualAsset> = {
  // Portrait baseland owns the sky, ocean, island terrain, lake, paths, trees, flowers, and cliff edges.
  // It is rendered with its natural portrait ratio in IslandScene, not squeezed into a square.
  'baseland': usable({
    key: 'baseland-portrait-v1',
    path: generatedUrl('baseland-portrait.png'),
    scale: 1,
    origin: [0.5, 0.5],
    footprint: { w: 1440, h: 2520 },
    depthRule: 'manual',
  }),

  'task-cottage': usable({ key: 'task-cottage', path: generatedUrl('task-cottage.png'), scale: 1, origin: [0.5, 1], labelOffset: [0, 18], footprint: { w: 112, h: 111 }, depthRule: 'y' }),
  'message-board': usable({ key: 'message-board', path: generatedUrl('message-board.png'), scale: 1, origin: [0.5, 1], labelOffset: [0, 16], footprint: { w: 105, h: 110 }, depthRule: 'y' }),
  'farm-plot': usable({ key: 'farm-plot', path: generatedUrl('farm-plot.png'), scale: 1, origin: [0.5, 1], labelOffset: [0, 16], footprint: { w: 136, h: 101 }, depthRule: 'y' }),
  'lantern-shop': usable({ key: 'lantern-shop', path: generatedUrl('lantern-shop.png'), scale: 1, origin: [0.5, 1], labelOffset: [0, 16], footprint: { w: 118, h: 131 }, depthRule: 'y' }),
  'animal-garden': usable({ key: 'animal-garden', path: generatedUrl('animal-garden.png'), scale: 1, origin: [0.5, 1], labelOffset: [0, 14], footprint: { w: 126, h: 112 }, depthRule: 'y' }),
  'forest-gate': usable({ key: 'forest-gate', path: generatedUrl('forest-gate.png'), scale: 1, origin: [0.5, 1], labelOffset: [0, 0], footprint: { w: 150, h: 143 }, depthRule: 'manual' }),

  // Keep the standalone lake for future panels/details, not for the main island map.
  'starlight-lake': { key: 'starlight-lake', path: generatedUrl('starlight-lake.png'), scale: 1, origin: [0.5, 0.5], labelOffset: [0, 50], footprint: { w: 220, h: 120 }, depthRule: 'manual', status: 'reference-only' },

  // Residents are deliberately smaller than buildings. They should feel like visitors walking around, not map landmarks.
  'mist-cat': usable({ key: 'mist-cat', path: generatedUrl('mist-cat.png'), scale: 1, origin: [0.5, 1], footprint: { w: 42, h: 50 }, depthRule: 'y' }),
  'foko-fox': usable({ key: 'foko-fox', path: generatedUrl('foko-fox.png'), scale: 1, origin: [0.5, 1], footprint: { w: 42, h: 49 }, depthRule: 'y' }),
  'deer-lamp': usable({ key: 'deer-lamp', path: generatedUrl('deer-lamp.png'), scale: 1, origin: [0.5, 1], footprint: { w: 40, h: 52 }, depthRule: 'y' }),
  'slow-bear': usable({ key: 'slow-bear', path: generatedUrl('slow-bear.png'), scale: 1, origin: [0.5, 1], footprint: { w: 43, h: 50 }, depthRule: 'y' }),
  'dango-rabbit': usable({ key: 'dango-rabbit', path: generatedUrl('dango-rabbit.png'), scale: 1, origin: [0.5, 1], footprint: { w: 41, h: 52 }, depthRule: 'y' }),
  'lumo': { key: 'lumo', path: generatedUrl('lumo.png'), scale: 1, origin: [0.5, 1], footprint: { w: 56, h: 65 }, depthRule: 'manual', status: 'reference-only' },

  // These are cleaned, but the portrait baseland already carries most scenery. Keep them available for later scene polish.
  'cloud-01': { key: 'cloud-01', path: generatedUrl('cloud-01.png'), scale: 1, origin: [0.5, 0.5], footprint: { w: 180, h: 126 }, depthRule: 'manual', status: 'reference-only' },
  'cloud-02': { key: 'cloud-02', path: generatedUrl('cloud-02.png'), scale: 1, origin: [0.5, 0.5], footprint: { w: 170, h: 124 }, depthRule: 'manual', status: 'reference-only' },
  'tree-01': { key: 'tree-01', path: generatedUrl('tree-01.png'), scale: 1, origin: [0.5, 1], footprint: { w: 70, h: 86 }, depthRule: 'y', status: 'reference-only' },

  'style-reference': { key: 'style-reference', path: generatedUrl('style-reference.png'), scale: 1.0, origin: [0.5, 0.5], status: 'reference-only' },
};

export const visualAssetNote = blockedNote;
export const assetList = Object.values(visualAssets);
