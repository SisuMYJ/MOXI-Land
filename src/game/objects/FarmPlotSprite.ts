import Phaser from 'phaser';

export class FarmPlotSprite extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    const bed = scene.add.rectangle(0, 4, 94, 44, 0x8d623e, 0.92).setStrokeStyle(2, 0xe1b477, 0.7);
    const rim = scene.add.rectangle(0, -19, 94, 8, 0xb98957, 0.8);
    this.add([bed, rim]);

    for (let i = 0; i < 3; i += 1) {
      const px = (i - 1) * 28;
      const mound = scene.add.ellipse(px, 8, 24, 12, 0x6d4b32, 0.62);
      const stem = scene.add.rectangle(px, -8, 4, 20, 0x5f9b54, 0.9);
      const leafLeft = scene.add.ellipse(px - 7, -12, 14, 7, 0x9bcf72, 0.92).setAngle(-28);
      const leafRight = scene.add.ellipse(px + 7, -15, 14, 7, 0xb9dd7b, 0.92).setAngle(28);
      this.add([mound, stem, leafLeft, leafRight]);
    }

    this.setDepth(y);
    scene.add.existing(this);
    scene.tweens.add({ targets: this, angle: 1.5, duration: 1700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }
}
