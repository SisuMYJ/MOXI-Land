import Phaser from 'phaser';
import type { VisualObjectManifest } from '../../content/visualAssets';

const labelStyle: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: 'serif',
  fontSize: '15px',
  color: '#315342',
  stroke: '#fff8df',
  strokeThickness: 3,
};

type BuildingSpriteOptions = {
  manifest?: VisualObjectManifest;
  color?: number;
};

export class BuildingSprite extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, label: string, color: number, onClick: () => void, options: BuildingSpriteOptions = {}) {
    super(scene, x, y);

    const manifest = options.manifest;
    const footprint = manifest?.interactionFootprint ?? { width: 108, height: 92, offsetY: -28 };
    const shadow = scene.add.ellipse(0, 18, footprint.width * 0.78, 24, 0x315342, 0.16);
    const clearing = scene.add.ellipse(0, 15, footprint.width * 0.92, 40, 0xf4e2b8, 0.48).setStrokeStyle(2, 0xfff4d0, 0.75);

    const children: Phaser.GameObjects.GameObject[] = [clearing, shadow];
    const canUseImage = manifest?.status === 'usable' && scene.textures.exists(manifest.key);

    if (canUseImage && manifest) {
      const image = scene.add
        .image(0, 0, manifest.key)
        .setOrigin(manifest.origin.x, manifest.origin.y)
        .setScale(manifest.scale);
      children.push(image);
    } else {
      children.push(...this.createPainterlyFallback(scene, options.color ?? color, label));
    }

    const labelText = scene.add
      .text(manifest?.labelOffset.x ?? 0, 40 + (manifest?.labelOffset.y ?? 0), label, labelStyle)
      .setOrigin(0.5);
    children.push(labelText);

    this.add(children);
    this.setSize(footprint.width, footprint.height)
      .setInteractive(
        new Phaser.Geom.Rectangle(-footprint.width / 2, -footprint.height + (footprint.offsetY ?? 0), footprint.width, footprint.height),
        Phaser.Geom.Rectangle.Contains,
      )
      .on('pointerdown', onClick)
      .on('pointerover', () => scene.tweens.add({ targets: this, scale: 1.045, duration: 140, ease: 'Sine.out' }))
      .on('pointerout', () => scene.tweens.add({ targets: this, scale: 1, duration: 140, ease: 'Sine.out' }));

    this.setDepth(y);
    scene.add.existing(this);
  }

  private createPainterlyFallback(scene: Phaser.Scene, color: number, label: string) {
    const roofColor = label.includes('千灯') ? 0xf0b66d : label.includes('留言') ? 0xc89558 : 0xeaa66f;
    const baseColor = label.includes('农场') ? 0xaad46c : color;
    const base = scene.add.rectangle(0, -8, 74, 48, baseColor, 0.95).setStrokeStyle(3, 0xfff6d7, 0.9);
    const roof = scene.add.triangle(0, -42, -46, -12, 46, -12, 0, -54, roofColor, 0.98).setStrokeStyle(3, 0xffedc4, 0.84);
    const door = scene.add.rectangle(0, 4, 18, 24, 0x9f6f3f, 0.86).setStrokeStyle(2, 0xffe3ad, 0.9);
    const glow = scene.add.circle(label.includes('千灯') ? 25 : -25, -14, 8, 0xffe89a, 0.72);
    const moss = scene.add.ellipse(-28, 16, 24, 12, 0x7dae65, 0.68);
    return [base, roof, door, glow, moss];
  }
}
