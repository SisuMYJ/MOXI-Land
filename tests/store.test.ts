import assert from 'node:assert/strict';
import test, { beforeEach } from 'node:test';
import { todayKey } from '../src/utils/date';
import { initialFarmItems } from '../src/content/farmItems';

const memoryStorage = {
  getItem: () => null,
  setItem: () => undefined,
};
Object.assign(globalThis, { localStorage: memoryStorage });

const { useGameStore } = await import('../src/store/useGameStore');

beforeEach(() => {
  useGameStore.setState((state) => ({
    ...state,
    stars: 20,
    moons: 20,
    inventory: [],
    farm: [],
    residents: state.residents.map((resident) => ({ ...resident, friendship: 0, giftedDate: undefined })),
    daily: { ...state.daily, date: todayKey(), shopItemIds: ['honey'] },
  }));
});

test('buyItem uses catalog price and preserves gift tags', () => {
  useGameStore.getState().buyItem('honey');
  const state = useGameStore.getState();
  assert.equal(state.stars, 18);
  assert.deepEqual(state.inventory[0].tags, ['honey', 'food']);
});

test('buyItem rejects items outside the daily lineup', () => {
  useGameStore.getState().buyItem('seed-pack');
  assert.equal(useGameStore.getState().stars, 20);
  assert.equal(useGameStore.getState().farm.length, 0);
});

test('favorite gifts grant the larger friendship increase', () => {
  useGameStore.getState().buyItem('honey');
  const giftId = useGameStore.getState().inventory[0].id;
  useGameStore.getState().giftResident('slow-bear', giftId);
  const bear = useGameStore.getState().residents.find((resident) => resident.id === 'slow-bear');
  assert.equal(bear?.friendship, 4);
  assert.equal(useGameStore.getState().inventory.length, 0);
});

test('farm purchases stop at the current capacity', () => {
  useGameStore.setState((state) => ({
    farm: Array.from({ length: 6 }, (_, index) => ({ ...initialFarmItems[0], id: `full-${index}` })),
    daily: { ...state.daily, shopItemIds: ['seed-pack'] },
  }));
  useGameStore.getState().buyItem('seed-pack');
  assert.equal(useGameStore.getState().farm.length, 6);
  assert.equal(useGameStore.getState().stars, 20);
});

test('failed exploration can be restarted without changing resident content', () => {
  useGameStore.setState((state) => ({
    stories: state.stories.map((story) =>
      story.zone === 'forest' ? { ...story, status: 'failed' as const, currentDay: 3, lastAdvancedDate: '2026-09-01' } : story,
    ),
  }));
  useGameStore.getState().restartStory('forest');
  const story = useGameStore.getState().stories.find((item) => item.zone === 'forest');
  assert.equal(story?.status, 'not_started');
  assert.equal(story?.currentDay, 0);
  assert.equal(story?.lastAdvancedDate, undefined);
});
