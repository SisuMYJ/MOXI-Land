export type VisualAssetStatus = 'usable' | 'blocked-checkerboard' | 'reference-only';

export type VisualObjectManifest = {
  key: string;
  imagePath: string;
  x: number;
  y: number;
  scale: number;
  origin: { x: number; y: number };
  labelOffset: { x: number; y: number };
  interactionFootprint: { width: number; height: number; offsetY?: number };
  depthRule: 'y' | 'fixed-background' | 'fixed-foreground';
  status: VisualAssetStatus;
  note?: string;
};

const bakedCheckerboardNote = 'Blocked from scene rendering: generated PNG contains a baked checkerboard transparency preview and needs regeneration with a true transparent alpha channel.';

export const problematicVisualAssets = [
  'cloud-01.png',
  'cloud-02.png',
  'dango-rabbit.png',
  'deer-lamp.png',
  'farm-plot.png',
  'foko-fox.png',
  'forest-gate.png',
  'lantern-shop.png',
  'lumo.png',
  'message-board.png',
  'mist-cat.png',
  'slow-bear.png',
  'starlight-lake.png',
  'task-cottage.png',
  'tree-01.png',
] as const;

export const visualAssetAudit = problematicVisualAssets.map((fileName) => ({
  fileName,
  status: 'blocked-checkerboard' as const,
  note: bakedCheckerboardNote,
}));

export const styleReferenceAsset = {
  fileName: 'style-reference.png',
  status: 'reference-only' as const,
  note: 'Reference sheet only; do not render as an in-game object.',
};

export const visualObjects: Record<string, VisualObjectManifest> = {
  taskCottage: {
    key: 'task-cottage',
    imagePath: '/assets/generated/task-cottage.png',
    x: 270,
    y: 360,
    scale: 0.18,
    origin: { x: 0.5, y: 0.88 },
    labelOffset: { x: 0, y: 18 },
    interactionFootprint: { width: 112, height: 100, offsetY: -34 },
    depthRule: 'y',
    status: 'blocked-checkerboard',
    note: bakedCheckerboardNote,
  },
  messageBoard: {
    key: 'message-board',
    imagePath: '/assets/generated/message-board.png',
    x: 150,
    y: 270,
    scale: 0.13,
    origin: { x: 0.5, y: 0.9 },
    labelOffset: { x: 0, y: 16 },
    interactionFootprint: { width: 96, height: 88, offsetY: -28 },
    depthRule: 'y',
    status: 'blocked-checkerboard',
    note: bakedCheckerboardNote,
  },
  farmPlot: {
    key: 'farm-plot',
    imagePath: '/assets/generated/farm-plot.png',
    x: 392,
    y: 320,
    scale: 0.16,
    origin: { x: 0.5, y: 0.86 },
    labelOffset: { x: 0, y: 18 },
    interactionFootprint: { width: 128, height: 96, offsetY: -24 },
    depthRule: 'y',
    status: 'blocked-checkerboard',
    note: bakedCheckerboardNote,
  },
  lanternShop: {
    key: 'lantern-shop',
    imagePath: '/assets/generated/lantern-shop.png',
    x: 390,
    y: 548,
    scale: 0.16,
    origin: { x: 0.5, y: 0.88 },
    labelOffset: { x: 0, y: 18 },
    interactionFootprint: { width: 116, height: 100, offsetY: -34 },
    depthRule: 'y',
    status: 'blocked-checkerboard',
    note: bakedCheckerboardNote,
  },
  forestGate: {
    key: 'forest-gate',
    imagePath: '/assets/generated/forest-gate.png',
    x: 270,
    y: 148,
    scale: 0.16,
    origin: { x: 0.5, y: 0.9 },
    labelOffset: { x: 0, y: 18 },
    interactionFootprint: { width: 148, height: 86, offsetY: -26 },
    depthRule: 'y',
    status: 'blocked-checkerboard',
    note: bakedCheckerboardNote,
  },
  starlightLake: {
    key: 'starlight-lake',
    imagePath: '/assets/generated/starlight-lake.png',
    x: 270,
    y: 690,
    scale: 0.2,
    origin: { x: 0.5, y: 0.75 },
    labelOffset: { x: 0, y: 6 },
    interactionFootprint: { width: 210, height: 88, offsetY: -12 },
    depthRule: 'fixed-background',
    status: 'blocked-checkerboard',
    note: bakedCheckerboardNote,
  },
  mistCat: {
    key: 'mist-cat',
    imagePath: '/assets/generated/mist-cat.png',
    x: 190,
    y: 390,
    scale: 0.09,
    origin: { x: 0.5, y: 0.92 },
    labelOffset: { x: 0, y: 14 },
    interactionFootprint: { width: 60, height: 72, offsetY: -28 },
    depthRule: 'y',
    status: 'blocked-checkerboard',
    note: bakedCheckerboardNote,
  },
  fokoFox: {
    key: 'foko-fox',
    imagePath: '/assets/generated/foko-fox.png',
    x: 285,
    y: 185,
    scale: 0.09,
    origin: { x: 0.5, y: 0.92 },
    labelOffset: { x: 0, y: 14 },
    interactionFootprint: { width: 60, height: 72, offsetY: -28 },
    depthRule: 'y',
    status: 'blocked-checkerboard',
    note: bakedCheckerboardNote,
  },
  deerLamp: {
    key: 'deer-lamp',
    imagePath: '/assets/generated/deer-lamp.png',
    x: 455,
    y: 290,
    scale: 0.09,
    origin: { x: 0.5, y: 0.92 },
    labelOffset: { x: 0, y: 14 },
    interactionFootprint: { width: 60, height: 72, offsetY: -28 },
    depthRule: 'y',
    status: 'blocked-checkerboard',
    note: bakedCheckerboardNote,
  },
  slowBear: {
    key: 'slow-bear',
    imagePath: '/assets/generated/slow-bear.png',
    x: 185,
    y: 560,
    scale: 0.09,
    origin: { x: 0.5, y: 0.92 },
    labelOffset: { x: 0, y: 14 },
    interactionFootprint: { width: 60, height: 72, offsetY: -28 },
    depthRule: 'y',
    status: 'blocked-checkerboard',
    note: bakedCheckerboardNote,
  },
  dangoRabbit: {
    key: 'dango-rabbit',
    imagePath: '/assets/generated/dango-rabbit.png',
    x: 420,
    y: 560,
    scale: 0.09,
    origin: { x: 0.5, y: 0.92 },
    labelOffset: { x: 0, y: 14 },
    interactionFootprint: { width: 60, height: 72, offsetY: -28 },
    depthRule: 'y',
    status: 'blocked-checkerboard',
    note: bakedCheckerboardNote,
  },
};

export const usableVisualObjects = Object.values(visualObjects).filter((asset) => asset.status === 'usable');
