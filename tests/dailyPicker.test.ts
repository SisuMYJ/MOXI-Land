import assert from 'node:assert/strict';
import test from 'node:test';
import { pickDailyItem, pickDailyItems } from '../src/game/systems/dailyPicker';

const items = Array.from({ length: 8 }, (_, index) => ({ id: `item-${index}` }));

test('daily selection is stable for a date and namespace', () => {
  const options = { count: 4, namespace: 'shop', date: '2026-09-06' };
  assert.deepEqual(pickDailyItems(items, options), pickDailyItems(items, options));
});

test('daily selection returns unique items and respects count', () => {
  const selected = pickDailyItems(items, { count: 4, namespace: 'shop', date: '2026-09-06' });
  assert.equal(selected.length, 4);
  assert.equal(new Set(selected.map((item) => item.id)).size, 4);
  assert.equal(pickDailyItem([], { namespace: 'empty', date: '2026-09-06' }), undefined);
});

