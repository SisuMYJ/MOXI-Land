# 墨西岛 / Moxi Island

手机端优先的 2D 治愈小岛经营游戏 Prototype v1。项目使用 Vite + React + TypeScript + Phaser 3，React 负责 HUD、弹窗与交互面板，Phaser 负责单屏小岛、建筑、居民与环境动态。

## 功能

- 森林童话风单屏小岛，包含任务小屋、农场区、千灯铺、留言板、森林探险区、星光湖与锁定六边形地块。
- 云朵、树木、湖水、居民具备轻量动态。
- 任务完成获得星星币；商店购买消耗星星币或月亮币。
- 农场一键浇水喂食消耗星星币，成熟资源出售获得月亮币。
- 留言板每日查看消耗月亮币并绑定日期。
- 森林/湖泊探索故事雏形，消耗月亮币逐日推进。
- 5 位原创动物居民，支持聊天与送礼占位，好感度保存。
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

所有核心内容配置位于 `src/content/`：任务、商品、居民、农场、留言、探索故事、礼物与天气都可在不改 UI 核心逻辑的前提下扩展。


## 内容系统壳子 v1

当前已预留内容扩展结构：

- `src/content/boardMessages.ts`：留言板内容池，可按天气、居民、农场、商店、探索区域等条件筛选。
- `src/content/residentDialogues.ts`：居民对话内容池，可按居民、天气、好感度筛选。
- `src/content/lumoLines.ts`：星灯兽 Lumo 每日一句内容池。
- `src/game/systems/dailyPicker.ts`：每日固定随机工具，保证同一天刷新内容稳定、第二天自然变化。

后续可以继续往这些内容文件里追加文案，不需要改核心 UI 或状态逻辑。

## Prototype v1 说明

当前版本不接入真实 AI API、不包含后端、登录或最终美术资源。AI 居民聊天、AI 留言板、AI 探索故事与 AI 店主鼓励已在类型和内容结构上预留。
