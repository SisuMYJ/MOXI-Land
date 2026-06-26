import Phaser from 'phaser';
import { visualAssets } from '../../content/visualAssets';

export class FarmPlotSprite extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, assetKey?: string) {
    super(scene, x, y);

    // shadow
    const shadow = scene.add.ellipse(0, 28, 110, 30, 0x000000, 0.12).setOrigin(0.5);
    this.add(shadow);

    const asset = assetKey ? visualAssets[assetKey] : undefined;
    if (asset && scene.textures.exists(asset.key)) {
      const image = scene.add.image(0, 0, asset.key).setOrigin(asset.origin?.[0] ?? 0.5, asset.origin?.[1] ?? 0.5).setScale(asset.scale ?? 1);
      this.add(image);
    } else {
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

        // Growth stage indicator (simple text fallback)
        const sprout = scene.add.text(plotX, -14, i === 2 ? '🌿' : '🌱', {
          fontSize: '20px',
          align: 'center'
        }).setOrigin(0.5, 0.5);
        this.add(sprout);

        const post = scene.add.rectangle(plotX, 18, 2, 10, 0xd4a574);
        this.add(post);
      }
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

    this.setDepth(this.y);
  }
}
