import Phaser from 'phaser';
import { visualAssets } from '../../content/visualAssets';

export class BuildingSprite extends Phaser.GameObjects.Container {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		label: string,
		color: number,
		onClick: () => void,
		assetKey?: string
	) {
		super(scene, x, y);

		const asset = assetKey ? visualAssets[assetKey] : undefined;
		const canUsePng = asset?.status === 'usable' && scene.textures.exists(asset.key) && asset.footprint;

		if (canUsePng && asset?.footprint) {
			const shadow = scene.add.ellipse(0, -4, asset.footprint.w * 0.72, 16, 0x000000, 0.1).setOrigin(0.5);
			const image = scene.add.image(0, 0, asset.key).setOrigin(asset.origin?.[0] ?? 0.5, asset.origin?.[1] ?? 1);
			image.setDisplaySize(asset.footprint.w, asset.footprint.h);
			this.add([shadow, image]);

			const [labelX, labelY] = asset.labelOffset ?? [0, 14];
			const text = scene.add
				.text(labelX, labelY, label, {
					fontFamily: 'sans-serif',
					fontSize: '12px',
					color: '#315342',
					backgroundColor: 'rgba(255,248,224,0.64)',
					padding: { x: 5, y: 2 },
				})
				.setOrigin(0.5);
			this.add(text);

			this.setSize(asset.footprint.w + 28, asset.footprint.h + 34);
		} else {
			// soft shadow
			const shadow = scene.add.ellipse(0, 26, 110, 30, 0x000000, 0.12).setOrigin(0.5);
			this.add(shadow);

			// base ground
			const ground = scene.add.ellipse(0, 18, 120, 36, 0x6fbf8f, 0.25);
			this.add(ground);

			// building body
			const body = scene.add.rectangle(0, 0, 72, 56, color, 1).setStrokeStyle(3, 0xffffff, 0.7);
			const roof = scene.add.triangle(0, -42, -46, 0, 46, 0, 0xf0b66d, 1);

			// small window
			const window = scene.add.rectangle(0, -5, 14, 14, 0xffffff, 0.8);

			// door
			const door = scene.add.rectangle(0, 12, 12, 18, 0x6b4f3a, 1);

			this.add([body, roof, window, door]);

			const text = scene.add
				.text(0, 58, label, { fontFamily: 'sans-serif', fontSize: '15px', color: '#315342' })
				.setOrigin(0.5);
			this.add(text);

			this.setSize(140, 130);
		}

		this.setInteractive({ useHandCursor: true })
			.on('pointerdown', onClick)
			.on('pointerover', () => scene.tweens.add({ targets: this, scale: 1.05, duration: 120 }))
			.on('pointerout', () => scene.tweens.add({ targets: this, scale: 1, duration: 120 }));

		scene.add.existing(this);
		this.setDepth(this.y);
	}
}
