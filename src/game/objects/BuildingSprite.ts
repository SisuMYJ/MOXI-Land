import Phaser from 'phaser';

export class BuildingSprite extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, label: string, color: number, onClick: () => void, assetKey?: string) {
    super(scene, x, y);

    let body: Phaser.GameObjects.GameObject;
    if (assetKey && scene.textures.exists(assetKey)) {
      body = scene.add.image(0, 0, assetKey).setDisplaySize(132, 112).setOrigin(0.5);
    } else {
      const base = scene.add.ellipse(0, 18, 92, 36, 0x5faa77, 0.32);
      const rect = scene.add.rectangle(0, 0, 68, 54, color, 1).setStrokeStyle(3, 0xffffff, 0.7);
      const roof = scene.add.triangle(0, -35, -44, 0, 44, 0, 0xf0b66d, 1);
      body = scene.add.container(0, 0, [base, rect, roof]);
    }

    const text = scene.add.text(0, 58, label, { fontFamily: 'sans-serif', fontSize: '15px', color: '#315342' }).setOrigin(0.5);
    this.add([body, text]);

    this.setSize(132, 130).setInteractive({ useHandCursor: true })
      .on('pointerdown', onClick)
      .on('pointerover', () => scene.tweens.add({ targets: this, scale: 1.07, duration: 120 }))
      .on('pointerout', () => scene.tweens.add({ targets: this, scale: 1, duration: 120 }));

    scene.add.existing(this);
  }
}
