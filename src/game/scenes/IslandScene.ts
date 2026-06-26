import Phaser from 'phaser';
import { weatherConfigs } from '../../content/weather';
import { residents } from '../../content/residents';
import { assetList } from '../../content/visualAssets';
import { BuildingSprite } from '../objects/BuildingSprite';
import { FarmPlotSprite } from '../objects/FarmPlotSprite';
import { ResidentSprite } from '../objects/ResidentSprite';
import { emitIslandEvent } from '../systems/interactionSystem';

type IslandLayout = {
  centerX: number;
  hudSafeTop: number;
  bottomSafe: number;
  mapTop: number;
  mapBottom: number;
  islandCenterY: number;
  forestY: number;
  lakeY: number;
  taskY: number;
  messageX: number;
  messageY: number;
  farmX: number;
  farmY: number;
  shopX: number;
  shopY: number;
  residentLabelX: number;
  residentLabelY: number;
};

export class IslandScene extends Phaser.Scene {
  private currentWeather: string = '晴天';

  constructor() {
    super('IslandScene');
  }

  // Get current weather from global state (injected from React)
  private initWeather() {
    const weatherElement = (window as any).__MOXI_WEATHER__;
    if (weatherElement) {
      this.currentWeather = weatherElement;
    }
  }

  private getLayout(w: number, h: number): IslandLayout {
    // Keep the island away from UI overlays before doing detailed art polish.
    // Top: HUD/weather pills. Bottom: future navigation/toast/large panel breathing room.
    const hudSafeTop = 88;
    const bottomSafe = 82;
    const mapTop = 174;
    const mapBottom = Math.max(620, h - bottomSafe);
    const islandCenterY = (mapTop + mapBottom) / 2 + 18;
    const lakeY = Phaser.Math.Clamp(islandCenterY + 34, 430, mapBottom - 165);

    return {
      centerX: w / 2,
      hudSafeTop,
      bottomSafe,
      mapTop,
      mapBottom,
      islandCenterY,
      forestY: mapTop - 38,
      lakeY,
      taskY: lakeY - 148,
      messageX: 150,
      messageY: lakeY - 82,
      farmX: w - 196,
      farmY: lakeY - 116,
      shopX: w - 188,
      shopY: Math.min(mapBottom - 62, lakeY + 164),
      residentLabelX: 150,
      residentLabelY: Math.min(mapBottom - 80, lakeY + 138),
    };
  }

  private createWeatherEffects(w: number, h: number) {
    const config = weatherConfigs[this.currentWeather];
    if (!config) return;

    switch (this.currentWeather) {
      case '晴天':
        this.createSunnyWeather(w, h, config);
        break;
      case '微风':
        this.createWindyWeather(w, h, config);
        break;
      case '雨天':
        this.createRainyWeather(w, h, config);
        break;
      case '林间薄雾':
        this.createMistyWeather(w, h, config);
        break;
      case '星光夜':
        this.createStarryNightWeather(w, h, config);
        break;
    }
  }

  preload() {
    // The manifest currently blocks generated PNGs. This keeps the loader ready for future cleaned assets
    // without letting oversized/checkerboard images render in the scene.
    assetList.filter((a) => a.status === 'usable').forEach((asset) => {
      if (!this.textures.exists(asset.key)) {
        this.load.image(asset.key, asset.path);
      }
    });
  }

  private createSunnyWeather(w: number, h: number, config: any) {
    // Warm sky gradient effect with stylized sun
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setDepth(-10);
    const sun = this.add.circle(60, 60, 26, 0xffd36b).setDepth(-9).setStrokeStyle(4, 0xfff1c7, 0.9);
    this.tweens.add({
      targets: sun,
      y: 70,
      duration: 2000,
      yoyo: true,
      repeat: -1,
    });
  }

  private createWindyWeather(w: number, h: number, config: any) {
    // Light sky with drifting clouds
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setDepth(-10);
    for (let i = 0; i < 4; i++) {
      const cloudX = 40 + i * 130;
      const cloudY = 42 + (i % 2) * 36;
      const cloud = this.add.ellipse(cloudX, cloudY, 116, 42, 0xffffff).setAlpha(0.62).setDepth(-9);
      this.tweens.add({
        targets: cloud,
        x: cloudX + 80,
        duration: 8000 + i * 2000,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  private createRainyWeather(w: number, h: number, config: any) {
    // Gray sky with rain effect
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setDepth(-10);
    // Rain drops animation (simple lines)
    for (let i = 0; i < 8; i++) {
      const rainX = 80 + (i % 4) * 120;
      const rainY = 30 + Math.floor(i / 4) * 60;
      const drop = this.add.rectangle(rainX, rainY, 2, 12, 0xbfe0ff).setAlpha(0.6).setDepth(-9);
      this.tweens.add({
        targets: drop,
        y: rainY + 150,
        duration: 1500 + i * 300,
        repeat: -1,
        ease: 'Linear.easeNone',
      });
    }
  }

  private createMistyWeather(w: number, h: number, config: any) {
    // Light sky with mist layer
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setDepth(-10);

    // Semi-transparent white overlay for mist effect
    const mist = this.add.rectangle(w / 2, 200, w, h - 100, 0xffffff, 0.12).setDepth(-8);
    this.tweens.add({
      targets: mist,
      alpha: 0.18,
      duration: 3000,
      yoyo: true,
      repeat: -1,
    });

    // soft drifting mist shape
    const mistShape = this.add.ellipse(w / 2, 100, 260, 60, 0xffffff, 0.5).setDepth(-9);
    this.tweens.add({
      targets: mistShape,
      y: 120,
      alpha: 0.3,
      duration: 2500,
      yoyo: true,
      repeat: -1,
    });
  }

  private createStarryNightWeather(w: number, h: number, config: any) {
    // Dark sky with stars
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setDepth(-10);
    // Scatter simple star points
    for (let i = 0; i < 18; i++) {
      const starX = 40 + (i % 6) * 70;
      const starY = 30 + Math.floor(i / 6) * 40;
      const star = this.add.circle(starX, starY, 3, 0xfff7c9).setAlpha(0.9).setDepth(-9);
      this.tweens.add({
        targets: star,
        alpha: 0.3,
        duration: 1000 + i * 150,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  private createVectorTree(x: number, y: number, scale = 1) {
    const shadow = this.add.ellipse(x, y + 4 * scale, 54 * scale, 13 * scale, 0x000000, 0.11).setDepth(y - 1);
    const tree = this.add.container(x, y, [
      this.add.rectangle(0, -24 * scale, 8 * scale, 30 * scale, 0x8b6244),
      this.add.ellipse(0, -55 * scale, 38 * scale, 68 * scale, 0x8ebf88),
      this.add.circle(-8 * scale, -68 * scale, 10 * scale, 0xa9d79c, 0.45),
      this.add.circle(10 * scale, -46 * scale, 10 * scale, 0x6ea56d, 0.35),
    ]);
    tree.setDepth(y);
    this.tweens.add({ targets: tree, angle: 2.5, duration: 1700 + Math.random() * 500, yoyo: true, repeat: -1 });
    return { tree, shadow };
  }

  private createMainPath(layout: IslandLayout) {
    const path = this.add.graphics();
    const { centerX, forestY, lakeY, shopX, shopY, messageX, messageY, farmX, farmY } = layout;

    // Main path stops at lake edges instead of drawing a hard stripe through the lake.
    path.lineStyle(12, 0xf6edcf, 0.48);
    path.beginPath();
    path.moveTo(centerX, forestY + 40);
    path.lineTo(centerX, lakeY - 62);
    path.strokePath();

    path.beginPath();
    path.moveTo(centerX + 68, lakeY + 52);
    path.lineTo(shopX - 8, shopY - 70);
    path.strokePath();

    // Soft side paths from lake edge to side zones.
    path.lineStyle(10, 0xf8f2dc, 0.42);
    path.beginPath();
    path.moveTo(centerX - 82, lakeY - 6);
    path.lineTo(messageX + 64, messageY + 4);
    path.strokePath();

    path.beginPath();
    path.moveTo(centerX + 88, lakeY - 8);
    path.lineTo(farmX - 50, farmY + 42);
    path.strokePath();

    path.setDepth(-4);
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    const layout = this.getLayout(w, h);

    // Initialize weather
    this.initWeather();

    // Apply weather effects
    this.createWeatherEffects(w, h);

    // Base island landscape - layered organic shapes, fitted inside the UI-safe map area.
    const g = this.add.graphics();
    // soft cream rim
    g.fillStyle(0xfff6df, 1);
    g.fillEllipse(layout.centerX, layout.islandCenterY, 430, 550);
    // layered grass blobs
    g.fillStyle(0xdff3d8, 1);
    g.fillEllipse(layout.centerX - 6, layout.islandCenterY + 4, 342, 430);
    g.fillStyle(0xcfe9c4, 1);
    g.fillEllipse(layout.centerX + 18, layout.islandCenterY + 24, 260, 330);
    g.setDepth(-12);

    // Main walking path scaffold around the central lake.
    this.createMainPath(layout);

    // Clouds (fewer in rainy/misty weather) - simple fallback until PNGs are cleaned
    const cloudCount = ['雨天', '林间薄雾'].includes(this.currentWeather) ? 1 : 3;
    for (let i = 0; i < cloudCount; i++) {
      const cx = 90 + i * 170;
      const cy = layout.mapTop - 22 + (i % 2) * 24;
      const cloud = this.add.ellipse(cx, cy, 104, 34, 0xffffff, 0.62).setAlpha(0.8).setDepth(-3);
      this.tweens.add({ targets: cloud, x: cx + 42, duration: 12000 + i * 3500, yoyo: true, repeat: -1 });
    }

    // Trees: compact handmade vector fallback, kept around the island rim instead of the center.
    const treePositions = [
      [76, layout.mapTop + 18, 0.72],
      [184, layout.mapTop + 18, 0.76],
      [308, layout.mapTop + 18, 0.78],
      [438, layout.mapTop + 18, 0.74],
      [88, layout.lakeY - 122, 0.62],
      [198, layout.shopY + 10, 0.54],
      [332, layout.lakeY - 108, 0.58],
      [455, layout.lakeY - 116, 0.56],
    ] as const;
    treePositions.forEach(([tx, ty, scale]) => this.createVectorTree(tx, ty, scale));

    // Forest gate interactive. Keep fallback local to the container to avoid double-positioned green blocks.
    const gatePlate = this.add.ellipse(0, 0, 170, 46, 0xffffff, 0.26).setStrokeStyle(2, 0xffffff, 0.38);
    const gateText = this.add.text(0, 0, '森林探险区', { fontSize: '18px', color: '#315342' }).setOrigin(0.5);
    const gateContainer = this.add.container(layout.centerX, layout.forestY, [gatePlate, gateText]);
    gateContainer.setSize(180, 70).setInteractive({ useHandCursor: true }).on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'forest'));
    gateContainer.setDepth(145);

    // Central lake: first real visual anchor of the island.
    const lakeX = layout.centerX;
    const lakeY = layout.lakeY;
    const lakeShadow = this.add.ellipse(lakeX, lakeY + 7, 232, 98, 0x5fa7a7, 0.14).setDepth(74);
    const lakeBody = this.add.ellipse(lakeX, lakeY, 208, 92, 0x81d4fa, 0.92).setStrokeStyle(4, 0xe8fbff).setDepth(75);
    const lakeGlow = this.add.ellipse(lakeX - 22, lakeY - 12, 92, 26, 0xffffff, 0.24).setDepth(76);
    const lakeLabel = this.add.text(lakeX, lakeY, '星光湖 ✨', { fontSize: '17px', color: '#26566b' }).setOrigin(0.5).setDepth(77);
    lakeBody.setInteractive({ useHandCursor: true }).on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'lake'));
    lakeLabel.setInteractive({ useHandCursor: true }).on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'lake'));
    this.tweens.add({ targets: [lakeBody, lakeGlow, lakeShadow], scaleX: 1.04, alpha: 0.76, duration: 1500, yoyo: true, repeat: -1 });

    // Buildings (keep original interactions, tune positions around the UI-safe core)
    new BuildingSprite(this, layout.centerX, layout.taskY, '任务小屋', 0xf7d794, () => emitIslandEvent('moxi-open-panel', 'tasks'), 'task-cottage');
    new BuildingSprite(this, layout.messageX, layout.messageY, '留言板', 0xc9a06a, () => emitIslandEvent('moxi-open-panel', 'messages'), 'message-board');
    new BuildingSprite(this, layout.farmX, layout.farmY, '农场区', 0xb8df72, () => emitIslandEvent('moxi-open-panel', 'farm'), 'farm-plot');
    new FarmPlotSprite(this, layout.farmX, layout.farmY + 58, 'farm-plot');
    new BuildingSprite(this, layout.shopX, layout.shopY, '千灯铺', 0xffc9de, () => emitIslandEvent('moxi-open-panel', 'shop'), 'lantern-shop');

    residents.filter((resident) => resident.isOutsideToday).forEach((resident) => new ResidentSprite(this, resident, () => emitIslandEvent('moxi-open-resident', resident.id)));
  }
}
