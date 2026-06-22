import type { Resident } from '../types/game';
export const residents: Resident[] = [
 { id:'mist-cat', name:'迷雾猫', species:'猫', personality:'quiet', friendship:0, favoriteGiftTags:['fish','flower'], currentMood:'想在湖边看云', isOutsideToday:true, position:{x:190,y:390}},
 { id:'foko-fox', name:'福克狐', species:'狐狸', personality:'curious', friendship:0, favoriteGiftTags:['toy','berry'], currentMood:'发现了森林脚印', isOutsideToday:true, position:{x:285,y:185}},
 { id:'deer-lamp', name:'小鹿星灯', species:'鹿', personality:'gentle', friendship:0, favoriteGiftTags:['flower','scarf'], currentMood:'照顾小花中', isOutsideToday:true, position:{x:455,y:290}},
 { id:'slow-bear', name:'慢熊', species:'熊', personality:'slow', friendship:0, favoriteGiftTags:['honey','food'], currentMood:'晒太阳打盹', isOutsideToday:true, position:{x:185,y:560}},
 { id:'dango-rabbit', name:'团子兔', species:'兔', personality:'energetic', friendship:0, favoriteGiftTags:['cake','toy'], currentMood:'准备冒险', isOutsideToday:true, position:{x:420,y:560}},
];
export const chatByPersonality = { quiet:'风吹过湖面的时候，心也会安静一点。', curious:'你知道吗？今天森林里多了一串亮亮的脚印！', gentle:'谢谢你照顾这座岛，花儿都记得。', energetic:'走吧走吧！哪怕只前进一步也超棒！', slow:'慢一点也没关系，云也是这样到达远方的。', mysterious:'星星没有掉落，它们只是换了一个地方发光。' } as const;
