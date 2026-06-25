export type Currency = 'star' | 'moon';
export type IslandTileStatus = 'unlocked' | 'locked';
export type IslandTileKind = 'main' | 'forest' | 'garden' | 'farm' | 'resident' | 'festival';
export type WeatherAtmosphere = {
	label: string;
	description: string;
	skyColor: number;
	islandTint: number;
	particleEmoji: string;
};
export type IslandTile = {
	id: string;
	name: string;
	status: IslandTileStatus;
	kind: IslandTileKind;
	position: { x: number; y: number };
	unlockCost?: { currency: Currency; amount: number };
	description: string;
};
export type Task = { id: string; title: string; type: 'daily' | 'long_term'; rewardStars: number; completedToday?: boolean; completedDate?: string };
export type FarmStage = 'seed' | 'sprout' | 'growing' | 'mature' | 'baby' | 'young';
export type FarmItem = { id: string; name: string; category: 'plant' | 'animal'; stage: FarmStage; growDaysRequired: number; currentGrowDays: number; caredToday: boolean; produceResourceId: string; resourceName: string; sellMoonValue: number; sourceShopItemId?: string; lastCaredDate?: string };
export type ShopItem = { id: string; name: string; category: 'seed' | 'fish' | 'animal' | 'gift' | 'fragment' | 'festival'; price: number; currency: Currency; availableToday: boolean };
export type Resident = { id: string; name: string; species: string; personality: 'gentle' | 'curious' | 'quiet' | 'energetic' | 'slow' | 'mysterious'; friendship: number; favoriteGiftTags: string[]; currentMood: string; isOutsideToday: boolean; position?: { x: number; y: number }; chattedDate?: string; giftedDate?: string };
export type ExplorationStory = { id: string; zone: 'forest' | 'lake'; title: string; totalDays: number; currentDay: number; dailyCost: { currency: Currency; amount: number }; status: 'not_started' | 'active' | 'completed' | 'failed'; storyLines: string[]; rewardIds: string[]; lastAdvancedDate?: string };
export type DailyState = { date: string; weather: string; outsideResidentIds: string[]; shopItemIds: string[]; lumoLineId: string };
export type AIPromptContext = { resident?: Resident; weather: string; islandEvents: string[]; playerRecentTasks: Task[]; friendship?: number };
export type Panel = 'tasks' | 'shop' | 'farm' | 'messages' | 'resident' | 'forest' | 'lake' | 'island' | null;

export type InventoryItem = {
	id: string;
	itemId: string;
	name: string;
	category: 'gift' | 'fragment' | 'resource' | 'reward';
	quantity: number;
	tags?: string[];
};
