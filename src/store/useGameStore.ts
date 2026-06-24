import { create } from 'zustand';
import { boardMessages } from '../content/boardMessages';
import { initialFarmItems } from '../content/farmItems';
import { explorationStories } from '../content/explorationStories';
import { lumoLines } from '../content/lumoLines';
import { residents as residentConfig } from '../content/residents';
import { shopItems } from '../content/shopItems';
import { tasks as taskConfig } from '../content/tasks';
import { weatherOptions } from '../content/weather';
import { pickDailyItem, pickDailyItems } from '../game/systems/dailyPicker';
import type { Currency, DailyState, ExplorationStory, FarmItem, Panel, Resident, ShopItem, Task, InventoryItem } from '../types/game';
import { todayKey } from '../utils/date';
import { loadState, saveState } from '../utils/localStorage';

type BoardState = { date: string; message?: string; messages: string[]; viewed: boolean };
type StateActions = Pick<State, 'openPanel' | 'closePanel' | 'completeTask' | 'buyItem' | 'careFarm' | 'sellProduce' | 'viewBoard' | 'chatResident' | 'giftResident' | 'advanceStory' | 'notify'>;

type State = {
  stars: number;
  moons: number;
  tasks: Task[];
  farm: FarmItem[];
  residents: Resident[];
  inventory: InventoryItem[];
  stories: ExplorationStory[];
  daily: DailyState;
  activePanel: Panel;
  selectedResidentId?: string;
  weather: string;
  board?: BoardState;
  toast?: string;
  openPanel: (p: Panel, id?: string) => void;
  closePanel: () => void;
  completeTask: (id: string) => void;
  buyItem: (id: string, price: number, currency: Currency) => void;
  careFarm: () => void;
  sellProduce: (id: string) => void;
  viewBoard: () => void;
  chatResident: (id: string) => void;
  giftResident: (residentId: string, inventoryItemId?: string) => void;
  advanceStory: (zone: 'forest' | 'lake') => void;
  notify: (m: string) => void;
};

const dailyResidentCount = (date: string) => Math.min(residentConfig.length, 3 + (Number(date.replace(/-/g, '')) % 3));

const daysBetween = (from?: string, to = todayKey()) => {
  if (!from) return 0;
  return Math.floor((new Date(`${to}T00:00:00`).getTime() - new Date(`${from}T00:00:00`).getTime()) / 86400000);
};

const buildDailyState = (date = todayKey()): DailyState => {
  const weather = pickDailyItem(
    weatherOptions.map((weather) => ({ id: weather, weather })),
    { namespace: 'weather', date },
  )?.weather ?? weatherOptions[0];
  const outsideResidentIds = pickDailyItems(residentConfig, { count: dailyResidentCount(date), namespace: 'outside-residents', date }).map((resident) => resident.id);
  const availableShopItems = shopItems.filter((item) => item.availableToday);
  const shopItemIds = pickDailyItems(availableShopItems, { count: 4, namespace: 'shop-items', date }).map((item) => item.id);
  const lumoLineId = pickDailyItem(lumoLines, { namespace: 'lumo-line', date })?.id ?? lumoLines[0]?.id ?? '';

  return { date, weather, outsideResidentIds, shopItemIds, lumoLineId };
};

const resetDailyTasks = (tasks: Task[], date: string): Task[] =>
  tasks.map((task) => (task.type === 'daily' && task.completedDate !== date ? { ...task, completedToday: false } : task));

const refreshDailyState = (state: Omit<State, keyof StateActions>, date = todayKey()) => {
  const daily = state.daily?.date === date ? state.daily : buildDailyState(date);
  return {
    ...state,
    daily,
    weather: daily.weather,
    tasks: resetDailyTasks(state.tasks, date),
    farm: state.farm.map((item) => ({ ...item, caredToday: item.lastCaredDate === date })),
    stories: state.stories.map((story) =>
      story.status === 'active' && story.lastAdvancedDate && daysBetween(story.lastAdvancedDate, date) > 1 ? { ...story, status: 'failed' as const } : story,
    ),
  };
};

const createFarmItemFromShop = (item: ShopItem, count: number): FarmItem | undefined => {
  const suffix = `${item.id}-${count + 1}`;
  if (item.category === 'seed') {
    return {
      id: suffix,
      name: item.name.replace('包', ''),
      category: 'plant',
      stage: 'seed',
      growDaysRequired: 2,
      currentGrowDays: 0,
      caredToday: false,
      produceResourceId: `${item.id}-produce`,
      resourceName: `${item.name.replace('包', '')}收成`,
      sellMoonValue: 3,
      sourceShopItemId: item.id,
    };
  }
  if (item.category === 'fish' || item.category === 'animal') {
    return {
      id: suffix,
      name: item.name.replace('幼崽', '').replace('鱼苗', '鱼'),
      category: 'animal',
      stage: 'baby',
      growDaysRequired: 3,
      currentGrowDays: 0,
      caredToday: false,
      produceResourceId: `${item.id}-resource`,
      resourceName: item.category === 'fish' ? '月纹鱼鳞' : `${item.name.replace('幼崽', '')}产物`,
      sellMoonValue: item.category === 'fish' ? 4 : 6,
      sourceShopItemId: item.id,
    };
  }
  return undefined;
};

const initial = refreshDailyState({
  stars: 12,
  moons: 5,
  tasks: taskConfig,
  farm: initialFarmItems,
  residents: residentConfig,
  inventory: [],
  stories: explorationStories,
  activePanel: null as Panel,
  weather: weatherOptions[0],
  daily: buildDailyState(),
});

// Support migration from legacy string[] inventory in localStorage
const raw = loadState('moxi-island-v1', initial) as any;
const migrated = (() => {
  if (!raw) return initial;
  const state = raw;
  const inv = state.inventory ?? initial.inventory;
  // if inventory is array of strings, migrate
  if (Array.isArray(inv) && inv.every((i: any) => typeof i === 'string')) {
    const mapped: InventoryItem[] = inv.map((label: string, idx: number) => {
      if (label.startsWith('gift:')) {
        const itemId = label.split(':')[1];
        return { id: `inv-${itemId}-${idx}`, itemId, name: itemId, category: 'gift', quantity: 1, tags: [] } as InventoryItem;
      }
      if (label.startsWith('fragment:')) {
        const itemId = label.split(':')[1];
        return { id: `inv-${itemId}-${idx}`, itemId, name: itemId, category: 'fragment', quantity: 1, tags: [] } as InventoryItem;
      }
      if (label.startsWith('reward:')) {
        const itemId = label.split(':')[1];
        return { id: `inv-${itemId}-${idx}`, itemId, name: itemId, category: 'reward', quantity: 1, tags: [] } as InventoryItem;
      }
      // fallback: treat as resource
      return { id: `inv-${label}-${idx}`, itemId: label, name: label, category: 'resource', quantity: 1, tags: [] } as InventoryItem;
    });
    return refreshDailyState({ ...state, inventory: mapped });
  }
  return refreshDailyState(state);
})();

const persisted = migrated as State;

const persist = (s: State) =>
  saveState('moxi-island-v1', {
    stars: s.stars,
    moons: s.moons,
    tasks: s.tasks,
    farm: s.farm,
    residents: s.residents,
    inventory: s.inventory,
    stories: s.stories,
    weather: s.weather,
    daily: s.daily,
    board: s.board,
  });

const stageFor = (item: FarmItem): FarmItem['stage'] =>
  item.category === 'animal'
    ? item.currentGrowDays >= item.growDaysRequired
      ? 'mature'
      : item.currentGrowDays > 0
        ? 'young'
        : 'baby'
    : item.currentGrowDays >= item.growDaysRequired
      ? 'mature'
      : item.currentGrowDays >= 2
        ? 'growing'
        : item.currentGrowDays >= 1
          ? 'sprout'
          : 'seed';

const hasCurrency = (state: State, currency: Currency, amount: number) => (currency === 'star' ? state.stars : state.moons) >= amount;
const spendCurrency = (state: State, currency: Currency, amount: number) => ({
  stars: currency === 'star' ? state.stars - amount : state.stars,
  moons: currency === 'moon' ? state.moons - amount : state.moons,
});

export const useGameStore = create<State>((set, get) => ({
  ...persisted,
  openPanel: (activePanel, selectedResidentId) => set({ activePanel, selectedResidentId }),
  closePanel: () => set({ activePanel: null, selectedResidentId: undefined }),
  notify: (toast) => {
    set({ toast });
    setTimeout(() => set({ toast: undefined }), 2400);
  },
  completeTask: (id) =>
    set((s) => {
      const today = todayKey();
      const refreshed = refreshDailyState(s, today) as State;
      const task = refreshed.tasks.find((item) => item.id === id);
      if (!task || task.completedToday) return refreshed;
      const tasks = refreshed.tasks.map((item) => (item.id === id ? { ...item, completedToday: true, completedDate: today } : item));
      const ns = { ...refreshed, tasks, stars: refreshed.stars + task.rewardStars } as State;
      persist(ns);
      get().notify(`获得 ${task.rewardStars} 星星币`);
      return ns;
    }),
  buyItem: (id, price, currency) =>
    set((s) => {
      if (!hasCurrency(s, currency, price)) {
        get().notify('货币不够哦');
        return s;
      }
      const item = shopItems.find((shopItem) => shopItem.id === id);
      const farmItem = item ? createFarmItemFromShop(item, s.farm.length) : undefined;
          const nsBase = {
            ...s,
            ...spendCurrency(s, currency, price),
            farm: farmItem ? [...s.farm, farmItem] : s.farm,
          } as State;
          let ns: State;
          if (farmItem) {
            ns = nsBase;
          } else if (item?.category === 'gift' || item?.category === 'fragment') {
            // add to structured inventory, stack by itemId
            const existing = s.inventory.find((it) => it.itemId === item.id);
            let newInv: InventoryItem[];
            if (existing) {
              newInv = s.inventory.map((it) => (it.itemId === item.id ? { ...it, quantity: it.quantity + 1 } : it));
            } else {
              const invItem: InventoryItem = { id: `inv-${item.id}-${Date.now()}`, itemId: item.id, name: item.name, category: item.category === 'gift' ? 'gift' : 'fragment', quantity: 1, tags: [] };
              newInv = [...s.inventory, invItem];
            }
            ns = { ...nsBase, inventory: newInv } as State;
          } else {
            // legacy/resource/reward -> keep as resource entry
            const existing = s.inventory.find((it) => it.itemId === (item?.id ?? id));
            let newInv: InventoryItem[];
            if (existing) {
              newInv = s.inventory.map((it) => (it.itemId === (item?.id ?? id) ? { ...it, quantity: it.quantity + 1 } : it));
            } else {
              const invItem: InventoryItem = { id: `inv-${item?.id ?? id}-${Date.now()}`, itemId: item?.id ?? id, name: item?.name ?? id, category: 'resource', quantity: 1, tags: [] };
              newInv = [...s.inventory, invItem];
            }
            ns = { ...nsBase, inventory: newInv } as State;
          }
      persist(ns);
          get().notify(farmItem ? '购买成功，已加入农场' : item?.category === 'gift' ? '购买成功，礼物已放入背包' : item?.category === 'fragment' ? '购买成功，碎片已放入背包' : '购买成功，已放入背包');
      return ns;
    }),
  careFarm: () =>
    set((s) => {
      const today = todayKey();
      if (s.farm.some((item) => item.lastCaredDate === today)) {
        get().notify('今天已经照顾过啦');
        return s;
      }
      if (s.stars < 1) {
        get().notify('需要 1 星星币');
        return s;
      }
      const farm = s.farm.map((item) => {
        if (item.stage === 'mature') return { ...item, caredToday: true, lastCaredDate: today };
        const next = { ...item, currentGrowDays: item.currentGrowDays + 1, caredToday: true, lastCaredDate: today };
        return { ...next, stage: stageFor(next) };
      });
      const ns = { ...s, stars: s.stars - 1, farm } as State;
      persist(ns);
      get().notify('浇水喂食完成');
      return ns;
    }),
  sellProduce: (id) =>
    set((s) => {
      const item = s.farm.find((farmItem) => farmItem.id === id);
      if (!item || item.stage !== 'mature') return s;
      const farm = s.farm.map((farmItem) =>
        farmItem.id === id
          ? { ...farmItem, currentGrowDays: 0, caredToday: false, lastCaredDate: undefined, stage: farmItem.category === 'animal' ? 'baby' : 'seed' }
          : farmItem,
      );
      const ns = { ...s, farm, moons: s.moons + item.sellMoonValue } as State;
      persist(ns);
      get().notify(`卖出${item.produceResourceId}，获得 ${item.sellMoonValue} 月亮币`);
      return ns;
    }),
  viewBoard: () =>
    set((s) => {
      const today = todayKey();
      const refreshed = refreshDailyState(s, today) as State;
      if (refreshed.board?.date === today) return refreshed;
      if (refreshed.moons < 1) {
        get().notify('查看留言板需要 1 月亮币');
        return refreshed;
      }
      const messages = pickDailyItems(boardMessages, { count: 3, namespace: `board-${refreshed.weather}`, date: today }).map(
        (item) => `${refreshed.weather}：${item.text}`,
      );
      const ns = { ...refreshed, moons: refreshed.moons - 1, board: { date: today, messages, viewed: true } } as State;
      persist(ns);
      return ns;
    }),
  chatResident: (id) =>
    set((s) => {
      const today = todayKey();
      const resident = s.residents.find((item) => item.id === id);
      const alreadyChatted = resident?.chattedDate === today;
      const residents = s.residents.map((item) =>
        item.id === id ? { ...item, chattedDate: today, friendship: alreadyChatted ? item.friendship : item.friendship + 1 } : item,
      );
      const ns = { ...s, residents } as State;
      persist(ns);
      get().notify(alreadyChatted ? '今天已经正式聊过啦' : '你们聊了一会儿');
      return ns;
    }),
  giftResident: (residentId, inventoryItemId) =>
    set((s) => {
      const today = todayKey();
      const resident = s.residents.find((item) => item.id === residentId);
      const alreadyGifted = resident?.giftedDate === today;
      if (alreadyGifted) {
        get().notify('今天已经送过礼啦');
        return s;
      }
      // choose specified inventory item or first gift
      const gift = inventoryItemId ? s.inventory.find((it) => it.id === inventoryItemId) : s.inventory.find((it) => it.category === 'gift');
      if (!gift) {
        get().notify('背包里还没有礼物');
        return s;
      }
      // decrease quantity
      const inventory = s.inventory
        .map((it) => (it.id === gift.id ? { ...it, quantity: it.quantity - 1 } : it))
        .filter((it) => it.quantity > 0);
      // friendship change: +4 if tags match favoriteGiftTags, else +2
      const matches = gift.tags && resident ? gift.tags.some((t) => resident.favoriteGiftTags?.includes(t)) : false;
      const delta = matches ? 4 : 2;
      const residents = s.residents.map((item) => (item.id === residentId ? { ...item, giftedDate: today, friendship: item.friendship + delta } : item));
      const ns = { ...s, residents, inventory } as State;
      persist(ns);
      get().notify(matches ? '送出礼物，好感度大幅提升' : '送出礼物，好感度提升');
      return ns;
    }),
   advanceStory: (zone) =>
    set((s) => {
      const today = todayKey();
      const refreshed = refreshDailyState(s, today) as State;
      const story = refreshed.stories.find((item) => item.zone === zone);
      if (!story || story.status === 'completed' || story.status === 'failed') return refreshed;
      if (story.lastAdvancedDate === today) {
        get().notify('今天已经推进过这段探索啦');
        return refreshed;
      }
      if (!hasCurrency(refreshed, story.dailyCost.currency, story.dailyCost.amount)) {
        get().notify(`${story.dailyCost.currency === 'star' ? '星星币' : '月亮币'}不够`);
        return refreshed;
      }
      const nextDay = Math.min(story.currentDay + 1, story.totalDays);
      const completed = nextDay >= story.totalDays;
      const stories = refreshed.stories.map((item) =>
        item.zone === zone ? { ...item, status: completed ? 'completed' : 'active', currentDay: nextDay, lastAdvancedDate: today } : item,
      );
      const ns = {
        ...refreshed,
        ...spendCurrency(refreshed, story.dailyCost.currency, story.dailyCost.amount),
        stories,
        inventory: completed
          ? (() => {
              let inv = refreshed.inventory.slice();
              story.rewardIds.forEach((rewardId) => {
                const ex = inv.find((it) => it.itemId === rewardId);
                if (ex) {
                  inv = inv.map((it) => (it.itemId === rewardId ? { ...it, quantity: it.quantity + 1 } : it));
                } else {
                  inv = [...inv, { id: `inv-${rewardId}-${Date.now()}`, itemId: rewardId, name: rewardId, category: 'reward', quantity: 1, tags: [] }];
                }
              });
              return inv;
            })()
          : refreshed.inventory,
      } as State;
      persist(ns);
      get().notify(completed ? '探索完成，奖励已放入背包' : '探索推进了一天');
      return ns;
    }),
}));
