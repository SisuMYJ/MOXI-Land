export const visualAssets = {
  residents: {
    'mist-cat': 'assets/generated/mist-cat.png',
    'foko-fox': 'assets/generated/foko-fox.png',
    'slow-bear': 'assets/generated/slow-bear.png',
    'dango-rabbit': 'assets/generated/dango-rabbit.png',
    'deer-lamp': 'assets/generated/deer-lamp.png',
  },
  buildings: {
    'task-cottage': 'assets/generated/task-cottage.png',
    'farm-plot': 'assets/generated/farm-plot.png',
    'lantern-shop': 'assets/generated/lantern-shop.png',
    'message-board': 'assets/generated/message-board.png',
    'forest-gate': 'assets/generated/forest-gate.png',
    'starlight-lake': 'assets/generated/starlight-lake.png',
  },
  environment: {
    'cloud-01': 'assets/generated/cloud-01.png',
    'cloud-02': 'assets/generated/cloud-02.png',
    'tree-01': 'assets/generated/tree-01.png',
  },
  npc: {
    'lumo': 'assets/generated/lumo.png',
  },
  reference: {
    'style-reference': 'assets/generated/style-reference.png',
  },
} as const;

export const visualAssetEntries = Object.values(visualAssets).flatMap((group) => Object.entries(group));
