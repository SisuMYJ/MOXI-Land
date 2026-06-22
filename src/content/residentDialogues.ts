import type { ResidentDialogue } from '../types/game';

export const residentDialogues: ResidentDialogue[] = [
  { id: 'mist-cat-default-01', residentId: 'mist-cat', text: '风吹过湖面的时候，心也会安静一点。', tags: ['daily', 'lake'] },
  { id: 'mist-cat-fog-01', residentId: 'mist-cat', text: '雾不是为了遮住路，有时候只是想让我们走慢一点。', weather: ['林间薄雾'], tags: ['fog'] },
  { id: 'mist-cat-friend-01', residentId: 'mist-cat', text: '你来的时候，湖面的星星会亮得久一点。', minFriendship: 3, tags: ['friendship'] },
  { id: 'foko-fox-default-01', residentId: 'foko-fox', text: '你知道吗？今天森林里多了一串亮亮的脚印！', tags: ['daily', 'forest'] },
  { id: 'foko-fox-rain-01', residentId: 'foko-fox', text: '雨天的泥土最适合留下线索，不过也最容易踩一脚水。', weather: ['雨天'], tags: ['rain'] },
  { id: 'deer-lamp-default-01', residentId: 'deer-lamp', text: '谢谢你照顾这座岛，花儿都记得。', tags: ['daily', 'flower'] },
  { id: 'deer-lamp-starlight-01', residentId: 'deer-lamp', text: '如果晚上看不清路，就跟着我角上的小星星走吧。', weather: ['星光夜'], tags: ['star'] },
  { id: 'slow-bear-default-01', residentId: 'slow-bear', text: '慢一点也没关系，云也是这样到达远方的。', tags: ['daily', 'slow'] },
  { id: 'slow-bear-friend-01', residentId: 'slow-bear', text: '我给你留了一小块阳光，在长椅最暖的地方。', minFriendship: 4, tags: ['friendship'] },
  { id: 'dango-rabbit-default-01', residentId: 'dango-rabbit', text: '走吧走吧！哪怕只前进一步也超棒！', tags: ['daily', 'adventure'] },
  { id: 'dango-rabbit-breeze-01', residentId: 'dango-rabbit', text: '今天有风！适合把烦恼吹到很远很远的草丛里。', weather: ['微风'], tags: ['breeze'] },
];
