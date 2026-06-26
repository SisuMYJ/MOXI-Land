import Phaser from 'phaser';
import { residents } from '../../content/residents';
import { usableVisualObjects, visualObjects } from '../../content/visualAssets';
import { todayKey } from '../../utils/date';
import { BuildingSprite } from '../objects/BuildingSprite';
import { FarmPlotSprite } from '../objects/FarmPlotSprite';
import { ResidentSprite } from '../objects/ResidentSprite';
import { emitIslandEvent } from '../systems/interactionSystem';
import { pickDailyItems } from '../systems/dailyPicker';

export class IslandScene extends Phaser.Scene {
  constructor() {
    super('IslandScene');
  }

  preload() {
    usableVisualObjects.forEach((asset) => {
      this.load.image(asset.key, asset.imagePath);
    });
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.createBackground(w, h);
    this.createIslandBase(w, h);
    this.createAmbientClouds();
    this.createTreeLine();
    this.createLockedTiles();

    this.createForestGate(w);
    this.createBuildings(w);
    this.createLake(w);
    this.createResidents();
  }

  private createBackground(w: number, h: number) {
    this.add.rectangle(w / 2, h / 2, w, h, 0xdff2ea).setDepth(-100);
    this.add.rectangle(w / 2, 82, w, 170, 0xb8d7dc, 0.7).setDepth(-99);
    this.add.ellipse(w / 2, 134, w * 1.08, 140, 0xf7f0cf, 0.35).setDepth(-98);
  }

  private createIslandBase(w: number, h: number) {
    const cx = w / 2;
    const cy = h / 2 + 28;
    this.add.ellipse(cx, cy + 2, 464, 648, 0xf8edc9, 0.95).setDepth(-70);
    this.add.ellipse(cx, cy, 438, 620, 0x91d98e, 0.92).setDepth(-69);
    this.add.ellipse(cx - 26, cy + 12, 350, 538, 0xa9e4a1, 0.52).setDepth(-68);
    this.add.ellipse(cx + 46, cy - 32, 250, 430, 0xbcebb1, 0.28).setDepth(-67);
    this.add.ellipse(cx - 110, cy + 86, 120, 250, 0x7bc67c, 0.22).setDepth(-66);

    this.createClearing(cx, 340, 128, 68);
    this.createClearing(150, 270, 104, 56);
    this.createClearing(390, 318, 146, 74);
    this.createClearing(390, 548, 112, 58);
    this.createPath([cx, 382, 270, 340, 196, 292, 150, 270]);
    this.createPath([cx, 382, 330, 430, 390, 548]);
  }

  private createClearing(x: number, y: number, width: number, height: number) {
    this.add.ellipse(x, y + 12, width, height, 0xf1ddb3, 0.42).setDepth(y - 34);
    this.add.ellipse(x, y + 8, width * 0.82, height * 0.58, 0xfff4cf, 0.26).setDepth(y - 33);
  }

  private createPath(points: number[]) {
    const path = this.add.graphics().setDepth(-55);
    path.lineStyle(24, 0xead3a4, 0.2);
    path.beginPath();
    path.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) {
      path.lineTo(points[i], points[i + 1]);
    }
    path.strokePath();
    path.lineStyle(12, 0xffefc7, 0.2);
    path.strokePath();
  }

  private createAmbientClouds() {
    [
      { x: 82, y: 74, scale: 1 },
      { x: 212, y: 104, scale: 0.82 },
      { x: 450, y: 80, scale: 0.72 },
    ].forEach((cloud, i) => {
      const shape = this.add.container(cloud.x, cloud.y).setAlpha(0.62).setDepth(-20).setScale(cloud.scale);
      shape.add([
        this.add.ellipse(-18, 6, 42, 22, 0xfffbf2, 0.82),
        this.add.ellipse(8, 0, 48, 28, 0xfffbf2, 0.88),
        this.add.ellipse(34, 8, 38, 20, 0xfffbf2, 0.78),
      ]);
      this.tweens.add({ targets: shape, x: cloud.x + 72, duration: 12000 + i * 3500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    });
  }

  private createTreeLine() {
    const treePositions = [
      [82, 182],
      [438, 178],
      [80, 372],
      [188, 290],
      [436, 320],
      [180, 520],
      [276, 508],
      [464, 498],
      [86, 628],
      [452, 628],
    ];

    treePositions.forEach(([x, y], i) => {
      const tree = this.add.container(x, y).setDepth(y);
      const shadow = this.add.ellipse(0, 24, 38, 14, 0x315342, 0.13);
      const trunk = this.add.rectangle(0, 14, 10, 28, 0x9d6d43, 0.95);
      const leafA = this.add.circle(-9, -5, 18, 0x5faa66, 0.92);
      const leafB = this.add.circle(9, -8, 20, 0x75bf6d, 0.94);
      const leafC = this.add.circle(0, -22, 17, 0x8dd27b, 0.9);
      tree.add([shadow, trunk, leafA, leafB, leafC]);
      this.tweens.add({ targets: tree, angle: 3, duration: 1200 + i * 70, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    });
  }

  private createForestGate(w: number) {
    this.createClearing(w / 2, 150, 154, 54);
    const gate = new BuildingSprite(this, w / 2, 154, '森林探险区', 0x8ecf86, () => emitIslandEvent('moxi-open-panel', 'forest'), {
      manifest: visualObjects.forestGate,
      color: 0x8ecf86,
    });
    gate.setScale(0.88);
  }

  private createBuildings(w: number) {
    new BuildingSprite(this, w / 2, 340, '任务小屋', 0xf7d794, () => emitIslandEvent('moxi-open-panel', 'tasks'), {
      manifest: visualObjects.taskCottage,
    });
    new BuildingSprite(this, 150, 270, '留言板', 0xc9a06a, () => emitIslandEvent('moxi-open-panel', 'messages'), {
      manifest: visualObjects.messageBoard,
    });
    new BuildingSprite(this, 390, 320, '农场区', 0xb8df72, () => emitIslandEvent('moxi-open-panel', 'farm'), {
      manifest: visualObjects.farmPlot,
    });
    new FarmPlotSprite(this, 390, 336);
    new BuildingSprite(this, 390, 548, '千灯铺', 0xffc9de, () => emitIslandEvent('moxi-open-panel', 'shop'), {
      manifest: visualObjects.lanternShop,
    });

    this.add
      .text(150, 545, '居民活动区', { fontSize: '17px', color: '#315342', stroke: '#fff8df', strokeThickness: 3 })
      .setOrigin(0.5)
      .setDepth(545);
  }

  private createLake(w: number) {
    const lakeManifest = visualObjects.starlightLake;
    const lake = this.add.ellipse(w / 2, 690, 205, 86, 0x8fd8dd, 0.82).setStrokeStyle(6, 0xfff3cf, 0.78).setDepth(610);
    this.add.ellipse(w / 2 - 22, 684, 128, 44, 0xbdeef0, 0.38).setDepth(611);
    this.add
      .text(w / 2, 690 + lakeManifest.labelOffset.y, '星光湖', { fontSize: '18px', color: '#26566b', stroke: '#fff8df', strokeThickness: 3 })
      .setOrigin(0.5)
      .setDepth(720);
    lake
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'lake'));
    this.tweens.add({ targets: lake, scaleX: 1.08, alpha: 0.72, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }

  private createLockedTiles() {
    [
      [82, 650],
      [470, 135],
      [72, 405],
    ].forEach(([x, y]) => {
      const hex = this.add
        .polygon(x, y, [35, 0, 17, 30, -17, 30, -35, 0, -17, -30, 17, -30], 0xfff8df, 0.18)
        .setStrokeStyle(2, 0xfff8df, 0.62)
        .setDepth(y - 2);
      const lock = this.add.rectangle(x, y + 20, 14, 14, 0xdba94f, 0.72).setStrokeStyle(1, 0xfff4cf, 0.8).setDepth(y + 1);
      hex.setInteractive({ useHandCursor: true }).on('pointerdown', () => emitIslandEvent('moxi-toast', '未来可解锁的六边形地块'));
      lock.setInteractive({ useHandCursor: true }).on('pointerdown', () => emitIslandEvent('moxi-toast', '未来可解锁的六边形地块'));
    });
  }

  private createResidents() {
    const today = todayKey();
    const residentCount = Math.min(residents.length, 3 + (Number(today.replace(/-/g, '')) % 3));
    pickDailyItems(residents, { count: residentCount, namespace: 'outside-residents', date: today }).forEach((resident) => {
      new ResidentSprite(this, resident, () => emitIslandEvent('moxi-open-resident', resident.id), visualObjects);
    });
  }
}
