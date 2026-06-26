import Phaser from 'phaser';
import { islandTiles } from '../../content/islandTiles';
import { weatherConfigs } from '../../content/weather';
import { residents } from '../../content/residents';
import { assetList } from '../../content/visualAssets';
import { BuildingSprite } from '../objects/BuildingSprite';
import { FarmPlotSprite } from '../objects/FarmPlotSprite';
import { ResidentSprite } from '../objects/ResidentSprite';
import { emitIslandEvent } from '../systems/interactionSystem';

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

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    // Initialize weather
    this.initWeather();

    // Apply weather effects
    this.createWeatherEffects(w, h);

    // Base island landscape - layered organic shapes
    const g = this.add.graphics();
    // soft cream rim
    g.fillStyle(0xfff6df, 1);
    g.fillEllipse(w / 2, h / 2 + 28, 430, 560);
    // layered grass blobs
    g.fillStyle(0xdff3d8, 1);
    g.fillEllipse(w / 2 - 6, h / 2 + 32, 342, 444);
    g.fillStyle(0xcfe9c4, 1);
    g.fillEllipse(w / 2 + 18, h / 2 + 52, 260, 340);
    g.setDepth(-12);

    // Clouds (fewer in rainy/misty weather) - simple fallback until PNGs are cleaned
    const cloudCount = ['雨天', '林间薄雾'].includes(this.currentWeather) ? 1 : 3;
    for (let i = 0; i < cloudCount; i++) {
      const cx = 90 + i * 170;
      const cy = 150 + (i % 2) * 24;
      const cloud = this.add.ellipse(cx, cy, 104, 34, 0xffffff, 0.62).setAlpha(0.8).setDepth(-3);
      this.tweens.add({ targets: cloud, x: cx + 42, duration: 12000 + i * 3500, yoyo: true, repeat: -1 });
    }

    // Trees: compact handmade vector fallback, kept around the island rim instead of the center.
    const treePositions = [
      [76, 190, 0.72],
      [184, 190, 0.76],
      [308, 190, 0.78],
      [438, 190, 0.74],
      [88, 330, 0.62],
      [196, 345, 0.56],
      [332, 342, 0.6],
      [450, 332, 0.58],
    ] as const;
    treePositions.forEach(([tx, ty, scale]) => this.createVectorTree(tx, ty, scale));

    // Forest gate interactive. Keep fallback local to the container to avoid double-positioned green blocks.
    const forestX = w / 2;
    const forestY = 134;
    const gatePlate = this.add.ellipse(0, 0, 170, 46, 0xffffff, 0.26).setStrokeStyle(2, 0xffffff, 0.38);
    const gateText = this.add.text(0, 0, '森林探险区', { fontSize: '18px', color: '#315342' }).setOrigin(0.5);
    const gateContainer = this.add.container(forestX, forestY, [gatePlate, gateText]);
    gateContainer.setSize(180, 70).setInteractive({ useHandCursor: true }).on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'forest'));
    gateContainer.setDepth(145);

    // Buildings (keep original interactions, tune positions for readability)
    new BuildingSprite(this, w / 2, 410, '任务小屋', 0xf7d794, () => emitIslandEvent('moxi-open-panel', 'tasks'), 'task-cottage');
    new BuildingSprite(this, 150, 330, '留言板', 0xc9a06a, () => emitIslandEvent('moxi-open-panel', 'messages'), 'message-board');
    new BuildingSprite(this, 408, 312, '农场区', 0xb8df72, () => emitIslandEvent('moxi-open-panel', 'farm'), 'farm-plot');
    new FarmPlotSprite(this, 408, 370, 'farm-plot');
    new BuildingSprite(this, 388, 590, '千灯铺', 0xffc9de, () => emitIslandEvent('moxi-open-panel', 'shop'), 'lantern-shop');

    this.add.text(148, 586, '居民活动区', { fontSize: '17px', color: '#315342' }).setOrigin(0.5).setDepth(555);

    // Lake: use soft vector fallback and keep it inside the viewport.
    const lakeX = w / 2;
    const lakeY = Math.min(h - 50, 668);
    const lakeBody = this.add.ellipse(lakeX, lakeY, 184, 76, 0x81d4fa, 0.9).setStrokeStyle(4, 0xe8fbff).setDepth(80);
    this.add.text(lakeX, lakeY, '星光湖 ✨', { fontSize: '18px', color: '#26566b' }).setOrigin(0.5).setDepth(81);
    lakeBody.setInteractive({ useHandCursor: true }).on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'lake'));
    this.tweens.add({ targets: lakeBody, scaleX: 1.06, alpha: 0.72, duration: 1500, yoyo: true, repeat: -1 });

    islandTiles.forEach((tile) => {
      const isUnlocked = tile.status === 'unlocked';
      const hex = this.add.polygon(tile.position.x, tile.position.y, [35, 0, 17, 30, -17, 30, -35, 0, -17, -30, 17, -30], isUnlocked ? 0xfef3b7 : 0xffffff, isUnlocked ? 0.35 : 0.18)
        .setStrokeStyle(2, isUnlocked ? 0xf7c96b : 0xffffff, 0.65)
        .setDepth(tile.position.y - 2);

      if (!isUnlocked) {
        this.add.text(tile.position.x, tile.position.y, '🔒', { fontSize: '15px' }).setOrigin(0.5).setDepth(tile.position.y - 1);
      }

      hex.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
        if (isUnlocked) {
          emitIslandEvent('moxi-open-panel', 'island');
          return;
        }
        emitIslandEvent('moxi-open-panel', 'island');
        emitIslandEvent('moxi-toast', `未来可解锁：${tile.name}`);
      });
    });

    residents.filter((resident) => resident.isOutsideToday).forEach((resident) => new ResidentSprite(this, resident, () => emitIslandEvent('moxi-open-resident', resident.id)));
  }
}
