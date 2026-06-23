export type BoardMessage = {
  id: string;
  text: string;
  tags?: string[];
};

export const boardMessages: BoardMessage[] = [
  { id: 'leaf-boat', text: '今天的风把树叶吹成了小船，居民们说这是好兆头。', tags: ['daily'] },
  { id: 'lamp-watch', text: '千灯铺门口多了一盏小灯，Lumo 说它会替努力的人守夜。', tags: ['shop'] },
  { id: 'lake-ripple', text: '星光湖泛起了圆圆波纹，也许有旧故事正在醒来。', tags: ['lake'] },
  { id: 'farm-note', text: '农场围栏上贴着便签：慢慢照顾，幼苗会记住每一次浇水。', tags: ['farm'] },
  { id: 'forest-path', text: '森林入口的小路被露珠点亮，像是在邀请勇敢的人散步。', tags: ['forest'] },
];
