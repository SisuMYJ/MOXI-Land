import type { ExplorationStory } from '../types/game';
export const explorationStories: ExplorationStory[] = [
 { id:'forest-footprints', zone:'forest', title:'会发光的脚印', totalDays:5, currentDay:0, dailyCost:{currency:'moon', amount:2}, status:'not_started', storyLines:['树根旁出现了淡金色脚印。','福克狐说脚印会避开睡着的花。','你们发现一枚温热的橡果。','薄雾里传来轻轻的笑声。','脚印停在新地块前，留下一盏小灯。'], rewardIds:['tiny-lamp'] },
 { id:'lake-old-star', zone:'lake', title:'湖底旧星', totalDays:5, currentDay:0, dailyCost:{currency:'moon', amount:2}, status:'not_started', storyLines:['湖面映出一颗不在天上的星。','迷雾猫说它每七年醒一次。','你投入月光，波纹排成小路。','旧星讲起第一棵树的梦。','湖边留下了可收藏的星屑。'], rewardIds:['star-dust'] },
];
