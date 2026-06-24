import type { IslandTile } from '../types/game';

export const islandTiles: IslandTile[] = [
  {
    id: 'center-main',
    name: '主岛',
    status: 'unlocked',
    kind: 'main',
    position: { x: 270, y: 340 },
    description: '当前的主岛核心，承载任务小屋与日常活动。',
  },
  {
    id: 'forest-deep',
    name: '森林深处',
    status: 'locked',
    kind: 'forest',
    position: { x: 90, y: 205 },
    unlockCost: { currency: 'star', amount: 8 },
    description: '通向更深的林间路径，等待新的探险线索。',
  },
  {
    id: 'flower-garden',
    name: '花园区',
    status: 'locked',
    kind: 'garden',
    position: { x: 450, y: 150 },
    unlockCost: { currency: 'star', amount: 12 },
    description: '未来会种下盛开的花田与休息小径。',
  },
  {
    id: 'second-farm',
    name: '新农场',
    status: 'locked',
    kind: 'farm',
    position: { x: 440, y: 500 },
    unlockCost: { currency: 'moon', amount: 4 },
    description: '新的耕作区域，可扩展更多作物与动物。',
  },
  {
    id: 'resident-house',
    name: '居民屋',
    status: 'locked',
    kind: 'resident',
    position: { x: 120, y: 450 },
    unlockCost: { currency: 'moon', amount: 5 },
    description: '欢迎新居民入住，未来可增加聚会与日常互动。',
  },
  {
    id: 'festival-market',
    name: '节日集市',
    status: 'locked',
    kind: 'festival',
    position: { x: 260, y: 650 },
    unlockCost: { currency: 'star', amount: 15 },
    description: '节日场景的占位地块，后续可接入集市活动。',
  },
];

export default islandTiles;
