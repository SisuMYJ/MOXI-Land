import type { ShopItem } from '../types/game';
export const shopItems: ShopItem[] = [
 { id:'seed-pack', name:'微光种子包', category:'seed', price:3, currency:'star', availableToday:true },
 { id:'moon-fry', name:'月纹鱼苗', category:'fish', price:5, currency:'star', availableToday:true },
 { id:'lamb-baby', name:'云朵羊幼崽', category:'animal', price:8, currency:'star', availableToday:true },
 { id:'honey', name:'森林蜂蜜', category:'gift', price:2, currency:'star', availableToday:true },
 { id:'invite-fragment', name:'邀请碎片', category:'fragment', price:3, currency:'moon', availableToday:true },
 { id:'stay-fragment', name:'挽留碎片', category:'fragment', price:3, currency:'moon', availableToday:true },
];
export const lumoLines = ['今天也请慢慢发光。','小岛听见了你的努力。','买不买都没关系，先喝口云茶吧。'];
