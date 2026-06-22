# 墨西岛 / Moxi Island

手机端优先的 2D 治愈小岛经营游戏 Prototype v1。项目使用 Vite + React + TypeScript + Phaser 3，React 负责 HUD、弹窗与交互面板，Phaser 负责单屏小岛、建筑、居民与环境动态。

## 功能

- 森林童话风单屏小岛，包含任务小屋、农场区、千灯铺、留言板、森林探险区、星光湖与锁定六边形地块。
- 云朵、树木、湖水、居民具备轻量动态。
- 任务完成获得星星币；商店购买消耗星星币或月亮币。
- 农场一键浇水喂食消耗星星币，成熟资源出售获得月亮币。
- 留言板每日查看消耗月亮币并绑定日期，每天从内容池固定抽取多条。
- 森林/湖泊探索故事雏形，消耗月亮币逐日推进。
- 5 位原创动物居民，支持按居民、天气、好感度抽取聊天台词，聊天与送礼好感度保存。
- 关键进度使用 localStorage 持久化。

## 安装与运行

```bash
npm install
npm run dev
```

构建检查：

```bash
npm run build
```

## 内容扩展

所有核心内容配置位于 `src/content/`：任务、商品、居民、农场、探索故事、礼物与天气都可在不改 UI 核心逻辑的前提下扩展。内容系统壳子 v1 额外拆出了以下每日内容池：

- `src/content/boardMessages.ts`：留言板消息池。每条消息需要稳定 `id` 与 `text`，可选 `tags` 方便后续按玩法筛选；留言板每天通过 `dailyPicker` 固定抽取多条。
- `src/content/residentDialogues.ts`：居民聊天台词池。通过 `residentId`、`weather` 与 `friendshipBand` 描述触发条件；新增居民或天气时，只需补充对应台词对象。
- `src/content/lumoLines.ts`：千灯铺店主 Lumo 每日一句。每条台词保留稳定 `id`，每日固定抽取一句。
- `src/game/systems/dailyPicker.ts`：通用每日抽取工具。传入内容数组、日期命名空间与数量，即可得到同一天稳定、不同天刷新的结果。

商店商品仍在 `src/content/shopItems.ts` 维护，当前每天从商品池固定抽取 4 个展示；未来可继续在商品对象上扩展节日、稀有度或解锁条件字段。

## Prototype v1 说明

当前版本不接入真实 AI API、不包含后端、登录或最终美术资源。AI 居民聊天、AI 留言板、AI 探索故事与 AI 店主鼓励已在类型和内容结构上预留。
