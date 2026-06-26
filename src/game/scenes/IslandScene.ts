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
  mapTop: number;
  mapBottom: number;
  baseX: number;
  baseY: number;
  baseSize: number;
  forestX: number;
  forestY: number;
  lakeX: number;
  lakeY: number;
  taskX: number;
  taskY: number;
  messageX: number;
  messageY: number;
  farmPlotX: number;
  farmPlotY: number;
  shopX: number;
  shopY: number;
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
    // Keep the island away from UI overlays while letting the baseland art own the terrain.
    const mapTop = 154;
    const mapBottom = Math.max(640, h - 58);
    const baseSize = Phaser.Math.Clamp(Math.min(w * 0.96, (mapBottom - mapTop) * 0.95), 430, 560);
    const baseX = w / 2;
    const baseY = mapTop + baseSize * 0.55;

    const at = (u: number, v: number) => ({
      x: baseX + (u - 0.5) * baseSize,
      y: baseY + (v - 0.5) * baseSize,
    });

    const forest = at(0.52, 0.2);
    const lake = at(0.5, 0.52);
    const task = at(0.47, 0.36);
    const message = at(0.25, 0.49);
    const farmPlot = at(0.73, 0.46);
    const shop = at(0.74, 0.69);

    return {
      centerX: w / 2,
      mapTop,
      mapBottom,
      baseX,
      baseY,
      baseSize,
      forestX: forest.x,
      forestY: forest.y,
      lakeX: lake.x,
      lakeY: lake.y,
      taskX: task.x,
      taskY: task.y,
      messageX: message.x,
      messageY: message.y,
      farmPlotX: farmPlot.x,
      farmPlotY: farmPlot.y,
      shopX: shop.x,
      shopY: shop.y,
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
    // Only assets explicitly marked usable are loaded. The generated manifest keeps risky assets blocked.
    assetList.filter((a) => a.status === 'usable').forEach((asset) => {
      if (!this.textures.exists(asset.key)) {
        this.load.image(asset.key, asset.path);
      }
    });
  }

  private createSunnyWeather(w: number, h: number, config: any) {
    // Warm sky gradient effect with stylized sun
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setDepth(-20);
    const sun = this.add.circle(60, 60, 26, 0xffd36b).setDepth(-19).setStrokeStyle(4, 0xfff1c7, 0.9);
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
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setDepth(-20);
    for (let i = 0; i < 4; i++) {
      const cloudX = 40 + i * 130;
      const cloudY = 42 + (i % 2) * 36;
      const cloud = this.add.ellipse(cloudX, cloudY, 116, 42, 0xffffff).setAlpha(0.42).setDepth(-19);
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
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setDepth(-20);
    // Rain drops animation (simple lines)
    for (let i = 0; i < 8; i++) {
      const rainX = 80 + (i % 4) * 120;
      const rainY = 30 + Math.floor(i / 4) * 60;
      const drop = this.add.rectangle(rainX, rainY, 2, 12, 0xbfe0ff).setAlpha(0.6).setDepth(-19);
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
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setDepth(-20);

    // Semi-transparent white overlay for mist effect
    const mist = this.add.rectangle(w / 2, 200, w, h - 100, 0xffffff, 0.1).setDepth(-18);
    this.tweens.add({
      targets: mist,
      alpha: 0.16,
      duration: 3000,
      yoyo: true,
      repeat: -1,
    });

    // soft drifting mist shape
    const mistShape = this.add.ellipse(w / 2, 100, 260, 60, 0xffffff, 0.42).setDepth(-19);
    this.tweens.add({
      targets: mistShape,
      y: 120,
      alpha: 0.25,
      duration: 2500,
      yoyo: true,
      repeat: -1,
    });
  }

  private createStarryNightWeather(w: number, h: number, config: any) {
    // Dark sky with stars
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setDepth(-20);
    // Scatter simple star points
    for (let i = 0; i < 18; i++) {
      const starX = 40 + (i % 6) * 70;
      const starY = 30 + Math.floor(i / 6) * 40;
      const star = this.add.circle(starX, starY, 3, 0xfff7c9).setAlpha(0.9).setDepth(-19);
      this.tweens.add({
        targets: star,
        alpha: 0.3,
        duration: 1000 + i * 150,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  private createFallbackBase(layout: IslandLayout) {
    const g = this.add.graphics();
    g.fillStyle(0xfff4dc, 1);
    g.fillEllipse(layout.baseX, layout.baseY + layout.baseSize * 0.02, layout.baseSize * 0.86, layout.baseSize * 0.68);
    g.fillStyle(0xdff2d7, 0.92);
    g.fillEllipse(layout.baseX, layout.baseY, layout.baseSize * 0.68, layout.baseSize * 0.52);
    g.fillStyle(0x8bd9f3, 0.78);
    g.fillEllipse(layout.lakeX, layout.lakeY, layout.baseSize * 0.26, layout.baseSize * 0.13);
    g.lineStyle(4, 0xf2ffff, 0.78);
    g.strokeEllipse(layout.lakeX, layout.lakeY, layout.baseSize * 0.26, layout.baseSize * 0.13);
    g.setDepth(-12);
  }

  private addLakeHotspot(layout: IslandLayout) {
    const lakeHotspot = this.add.ellipse(layout.lakeX, layout.lakeY, layout.baseSize * 0.23, layout.baseSize * 0.12, 0xffffff, 0.001);
    lakeHotspot
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'lake'))
      .setDepth(70);

    const lakeLabel = this.add
      .text(layout.lakeX, layout.lakeY + layout.baseSize * 0.012, '星光湖 ✨', {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#2f6b6f',
        backgroundColor: 'rgba(255,255,255,0.28)',
        padding: { x: 7, y: 2 },
      })
      .setOrigin(0.5)
      .setDepth(78);

    lakeLabel.setInteractive({ useHandCursor: true }).on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'lake'));
  }

  private addForestHotspot(layout: IslandLayout) {
    const gatePlate = this.add.ellipse(0, 0, 150, 40, 0xffffff, 0.16).setStrokeStyle(2, 0xffffff, 0.24);
    const gateText = this.add.text(0, 0, '森林探险区', { fontSize: '15px', color: '#315342' }).setOrigin(0.5);
    const gateContainer = this.add.container(layout.forestX, layout.forestY, [gatePlate, gateText]);
    gateContainer.setSize(170, 58).setInteractive({ useHandCursor: true }).on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'forest'));
    gateContainer.setDepth(90);
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    const layout = this.getLayout(w, h);

    // Initialize weather
    this.initWeather();

    // Apply weather effects
    this.createWeatherEffects(w, h);

    // The painted baseland owns terrain, lake, paths, trees, flowers, and cliff edges.
    if (this.textures.exists('baseland')) {
      this.add.image(layout.baseX, layout.baseY, 'baseland').setOrigin(0.5).setDisplaySize(layout.baseSize, layout.baseSize).setDepth(-12);
    } else {
      this.createFallbackBase(layout);
    }

    this.addForestHotspot(layout);
    this.addLakeHotspot(layout);

    // Cleaned PNGs now replace the rough vector building placeholders.
    new BuildingSprite(this, layout.taskX, layout.taskY, '任务小屋', 0xf7d794, () => emitIslandEvent('moxi-open-panel', 'tasks'), 'task-cottage');
    new BuildingSprite(this, layout.messageX, layout.messageY, '留言板', 0xc9a06a, () => emitIslandEvent('moxi-open-panel', 'messages'), 'message-board');
    new FarmPlotSprite(this, layout.farmPlotX, layout.farmPlotY, 'farm-plot', () => emitIslandEvent('moxi-open-panel', 'farm'));
    new BuildingSprite(this, layout.shopX, layout.shopY, '千灯铺', 0xffc9de, () => emitIslandEvent('moxi-open-panel', 'shop'), 'lantern-shop');

    residents.filter((resident) => resident.isOutsideToday).forEach((resident) => new ResidentSprite(this, resident, () => emitIslandEvent('moxi-open-resident', resident.id)));
  }
}
