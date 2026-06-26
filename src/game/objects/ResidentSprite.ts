import Phaser from 'phaser';
import type { VisualObjectManifest } from '../../content/visualAssets';
import type { Resident } from '../../types/game';

const residentAssetById: Record<string, string> = {
  'mist-cat': 'mistCat',
  'foko-fox': 'fokoFox',
  'deer-lamp': 'deerLamp',
  'slow-bear': 'slowBear',
  'dango-rabbit': 'dangoRabbit',
};

const furColorBySpecies: Record<string, number> = {
  猫: 0xcac4e9,
  狐狸: 0xf3a24c,
  鹿: 0xd9a46e,
  熊: 0x9a744b,
  兔: 0xf1d5e6,
};

export class ResidentSprite extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, resident: Resident, onClick: () => void, manifests: Record<string, VisualObjectManifest> = {}) {
    super(scene, resident.position?.x ?? 260, resident.position?.y ?? 420);

    const manifest = manifests[residentAssetById[resident.id]];
    const footprint = manifest?.interactionFootprint ?? { width: 58, height: 72, offsetY: -24 };
    const shadow = scene.add.ellipse(0, 18, 42, 15, 0x315342, 0.17);
    const children: Phaser.GameObjects.GameObject[] = [shadow];
    const canUseImage = manifest?.status === 'usable' && scene.textures.exists(manifest.key);

    if (canUseImage && manifest) {
      children.push(
        scene
          .add.image(0, 0, manifest.key)
          .setOrigin(manifest.origin.x, manifest.origin.y)
          .setScale(manifest.scale),
      );
    } else {
      children.push(...this.createPainterlyFallback(scene, resident));
    }

    children.push(
      scene
        .add.text(manifest?.labelOffset.x ?? 0, 30 + (manifest?.labelOffset.y ?? 0), resident.name, {
          fontSize: '12px',
          color: '#315342',
          stroke: '#fff7da',
          strokeThickness: 3,
        })
        .setOrigin(0.5),
    );

    this.add(children);
    this.setSize(footprint.width, footprint.height)
      .setInteractive(
        new Phaser.Geom.Rectangle(-footprint.width / 2, -footprint.height + (footprint.offsetY ?? 0), footprint.width, footprint.height),
        Phaser.Geom.Rectangle.Contains,
      )
      .on('pointerdown', onClick);

    this.setDepth(this.y + 12);
    scene.add.existing(this);
    scene.tweens.add({ targets: this, y: this.y - 8, duration: 1350, yoyo: true, repeat: -1, ease: 'Sine.inOut', delay: Math.random() * 800 });
    scene.tweens.add({ targets: this, x: this.x + Phaser.Math.Between(-16, 16), duration: 2700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }

  private createPainterlyFallback(scene: Phaser.Scene, resident: Resident) {
    const fur = furColorBySpecies[resident.species] ?? 0xf0d2a6;
    const earLeft = scene.add.triangle(-12, -22, -24, -2, -8, -10, -16, -32, fur, 0.96).setStrokeStyle(2, 0xfff2d8, 0.74);
    const earRight = scene.add.triangle(12, -22, 24, -2, 8, -10, 16, -32, fur, 0.96).setStrokeStyle(2, 0xfff2d8, 0.74);
    const body = scene.add.ellipse(0, 1, 38, 42, fur, 0.98).setStrokeStyle(3, 0xfff4dc, 0.9);
    const belly = scene.add.ellipse(0, 8, 22, 24, 0xffead1, 0.45);
    const eyeLeft = scene.add.circle(-7, -4, 2.2, 0x365340, 0.9);
    const eyeRight = scene.add.circle(7, -4, 2.2, 0x365340, 0.9);
    const blush = scene.add.ellipse(0, 3, 5, 3, 0xf4a6a6, 0.5);
    const scarf = scene.add.ellipse(0, 12, 30, 8, 0xb5a6dd, 0.62);
    return [earLeft, earRight, body, belly, eyeLeft, eyeRight, blush, scarf];
  }
}
