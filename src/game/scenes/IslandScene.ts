import Phaser from 'phaser';
import { islandTiles } from '../../content/islandTiles';
import { residents } from '../../content/residents';
import { BuildingSprite } from '../objects/BuildingSprite';
import { FarmPlotSprite } from '../objects/FarmPlotSprite';
import { ResidentSprite } from '../objects/ResidentSprite';
import { emitIslandEvent } from '../systems/interactionSystem';

export class IslandScene extends Phaser.Scene {
  constructor() {
    super('IslandScene');
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.add.ellipse(w / 2, h / 2 + 20, 460, 640, 0x8edc8f).setStrokeStyle(8, 0xf9ffd6, 0.9);
    this.add.ellipse(w / 2, h / 2 + 40, 360, 500, 0xa8e6a1);

    [80, 210, 450].forEach((x, i) => {
      const c = this.add.text(x, 70 + i * 26, '☁️', { fontSize: '38px' }).setAlpha(0.75);
      this.tweens.add({ targets: c, x: x + 80, duration: 12000 + i * 3500, yoyo: true, repeat: -1 });
    });

    for (let i = 0; i < 11; i++) {
      const t = this.add.text(70 + (i % 4) * 125, 150 + Math.floor(i / 4) * 120, '🌳', { fontSize: '34px' });
      this.tweens.add({ targets: t, angle: 4, duration: 1100 + i * 90, yoyo: true, repeat: -1 });
    }

    this.add.text(w / 2, 118, '森林探险区', { fontSize: '18px', color: '#315342' }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'forest'));

    new BuildingSprite(this, w / 2, 340, '任务小屋', 0xf7d794, () => emitIslandEvent('moxi-open-panel', 'tasks'));
    new BuildingSprite(this, 150, 255, '留言板', 0xc9a06a, () => emitIslandEvent('moxi-open-panel', 'messages'));
    new BuildingSprite(this, 390, 255, '农场区', 0xb8df72, () => emitIslandEvent('moxi-open-panel', 'farm'));
    new FarmPlotSprite(this, 390, 305);
    new BuildingSprite(this, 390, 540, '千灯铺', 0xffc9de, () => emitIslandEvent('moxi-open-panel', 'shop'));

    this.add.text(150, 545, '居民活动区', { fontSize: '17px', color: '#315342' }).setOrigin(0.5);

    const lake = this.add.ellipse(w / 2, 690, 190, 82, 0x81d4fa, 0.9).setStrokeStyle(4, 0xe8fbff);
    this.add.text(w / 2, 690, '星光湖 ✨', { fontSize: '18px', color: '#26566b' }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'lake'));
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
