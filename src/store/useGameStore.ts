import { create } from 'zustand';
import { tasks as taskConfig } from '../content/tasks';
import { initialFarmItems } from '../content/farmItems';
import { residents as residentConfig } from '../content/residents';
import { explorationStories } from '../content/explorationStories';
import { boardMessages } from '../content/boardMessages';
import { pickDailyItems } from '../game/systems/dailyPicker';
import { weatherOptions } from '../content/weather';
import type { ExplorationStory, FarmItem, Panel, Resident, Task } from '../types/game';
import { daySeed, todayKey } from '../utils/date';
import { loadState, saveState } from '../utils/localStorage';

type State = { stars:number; moons:number; tasks:Task[]; farm:FarmItem[]; residents:Resident[]; inventory:string[]; stories:ExplorationStory[]; activePanel:Panel; selectedResidentId?:string; weather:string; board?:{date:string; message?:string; messages:string[]; viewed:boolean}; toast?:string; openPanel:(p:Panel,id?:string)=>void; closePanel:()=>void; completeTask:(id:string)=>void; buyItem:(id:string, price:number, currency:'star'|'moon')=>void; careFarm:()=>void; sellProduce:(id:string)=>void; viewBoard:()=>void; chatResident:(id:string)=>void; giftResident:(id:string)=>void; advanceStory:(zone:'forest'|'lake')=>void; notify:(m:string)=>void };
const initial = { stars: 12, moons: 5, tasks: taskConfig, farm: initialFarmItems, residents: residentConfig, inventory: [], stories: explorationStories, activePanel: null as Panel, weather: weatherOptions[daySeed()%weatherOptions.length] };
const persisted = loadState('moxi-island-v1', initial);
const persist = (s: State) => saveState('moxi-island-v1', { stars:s.stars, moons:s.moons, tasks:s.tasks, farm:s.farm, residents:s.residents, inventory:s.inventory, stories:s.stories, weather:s.weather, board:s.board });
const stageFor = (item: FarmItem): FarmItem['stage'] => item.category==='animal' ? (item.currentGrowDays>=item.growDaysRequired?'mature':item.currentGrowDays>0?'young':'baby') : (item.currentGrowDays>=item.growDaysRequired?'mature':item.currentGrowDays>=2?'growing':item.currentGrowDays>=1?'sprout':'seed');
export const useGameStore = create<State>((set,get)=>({ ...persisted,
 openPanel:(activePanel, selectedResidentId)=>set({activePanel, selectedResidentId}), closePanel:()=>set({activePanel:null, selectedResidentId:undefined}), notify:(toast)=>{set({toast}); setTimeout(()=>set({toast:undefined}),2400)},
 completeTask:(id)=>set(s=>{ const today=todayKey(); const tasks=s.tasks.map(t=>t.id===id && t.completedToday!==true ? {...t, completedToday:true} : t); const task=s.tasks.find(t=>t.id===id); const add=task && !task.completedToday ? task.rewardStars : 0; const ns={...s,tasks,stars:s.stars+add} as State; persist(ns); if(add) get().notify(`获得 ${add} 星星币`); return ns;}),
 buyItem:(id,price,currency)=>set(s=>{ if((currency==='star'?s.stars:s.moons)<price){get().notify('货币不够哦'); return s;} const ns={...s, stars: currency==='star'?s.stars-price:s.stars, moons: currency==='moon'?s.moons-price:s.moons, inventory:[...s.inventory,id]} as State; persist(ns); get().notify('购买成功，已放入背包'); return ns;}),
 careFarm:()=>set(s=>{ const today=todayKey(); if(s.inventory.includes(`care-${today}`)){get().notify('今天已经照顾过啦'); return s;} if(s.stars<1){get().notify('需要 1 星星币'); return s;} const farm=s.farm.map(f=> f.stage==='mature'?f:{...f,currentGrowDays:f.currentGrowDays+1,caredToday:true,stage:stageFor({...f,currentGrowDays:f.currentGrowDays+1})}); const ns={...s,stars:s.stars-1,farm,inventory:[...s.inventory,`care-${today}`]} as State; persist(ns); get().notify('浇水喂食完成'); return ns;}),
 sellProduce:(id)=>set(s=>{ const item=s.farm.find(f=>f.id===id); if(!item || item.stage!=='mature') return s; const farm=s.farm.map(f=>f.id===id?{...f,currentGrowDays:0,stage:f.category==='animal'?'baby':'seed'}:f); const ns={...s,farm,moons:s.moons+item.sellMoonValue} as State; persist(ns); get().notify(`卖出${item.resourceName}，获得 ${item.sellMoonValue} 月亮币`); return ns;}),
 viewBoard:()=>set(s=>{ const today=todayKey(); if(s.board?.date===today) return s; if(s.moons<1){get().notify('查看留言板需要 1 月亮币'); return s;} const messages=pickDailyItems(boardMessages,{count:3,namespace:`board-${s.weather}`,date:today}).map(item=>`${s.weather}：${item.text}`); const board={date:today,messages,viewed:true}; const ns={...s,moons:s.moons-1,board} as State; persist(ns); return ns;}),
 chatResident:(id)=>set(s=>{ const today=todayKey(); const residents=s.residents.map(r=>r.id===id?{...r,chattedDate:today,friendship:r.chattedDate===today?r.friendship:r.friendship+1}:r); const ns={...s,residents} as State; persist(ns); get().notify('你们聊了一会儿'); return ns;}),
 giftResident:(id)=>set(s=>{ const today=todayKey(); const residents=s.residents.map(r=>r.id===id?{...r,giftedDate:today,friendship:r.giftedDate===today?r.friendship:r.friendship+2}:r); const ns={...s,residents} as State; persist(ns); get().notify('送礼占位：好感度提升'); return ns;}),
 advanceStory:(zone)=>set(s=>{ const story=s.stories.find(st=>st.zone===zone); if(!story || story.status==='completed') return s; if(s.moons<story.dailyCost.amount){get().notify('月亮币不够'); return s;} const stories=s.stories.map(st=>st.zone===zone?{...st,status:st.currentDay+1>=st.totalDays?'completed':'active',currentDay:Math.min(st.currentDay+1,st.totalDays),lastAdvancedDate:todayKey()}:st); const ns={...s,moons:s.moons-story.dailyCost.amount,stories} as State; persist(ns); return ns;})
}));
