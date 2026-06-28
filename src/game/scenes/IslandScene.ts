import Phaser from 'phaser';
import { islandTiles } from '../../content/islandTiles';
import { weatherConfigs } from '../../content/weather';
import { residents } from '../../content/residents';
import { assetList, visualAssets } from '../../content/visualAssets';
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
    // Load only assets marked usable in manifest
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
    // Light sky with many drifting clouds
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setDepth(-10);
    for (let i = 0; i < 5; i++) {
      const cloudX = 50 + i * 100;
      const cloudY = 40 + (i % 2) * 40;
      const cloud = this.add.ellipse(cloudX, cloudY, 160, 64, 0xffffff).setAlpha(0.7).setDepth(-9);
      this.tweens.add({
        targets: cloud,
        x: cloudX + 120,
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
    g.fillEllipse(w / 2, h / 2 + 24, 520, 700);
    // layered grass blobs
    g.fillStyle(0xdff3d8, 1);
    g.fillEllipse(w / 2 - 10, h / 2 + 40, 420, 560);
    g.fillStyle(0xcfe9c4, 1);
    g.fillEllipse(w / 2 + 20, h / 2 + 70, 340, 420);
    g.setDepth(-12);

    // Clouds (fewer in rainy/misty weather) - image or simple ellipse
    const cloudCount = ['雨天', '林间薄雾'].includes(this.currentWeather) ? 1 : 3;
    for (let i = 0; i < cloudCount; i++) {
      const key = i % 2 === 0 ? 'cloud-01' : 'cloud-02';
      const cx = 80 + i * 210;
      const cy = 140 + (i % 2) * 30;
      let cloud: Phaser.GameObjects.GameObject;
      if (visualAssets[key] && visualAssets[key].status === 'usable' && this.textures.exists(key)) {
        cloud = this.add.image(cx, cy, key).setScale(visualAssets[key].scale ?? 0.7).setAlpha(0.85).setOrigin(...(visualAssets[key].origin ?? [0.5, 0.5]));
      } else {
        cloud = this.add.ellipse(cx, cy, 160, 64, 0xffffff, 0.85).setAlpha(0.9);
      }
      this.tweens.add({ targets: cloud, x: cx + 80, duration: 12000 + i * 3500, yoyo: true, repeat: -1 });
    }

    // Trees: place a grid of trees, using asset when available
    const treeKey = 'tree-01';
    for (let i = 0; i < 8; i++) {
      const tx = 70 + (i % 4) * 125;
      const ty = 150 + Math.floor(i / 4) * 120;
      let tree: Phaser.GameObjects.Image | Phaser.GameObjects.Ellipse;
      if (visualAssets[treeKey] && visualAssets[treeKey].status === 'usable' && this.textures.exists(treeKey)) {
        tree = this.add.image(tx, ty, treeKey).setScale(visualAssets[treeKey].scale ?? 0.8).setOrigin(...(visualAssets[treeKey].origin ?? [0.5, 1.0]));
      } else {
        tree = this.add.ellipse(tx, ty, 56, 88, 0x8fbf8a).setOrigin(0.5, 1.0);
      }
      // add soft shadow under tree
      const s = this.add.ellipse(tx, ty + 30, 68, 18, 0x000000, 0.12).setOrigin(0.5);
      tree.setDepth(ty);
      s.setDepth(ty - 1);
      this.tweens.add({ targets: tree, angle: 4, duration: 1600 + i * 120, yoyo: true, repeat: -1 });
    }

    // Forest gate interactive
    const gateKey = 'forest-gate';
    const forestX = w / 2;
    const forestY = 118;
    let gate: Phaser.GameObjects.GameObject;
    if (visualAssets[gateKey] && visualAssets[gateKey].status === 'usable' && this.textures.exists(gateKey)) {
      gate = this.add.image(forestX, forestY, gateKey).setScale(visualAssets[gateKey].scale ?? 1).setOrigin(...(visualAssets[gateKey].origin ?? [0.5, 0.9]));
    } else {
      gate = this.add.rectangle(forestX, forestY, 160, 48, 0x6a8b6b);
    }
    const gateContainer = this.add.container(forestX, forestY, [gate]);
    gateContainer.setSize(180, 100).setInteractive({ useHandCursor: true }).on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'forest'));

    // Buildings
    new BuildingSprite(this, w / 2, 340, '任务小屋', 0xf7d794, () => emitIslandEvent('moxi-open-panel', 'tasks'), 'task-cottage');
    new BuildingSprite(this, 182, 255, '留言板', 0xc9a06a, () => emitIslandEvent('moxi-open-panel', 'messages'), 'message-board');
    new BuildingSprite(this, 390, 255, '农场区', 0xb8df72, () => emitIslandEvent('moxi-open-panel', 'farm'), 'farm-plot');
    new FarmPlotSprite(this, 390, 305, 'farm-plot');
    new BuildingSprite(this, 390, 540, '千灯铺', 0xffc9de, () => emitIslandEvent('moxi-open-panel', 'shop'), 'lantern-shop');

    this.add.text(150, 545, '居民活动区', { fontSize: '17px', color: '#315342' }).setOrigin(0.5);

    // Lake: use asset or soft shape
    const lakeKey = 'starlight-lake';
    const lakeX = w / 2;
    const lakeY = 690;
    let lakeBody: Phaser.GameObjects.GameObject;
    if (visualAssets[lakeKey] && visualAssets[lakeKey].status === 'usable' && this.textures.exists(lakeKey)) {
      lakeBody = this.add.image(lakeX, lakeY, lakeKey).setScale(visualAssets[lakeKey].scale ?? 1).setOrigin(...(visualAssets[lakeKey].origin ?? [0.5, 0.5]));
    } else {
      lakeBody = this.add.ellipse(lakeX, lakeY, 190, 82, 0x81d4fa, 0.9).setStrokeStyle(4, 0xe8fbff);
    }
    const lakeLabel = this.add.text(lakeX, lakeY + 48, '星光湖', { fontSize: '18px', color: '#26566b' }).setOrigin(0.5);
    const lakeContainer = this.add.container(lakeX, lakeY, [lakeBody, lakeLabel]);
    lakeContainer.setSize(240, 140).setInteractive({ useHandCursor: true }).on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'lake'));
    this.tweens.add({ targets: lakeBody, scaleX: 1.08, alpha: 0.72, duration: 1500, yoyo: true, repeat: -1 });

    islandTiles.forEach((tile) => {
      const isUnlocked = tile.status === 'unlocked';
      const hex = this.add.polygon(tile.position.x, tile.position.y, [35, 0, 17, 30, -17, 30, -35, 0, -17, -30, 17, -30], isUnlocked ? 0xfef3b7 : 0xffffff, isUnlocked ? 0.35 : 0.22)
        .setStrokeStyle(2, isUnlocked ? 0xf7c96b : 0xffffff, 0.7);

      // simple indicator instead of emoji
      if (isUnlocked) {
        this.add.ellipse(tile.position.x, tile.position.y, 28, 12, 0xfff4d9, 0.9).setOrigin(0.5);
      } else {
        this.add.rectangle(tile.position.x, tile.position.y, 28, 12, 0xffffff, 0.9).setOrigin(0.5);
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
