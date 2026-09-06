import assert from 'node:assert/strict';
import test from 'node:test';
import { BASE_FARM_CAPACITY, farmCapacityForTiles, SECOND_FARM_CAPACITY_BONUS } from '../src/game/systems/farmSystem';
import { islandTiles } from '../src/content/islandTiles';

test('unlocking the second farm adds capacity', () => {
  assert.equal(farmCapacityForTiles(islandTiles), BASE_FARM_CAPACITY);
  const unlocked = islandTiles.map((tile) => tile.id === 'second-farm' ? { ...tile, status: 'unlocked' as const } : tile);
  assert.equal(farmCapacityForTiles(unlocked), BASE_FARM_CAPACITY + SECOND_FARM_CAPACITY_BONUS);
});

