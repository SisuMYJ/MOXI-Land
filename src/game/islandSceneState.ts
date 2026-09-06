import type { IslandTile, Resident } from '../types/game';

export type IslandSceneState = {
  weather: string;
  islandTiles: IslandTile[];
  residents: Resident[];
};

