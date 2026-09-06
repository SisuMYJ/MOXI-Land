import assert from 'node:assert/strict';
import test from 'node:test';
import { loadState, SAVE_SCHEMA_VERSION, saveState } from '../src/utils/localStorage';

const createStorage = (initial?: string) => {
  let value = initial ?? null;
  return {
    getItem: () => value,
    setItem: (_key: string, next: string) => { value = next; },
    value: () => value,
  };
};

test('saveState writes a versioned envelope and loadState reads it', () => {
  const storage = createStorage();
  Object.assign(globalThis, { localStorage: storage });
  assert.equal(saveState('save', { stars: 7 }), true);
  assert.equal(JSON.parse(storage.value()!).schemaVersion, SAVE_SCHEMA_VERSION);
  assert.deepEqual(loadState('save', { stars: 0, moons: 2 }), { stars: 7, moons: 2 });
});

test('loadState accepts legacy saves and safely rejects corrupt data', () => {
  Object.assign(globalThis, { localStorage: createStorage(JSON.stringify({ stars: 5 })) });
  assert.deepEqual(loadState('save', { stars: 0, moons: 2 }), { stars: 5, moons: 2 });
  Object.assign(globalThis, { localStorage: createStorage('{broken') });
  assert.deepEqual(loadState('save', { stars: 0 }), { stars: 0 });
});

test('saveState reports storage failures instead of throwing', () => {
  Object.assign(globalThis, { localStorage: { getItem: () => null, setItem: () => { throw new Error('quota'); } } });
  assert.equal(saveState('save', { stars: 1 }), false);
});

