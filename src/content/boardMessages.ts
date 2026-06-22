import type { BoardMessage } from '../types/game';

export const boardMessages: BoardMessage[] = [
  { id: 'weather-breeze-01', type: 'weather', text: '今天的风把树叶吹成了小船，居民们说这是好兆头。', weather: ['微风', '晴天'], tags: ['daily', 'soft'] },
  { id: 'lumo-night-01', type: 'shop', speaker: 'Lumo', text: '千灯铺门口多了一盏小灯，Lumo 说它会替努力的人守夜。', tags: ['shop', 'comfort'] },
  { id: 'lake-star-01', type: 'exploration', text: '星光湖泛起了圆圆波纹，也许有旧故事正在醒来。', weather: ['星光夜', '林间薄雾'], zone: 'lake', tags: ['lake', 'mystery'] },
  { id: 'mist-cat-note-01', type: 'resident', speaker: '迷雾猫', residentIds: ['mist-cat'], text: '湖边的雾今天很轻，像一封还没拆开的信。', tags: ['resident', 'lake'] },
  { id: 'foko-fox-note-01', type: 'resident', speaker: '福克狐', residentIds: ['foko-fox'], text: '福克狐在森林入口贴了便签：如果看见发光脚印，请先不要踩乱它。', zone: 'forest', tags: ['resident', 'forest'] },
  { id: 'farm-grow-01', type: 'farm', text: '农场的小苗比昨天更直了一点，像在认真听太阳讲话。', tags: ['farm', 'growth'] },
  { id: 'rain-board-01', type: 'weather', text: '雨点敲在留言板边缘，声音很轻，像有人在小声说“慢慢来”。', weather: ['雨天'], tags: ['rain', 'comfort'] },
  { id: 'resident-table-01', type: 'resident', speaker: '慢熊', residentIds: ['slow-bear', 'dango-rabbit'], text: '慢熊说团子兔跑得太快，所以给它留了一块晒得暖暖的石头。', tags: ['resident', 'relationship'] },
];
