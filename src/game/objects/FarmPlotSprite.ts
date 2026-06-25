import Phaser from 'phaser';

export class FarmPlotSprite extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    // Draw fence background
    const fence = scene.add.rectangle(0, -4, 80, 72, 0x8b7355)
      .setStrokeStyle(2, 0xd4a574);
    this.add(fence);

    // Draw 3 small farm plots
    for (let i = 0; i < 3; i++) {
      const plotX = (i - 1) * 28;
      
      // Plot soil
      const plot = scene.add.rectangle(plotX, 4, 24, 20, 0x9c6b45)
        .setStrokeStyle(2, 0xffe4b4);
      this.add(plot);

      // Growth stage indicator
      const sprout = scene.add.text(plotX, -14, i === 2 ? '🌿' : '🌱', { 
        fontSize: '20px',
        align: 'center'
      })
        .setOrigin(0.5, 0.5);
      this.add(sprout);

      // Decorative element (fence post)
      const post = scene.add.rectangle(plotX, 18, 2, 10, 0xd4a574);
      this.add(post);
    }

    scene.add.existing(this);

    // Gentle swaying animation
    scene.tweens.add({
      targets: this,
      angle: 1.5,
      duration: 1600,
      yoyo: true,
      repeat: -1,
    });
  }
}
