import type { Resident } from '../types/game';

export type DialogueWeather = 'any' | string;
export type FriendshipBand = 'new' | 'friend' | 'close';

export type ResidentDialogue = {
  id: string;
  residentId: Resident['id'] | 'any';
  weather: DialogueWeather;
  friendshipBand: FriendshipBand;
  text: string;
};

export const friendshipBandFor = (friendship: number): FriendshipBand => {
  if (friendship >= 8) return 'close';
  if (friendship >= 3) return 'friend';
  return 'new';
};

export const residentDialogues: ResidentDialogue[] = [
  { id: 'mist-cat-any-new', residentId: 'mist-cat', weather: 'any', friendshipBand: 'new', text: '风吹过湖面的时候，心也会安静一点。' },
  { id: 'foko-fox-any-new', residentId: 'foko-fox', weather: 'any', friendshipBand: 'new', text: '你知道吗？今天森林里多了一串亮亮的脚印！' },
  { id: 'deer-lamp-any-new', residentId: 'deer-lamp', weather: 'any', friendshipBand: 'new', text: '谢谢你照顾这座岛，花儿都记得。' },
  { id: 'slow-bear-any-new', residentId: 'slow-bear', weather: 'any', friendshipBand: 'new', text: '慢一点也没关系，云也是这样到达远方的。' },
  { id: 'dango-rabbit-any-new', residentId: 'dango-rabbit', weather: 'any', friendshipBand: 'new', text: '走吧走吧！哪怕只前进一步也超棒！' },
  { id: 'any-sunny-friend', residentId: 'any', weather: '晴天', friendshipBand: 'friend', text: '今天阳光很软，适合把秘密讲给信任的人听。' },
  { id: 'any-rain-friend', residentId: 'any', weather: '雨天', friendshipBand: 'friend', text: '雨声会帮我们把烦恼洗得轻一点。' },
  { id: 'any-any-close', residentId: 'any', weather: 'any', friendshipBand: 'close', text: '你来之前，小岛很安静；你来之后，星星好像都有了回声。' },
];
