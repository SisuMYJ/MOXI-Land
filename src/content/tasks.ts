import type { Task } from '../types/game';
export const tasks: Task[] = [
  { id: 'read20', title: '阅读 20 页', type: 'daily', rewardStars: 5 },
  { id: 'walk15', title: '散步 15 分钟', type: 'daily', rewardStars: 4 },
  { id: 'words40', title: '背 40 个单词', type: 'daily', rewardStars: 8 },
  { id: 'journal', title: '写日记', type: 'daily', rewardStars: 5 },
  { id: 'deepwork', title: '完成一次长期专注计划', type: 'long_term', rewardStars: 15 },
];
