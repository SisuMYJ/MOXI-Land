import Phaser from 'phaser';
import { visualAssets } from '../../content/visualAssets';

export class FarmPlotSprite extends Phaser.GameObjects.Container {
	constructor(scene: Phaser.Scene, x: number, y: number, assetKey = 'farm-plot', onClick?: () => void) {
		super(scene, x, y);

		const asset = visualAssets[assetKey];
		const canUsePng = asset?.status === 'usable' && scene.textures.exists(asset.key) && asset.footprint;

		if (canUsePng && asset?.footprint) {
			const shadow = scene.add.ellipse(0, -4, asset.footprint.w * 0.76, 16, 0x000000, 0.1).setOrigin(0.5);
			const image = scene.add.image(0, 0, asset.key).setOrigin(asset.origin?.[0] ?? 0.5, asset.origin?.[1] ?? 1);
			image.setDisplaySize(asset.footprint.w, asset.footprint.h);
			this.add([shadow, image]);

			const [labelX, labelY] = asset.labelOffset ?? [0, 14];
			this.add(
				scene.add
					.text(labelX, labelY, '农场区', {
						fontFamily: 'sans-serif',
						fontSize: '12px',
						color: '#315342',
						backgroundColor: 'rgba(255,248,224,0.64)',
						padding: { x: 5, y: 2 },
					})
					.setOrigin(0.5)
			);

			this.setSize(asset.footprint.w + 28, asset.footprint.h + 34);
		} else {
			// shadow
			const shadow = scene.add.ellipse(0, 28, 110, 30, 0x000000, 0.12).setOrigin(0.5);
			this.add(shadow);

			// fence base
			const fence = scene.add.rectangle(0, -4, 86, 70, 0x8b7355).setStrokeStyle(2, 0xd4a574);
			this.add(fence);

			// soil plots
			for (let i = 0; i < 3; i++) {
				const px = (i - 1) * 26;

				const soil = scene.add.rectangle(px, 6, 22, 18, 0x9c6b45).setStrokeStyle(2, 0xffe4b4);
				const sprout = scene.add.text(px, -14, i === 2 ? '🌿' : '🌱', { fontSize: '18px' }).setOrigin(0.5);

				this.add([soil, sprout]);
			}
		}

		this.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => onClick?.())
			.on('pointerover', () => scene.tweens.add({ targets: this, scale: 1.05, duration: 120 }))
			.on('pointerout', () => scene.tweens.add({ targets: this, scale: 1, duration: 120 }));

		scene.add.existing(this);
		this.setDepth(this.y);
	}
}
