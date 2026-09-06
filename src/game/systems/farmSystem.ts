import type { IslandTile, ShopItem } from '../../types/game';

export const BASE_FARM_CAPACITY = 6;
export const SECOND_FARM_CAPACITY_BONUS = 6;

export const farmCapacityForTiles = (tiles: IslandTile[]) =>
  BASE_FARM_CAPACITY +
  (tiles.some((tile) => tile.id === 'second-farm' && tile.status === 'unlocked') ? SECOND_FARM_CAPACITY_BONUS : 0);

export const isFarmShopItem = (item: ShopItem) => ['seed', 'fish', 'animal'].includes(item.category);

