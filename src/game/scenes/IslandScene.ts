import Phaser from 'phaser';
import { islandTiles } from '../../content/islandTiles';
import { weatherConfigs } from '../../content/weather';
import { residents } from '../../content/residents';
import { visualAssets, visualAssetEntries } from '../../content/visualAssets';
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

  private createSunnyWeather(w: number, h: number, config: any) {
    // Warm sky gradient effect with sun emoji
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setDepth(-10);
    const sun = this.add.text(50, 60, '☀️', { fontSize: '48px' }).setDepth(-9);
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
      const cloud = this.add.text(cloudX, cloudY, '☁️', { fontSize: '42px' }).setAlpha(0.7).setDepth(-9);
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
    
    // Rain drops animation
    for (let i = 0; i < 8; i++) {
      const rainX = 80 + (i % 4) * 120;
      const rainY = 30 + Math.floor(i / 4) * 60;
      const rain = this.add.text(rainX, rainY, '💧', { fontSize: '28px' }).setAlpha(0.6).setDepth(-9);
      this.tweens.add({
        targets: rain,
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
    
    // Floating mist emoji
    const mistEmoji = this.add.text(w / 2, 100, '🌫️', { fontSize: '44px' }).setAlpha(0.5).setDepth(-9).setOrigin(0.5);
    this.tweens.add({
      targets: mistEmoji,
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
    
    // Scatter stars
    const stars = ['⭐', '✨', '💫'];
    for (let i = 0; i < 12; i++) {
      const starX = 60 + (i % 5) * 90;
      const starY = 30 + Math.floor(i / 5) * 50;
      const star = this.add.text(starX, starY, stars[i % 3], { fontSize: '22px' }).setAlpha(0.7).setDepth(-9);
      this.tweens.add({
        targets: star,
        alpha: 0.3,
        duration: 1000 + i * 200,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  preload() {
    visualAssetEntries.forEach(([key, path]) => {
      if (!this.textures.exists(key)) {
        this.load.image(key, path);
      }
    });
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    // Initialize weather
    this.initWeather();

    // Apply weather effects
    this.createWeatherEffects(w, h);

    // Base island landscape
    const config = weatherConfigs[this.currentWeather];
    const skyTint = config?.islandTint || 0xffffff;

    // Use setFillStyle to tint colors instead of setTint
    this.add.ellipse(w / 2, h / 2 + 20, 460, 640, 0x8edc8f).setStrokeStyle(8, 0xf9ffd6, 0.9).setFillStyle(0x8edc8f, 0.95);
    this.add.ellipse(w / 2, h / 2 + 40, 360, 500, 0xa8e6a1).setFillStyle(0xa8e6a1, 0.98);

    // Clouds (fewer in rainy/misty weather)
    const cloudKeys = ['cloud-01', 'cloud-02'];
    const cloudCount = ['雨天', '林间薄雾'].includes(this.currentWeather) ? 1 : 3;
    for (let i = 0; i < cloudCount; i++) {
      const cloudKey = cloudKeys[i % cloudKeys.length];
      const cloudX = 80 + i * 210;
      const cloudY = 140 + (i % 2) * 30;
      let cloud: Phaser.GameObjects.GameObject;

      if (this.textures.exists(cloudKey)) {
        cloud = this.add.image(cloudX, cloudY, cloudKey).setDisplaySize(160, 72).setAlpha(0.8).setDepth(-9).setOrigin(0.5);
      } else {
        cloud = this.add.text(cloudX, cloudY, '☁️', { fontSize: '38px' }).setAlpha(0.75).setDepth(-9);
      }

      this.tweens.add({ targets: cloud, x: cloudX + 80, duration: 12000 + i * 3500, yoyo: true, repeat: -1 });
    }

    // Trees
    for (let i = 0; i < 8; i++) {
      const treeX = 70 + (i % 4) * 125;
      const treeY = 150 + Math.floor(i / 4) * 120;
      let tree: Phaser.GameObjects.GameObject;

      if (this.textures.exists('tree-01')) {
        tree = this.add.image(treeX, treeY, 'tree-01').setDisplaySize(84, 108).setOrigin(0.5);
      } else {
        tree = this.add.text(treeX, treeY, '🌳', { fontSize: '34px' }).setOrigin(0.5);
      }
      this.tweens.add({ targets: tree, angle: 4, duration: 1600 + i * 120, yoyo: true, repeat: -1 });
    }

    const forestGateX = w / 2;
    const forestGateY = 118;
    let forestGate: Phaser.GameObjects.GameObject;
    if (this.textures.exists('forest-gate')) {
      forestGate = this.add.image(forestGateX, forestGateY, 'forest-gate').setDisplaySize(160, 90).setOrigin(0.5);
    } else {
      forestGate = this.add.text(forestGateX, forestGateY, '森林探险区', { fontSize: '18px', color: '#315342' }).setOrigin(0.5);
    }
    const gateContainer = this.add.container(forestGateX, forestGateY, [forestGate]);
    gateContainer.setSize(180, 100).setInteractive({ useHandCursor: true }).on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'forest'));

    new BuildingSprite(this, w / 2, 340, '任务小屋', 0xf7d794, () => emitIslandEvent('moxi-open-panel', 'tasks'), 'task-cottage');
    new BuildingSprite(this, 150, 255, '留言板', 0xc9a06a, () => emitIslandEvent('moxi-open-panel', 'messages'), 'message-board');
    new BuildingSprite(this, 390, 255, '农场区', 0xb8df72, () => emitIslandEvent('moxi-open-panel', 'farm'), 'farm-plot');
    new FarmPlotSprite(this, 390, 305, 'farm-plot');
    new BuildingSprite(this, 390, 540, '千灯铺', 0xffc9de, () => emitIslandEvent('moxi-open-panel', 'shop'), 'lantern-shop');

    this.add.text(150, 545, '居民活动区', { fontSize: '17px', color: '#315342' }).setOrigin(0.5);

    const lakeX = w / 2;
    const lakeY = 690;
    let lake: Phaser.GameObjects.GameObject;
    if (this.textures.exists('starlight-lake')) {
      lake = this.add.image(lakeX, lakeY, 'starlight-lake').setDisplaySize(222, 124).setOrigin(0.5);
    } else {
      lake = this.add.ellipse(lakeX, lakeY, 190, 82, 0x81d4fa, 0.9).setStrokeStyle(4, 0xe8fbff);
    }
    const lakeLabel = this.add.text(lakeX, lakeY + 48, '星光湖 ✨', { fontSize: '18px', color: '#26566b' }).setOrigin(0.5);
    const lakeContainer = this.add.container(lakeX, lakeY, [lake, lakeLabel]);
    lakeContainer.setSize(240, 140).setInteractive({ useHandCursor: true }).on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'lake'));
    this.tweens.add({ targets: lake, scaleX: 1.08, alpha: 0.72, duration: 1500, yoyo: true, repeat: -1 });

    islandTiles.forEach((tile) => {
      const isUnlocked = tile.status === 'unlocked';
      const hex = this.add.polygon(tile.position.x, tile.position.y, [35, 0, 17, 30, -17, 30, -35, 0, -17, -30, 17, -30], isUnlocked ? 0xfef3b7 : 0xffffff, isUnlocked ? 0.35 : 0.22)
        .setStrokeStyle(2, isUnlocked ? 0xf7c96b : 0xffffff, 0.7);

      if (isUnlocked) {
        this.add.text(tile.position.x, tile.position.y, '🏝️', { fontSize: '18px' }).setOrigin(0.5);
      } else {
        this.add.text(tile.position.x, tile.position.y, '🔒', { fontSize: '18px' }).setOrigin(0.5);
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
