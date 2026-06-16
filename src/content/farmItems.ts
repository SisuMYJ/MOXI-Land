import type { FarmItem } from '../types/game';
export const initialFarmItems: FarmItem[] = [
 { id:'glow-carrot', name:'星光胡萝卜', category:'plant', stage:'seed', growDaysRequired:2, currentGrowDays:0, caredToday:false, produceResourceId:'glow-carrot-bundle', resourceName:'星光胡萝卜束', sellMoonValue:3 },
 { id:'mist-berry', name:'雾莓', category:'plant', stage:'seed', growDaysRequired:3, currentGrowDays:0, caredToday:false, produceResourceId:'mist-berry-basket', resourceName:'雾莓篮', sellMoonValue:5 },
 { id:'cloud-lamb', name:'云朵羊', category:'animal', stage:'baby', growDaysRequired:3, currentGrowDays:0, caredToday:false, produceResourceId:'soft-wool', resourceName:'柔云羊毛', sellMoonValue:6 },
];
