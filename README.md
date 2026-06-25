# 墨西岛 / Moxi Island

手机端优先的 2D 治愈小岛经营游戏 Prototype v1。项目使用 Vite + React + TypeScript + Phaser 3，React 负责 HUD、弹窗与交互面板，Phaser 负责单屏小岛、建筑、居民与环境动态。

## 功能

- 森林童话风单屏小岛，包含任务小屋、农场区、千灯铺、留言板、森林探险区、星光湖与锁定六边形地块。
- 云朵、树木、湖水、居民具备轻量动态。
- 任务完成获得星星币；商店购买消耗星星币或月亮币。
- **结构化背包系统**：种子/鱼/动物进入农场，礼物/碎片进入背包（数量堆叠）；同 itemId 的物品自动合并。
- **商店购买分流**：根据商品类别自动分配到农场或背包；购买成功提示说明去向。
- **送礼机制**：背包有礼物时显示选择器，玩家可选择具体礼物送出；礼物 tags 匹配居民 favoriteGiftTags 则好感度 +4，否则 +2；每位居民每天限送一次。
- 农场一键浇水喂食消耗星星币，成熟资源出售获得月亮币。资源来自 mature farm item 的 produceResourceId 与 resourceName，出售后自动重置成长状态。
- 留言板每日查看消耗月亮币并绑定日期，每天从内容池固定抽取多条。
- 森林/湖泊探索故事雏形，消耗月亮币逐日推进，完成奖励按 InventoryItem 结构化格式堆叠进背包。
- 5 位原创动物居民，支持按居民、天气、好感度抽取聊天台词，聊天与送礼好感度保存。
- 每日天气、外出居民、商店商品、Lumo 台词按日期固定刷新。
- 关键进度使用 localStorage 持久化；支持自动迁移旧版 string[] 格式 inventory 为结构化 InventoryItem[]。

## 安装与运行

```bash
npm install
npm run dev
```

构建检查：

```bash
npm run build
```

## 内容与功能扩展

### 背包系统

`InventoryItem` 类型定义位于 [src/types/game.ts](src/types/game.ts)，包含：
- `id`：唯一标识符
- `itemId`：商品/奖励 ID
- `name`：物品名称
- `category`：分类（'gift' | 'fragment' | 'resource' | 'reward'）
- `quantity`：数量
- `tags`：可选标签数组（用于礼物送礼匹配）

Store 中 `inventory` 从 `string[]` 迁移为 `InventoryItem[]`。加载时自动检测旧格式并转换。扩展背包时，在 [src/store/useGameStore.ts](src/store/useGameStore.ts) `buyItem` 方法中按 category 判断，调用时构造相应的 `InventoryItem` 对象。

### 商店与购买流程

商店商品定义在 [src/content/shopItems.ts](src/content/shopItems.ts)，当前支持 category：`'seed' | 'fish' | 'animal' | 'gift' | 'fragment' | 'festival'`。

- **seed/fish/animal**：自动进入农场（调用 `createFarmItemFromShop`）
- **gift/fragment**：进入背包，相同 itemId 自动堆叠 quantity
- 购买后提示区分目的地（农场/背包/具体分类）

[ShopPanel.tsx](src/components/ShopPanel.tsx) 顶部实时显示背包礼物与碎片总数，让玩家快速了解库存。

### 送礼机制与好感度

[ResidentPanel.tsx](src/components/ResidentPanel.tsx) 中：
- 有礼物时显示 `<select>` 让玩家选择具体礼物
- 点击"送礼"调用 `giftResident(residentId, inventoryItemId)`
- 后端逻辑在 [src/store/useGameStore.ts](src/store/useGameStore.ts)：
  - 检查当天是否已送过（`giftedDate === today`）
  - 消耗礼物 quantity 1
  - 如果礼物 `tags` 与居民 `favoriteGiftTags` 有交集，好感度 +4；否则 +2
  - 好感度影响后续聊天台词筛选（[src/content/residentDialogues.ts](src/content/residentDialogues.ts) 的 `friendshipBand`）

### 农场与产出出售

[FarmItem](src/types/game.ts) 包含 `produceResourceId` 和 `resourceName`，用于区分产出来源：
- `produceResourceId`：唯一识别符（如 `seed-pack-produce`）
- `resourceName`：展示名称（如 `微光种子收成`）
- `sellMoonValue`：出售月亮币数

出售后（[useGameStore.ts](src/store/useGameStore.ts) `sellProduce`）：
- 重置 `currentGrowDays` 为 0
- 清除 `lastCaredDate`
- 动物回到 `baby` 阶段，植物回到 `seed` 阶段

后续可扩展为"先卖到资源背包，再交给商人"的二段流程，当前设计支持平滑过渡。

#### 农场可视化增强 v1

[FarmPanel.tsx](src/components/FarmPanel.tsx) UI 增强（feature/farm-visual-v1）：
- **阶段图标工具**：内部函数 `iconForFarmItem()` 和 `labelForStage()` 支持按照成长阶段返回对应 emoji 表情与中文标签
- **详细卡片信息**：每个 farm item 卡片显示成长阶段、进度条、成熟产出、出售价值与"已照顾"状态标记
- **进度可视化**：CSS 进度条展示 `currentGrowDays / growDaysRequired` 的百分比进度
- **成熟状态突出**：mature 阶段卡片背景高亮，出售按钮样式激活，提升用户反馈
- **占位图形风格**：使用 Phaser 占位矩形与 emoji 构建农场地块视觉，可平滑过渡到正式美术素材

[FarmPlotSprite.ts](src/game/objects/FarmPlotSprite.ts) 视觉增强：
- **简化田块布局**：3 个小田块 + 简单围栏框架，土壤色调 (#9c6b45) 与边框色调 (#ffe4b4)
- **成长感表现**：植物阶段用 🌾 → 🌱 → 🌿 emoji 变化表现成长；动物用 🐣 → 🐑 → 🐑 系列
- **装饰元素**：添加小围栏柱子与背景田框，保持轻量风格
- **轻微动画**：保留原有摇晃动画（angle 1.5°，yoyo）

[ui.css](src/styles/ui.css) 样式更新：
- 农场卡片新增 `.plot.mature` 高亮样式（金黄边框、阴影）
- 进度条 `.progress-bar` 与 `.progress-fill` 渐变绿色
- 出售按钮 `.farm-btn.sell-btn` 激活样式（金黄背景、白字）
- 已照顾标记 `.cared-badge` 绿色标签
- 所有交互保持手机端友好（touch-friendly 尺寸）

### 探索故事奖励

完成探索时，奖励按 `InventoryItem` 格式累加到背包，相同 `itemId` 自动堆叠。当前 `rewardIds` 仍为占位，可在 [src/content/explorationStories.ts](src/content/explorationStories.ts) 中扩展为具体的碎片或稀有物品 ID。

### 扩岛地块系统 v1

- `src/content/islandTiles.ts`：用于定义扩岛地块配置，包括主岛与未来可解锁的森林、花园、农场、居民屋与节日集市占位地块。
- `src/store/useGameStore.ts`：新增 `islandTiles` 状态、持久化存储与 `unlockIslandTile(id)` 解锁动作，当前是数据结构与 UI 壳子，后续可继续绑定到地图区域、美术资源和剧情事件。
- `src/game/scenes/IslandScene.ts`：不再硬编码六边形地块，而是按配置渲染未解锁/已解锁地块，并为点击提供未来扩展入口。

### 每日内容池

所有核心内容配置位于 `src/content/`：任务、商品、居民、农场、探索故事、礼物与天气都可在不改 UI 核心逻辑的前提下扩展。内容系统壳子 v1 额外拆出了以下每日内容池：

- `src/content/boardMessages.ts`：留言板消息池。每条消息需要稳定 `id` 与 `text`，可选 `tags` 方便后续按玩法筛选；留言板每天通过 `dailyPicker` 固定抽取多条。
- `src/content/residentDialogues.ts`：居民聊天台词池。通过 `residentId`、`weather` 与 `friendshipBand` 描述触发条件；新增居民或天气时，只需补充对应台词对象。新增可选 `tags` 字段以支持未来情绪系统。
- `src/content/lumoLines.ts`：千灯铺店主 Lumo 每日一句。每条台词保留稳定 `id`，每日固定抽取一句。
- `src/game/systems/dailyPicker.ts`：通用每日抽取工具。传入内容数组、日期命名空间与数量，即可得到同一天稳定、不同天刷新的结果。

### 天气氛围系统 v1

[WeatherAtmosphere](src/types/game.ts) 类型定义天气配置，包含：
- `label`：天气中文名
- `description`：天气简短描述（用于 HUD tooltip）
- `skyColor`：背景色（十六进制）
- `islandTint`：岛屿色调
- `particleEmoji`：天气代表 emoji

天气配置存储在 [src/content/weather.ts](src/content/weather.ts)，当前支持 5 种天气：
- **晴天**：暖色背景 + 太阳 emoji 动画
- **微风**：浅蓝背景 + 多个云朵漂浮
- **雨天**：灰蓝背景 + 雨滴下落动画
- **林间薄雾**：柔和背景 + 雾气透明层动画
- **星光夜**：深色夜空 + 星点闪烁

[IslandScene.ts](src/game/scenes/IslandScene.ts) 根据当日天气自动渲染不同的视觉效果。React [HUD](src/components/HUD.tsx) 组件显示天气 emoji + 标签，hover 时提示天气描述。

天气视觉完全由 Phaser 占位图形、emoji 和 tween 动画组成，无需外部素材，支持后续平滑替换为正式美术素材。

## 当前美术与内容占位

Prototype v1 目前使用 Phaser 几何图形、emoji 和 CSS 作为统一风格占位：动物居民、建筑、农场与地图板块都还不是最终美术资源，也不是外部替换过的具体动物形象。后续如果有 ChatGPT 或其他流程生成的原创动物形象、商品图标、地图板块素材，可以优先替换 `src/game/objects/` 与 `src/game/scenes/IslandScene.ts` 中的占位绘制逻辑。

剧情、留言、居民对话和 Lumo 台词都走 `src/content/` 下的配置文件；当前只保留少量占位文案，适合后续逐步替换为正式文案。功能系统会尽量避免把创意内容写死在组件里。

## Prototype v1 说明

当前版本不接入真实 AI API、不包含后端、登录或最终美术资源。AI 居民聊天、AI 留言板、AI 探索故事与 AI 店主鼓励已在类型和内容结构上预留。
