import Phaser from 'phaser';
import { residents } from '../../content/residents';
import { BuildingSprite } from '../objects/BuildingSprite';
import { FarmPlotSprite } from '../objects/FarmPlotSprite';
import { ResidentSprite } from '../objects/ResidentSprite';
import { emitIslandEvent } from '../systems/interactionSystem';

const lockedHexPoints = [
  { x: 35, y: 0 },
  { x: 17, y: 30 },
  { x: -17, y: 30 },
  { x: -35, y: 0 },
  { x: -17, y: -30 },
  { x: 17, y: -30 },
];

export class IslandScene extends Phaser.Scene {
  constructor() {
    super('IslandScene');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.add.ellipse(width / 2, height / 2 + 20, 460, 640, 0x8edc8f).setStrokeStyle(8, 0xf9ffd6, 0.9);
    this.add.ellipse(width / 2, height / 2 + 40, 360, 500, 0xa8e6a1);

    [80, 210, 450].forEach((x, index) => {
      const cloud = this.add.text(x, 70 + index * 26, '☁️', { fontSize: '38px' }).setAlpha(0.75);
      this.tweens.add({ targets: cloud, x: x + 80, duration: 12000 + index * 3500, yoyo: true, repeat: -1 });
    });

    for (let index = 0; index < 11; index += 1) {
      const tree = this.add.text(70 + (index % 4) * 125, 150 + Math.floor(index / 4) * 120, '🌳', { fontSize: '34px' });
      this.tweens.add({ targets: tree, angle: 4, duration: 1100 + index * 90, yoyo: true, repeat: -1 });
    }

    this.add
      .text(width / 2, 118, '森林探险区', { fontSize: '18px', color: '#315342' })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'forest'));

    new BuildingSprite(this, width / 2, 340, '任务小屋', 0xf7d794, () => emitIslandEvent('moxi-open-panel', 'tasks'));
    new BuildingSprite(this, 150, 255, '留言板', 0xc9a06a, () => emitIslandEvent('moxi-open-panel', 'messages'));
    new BuildingSprite(this, 390, 255, '农场区', 0xb8df72, () => emitIslandEvent('moxi-open-panel', 'farm'));
    new FarmPlotSprite(this, 390, 305);
    new BuildingSprite(this, 390, 540, '千灯铺', 0xffc9de, () => emitIslandEvent('moxi-open-panel', 'shop'));

    this.add.text(150, 545, '居民活动区', { fontSize: '17px', color: '#315342' }).setOrigin(0.5);

    const lake = this.add.ellipse(width / 2, 690, 190, 82, 0x81d4fa, 0.9).setStrokeStyle(4, 0xe8fbff);
    this.add
      .text(width / 2, 690, '星光湖 ✨', { fontSize: '18px', color: '#26566b' })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'lake'));
    this.tweens.add({ targets: lake, scaleX: 1.08, alpha: 0.72, duration: 1500, yoyo: true, repeat: -1 });

    [
      { x: 80, y: 650 },
      { x: 470, y: 135 },
      { x: 70, y: 390 },
    ].forEach(({ x, y }) => {
      const hex = this.add.polygon(x, y, lockedHexPoints, 0xffffff, 0.25).setStrokeStyle(2, 0xffffff, 0.6);
      this.add.text(x, y, '🔒', { fontSize: '18px' }).setOrigin(0.5);
      hex
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => emitIslandEvent('moxi-toast', '未来可解锁的六边形地块'));
    });

    residents
      .filter((resident) => resident.isOutsideToday)
      .forEach((resident) => new ResidentSprite(this, resident, () => emitIslandEvent('moxi-open-resident', resident.id)));
  }
}
