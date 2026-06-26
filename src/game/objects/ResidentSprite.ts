import Phaser from 'phaser';
import type { Resident } from '../../types/game';
import { visualAssets } from '../../content/visualAssets';

export class ResidentSprite extends Phaser.GameObjects.Container {
	constructor(scene: Phaser.Scene, r: Resident, onClick: () => void) {
		super(scene, r.position?.x ?? 260, r.position?.y ?? 420);

		const asset = visualAssets[r.id];
		const canUsePng = asset?.status === 'usable' && scene.textures.exists(asset.key) && asset.footprint;

		if (canUsePng && asset?.footprint) {
			const shadow = scene.add.ellipse(0, -4, asset.footprint.w * 0.62, 12, 0x000000, 0.12).setOrigin(0.5);
			const image = scene.add.image(0, 0, asset.key).setOrigin(asset.origin?.[0] ?? 0.5, asset.origin?.[1] ?? 1);
			image.setDisplaySize(asset.footprint.w, asset.footprint.h);
			this.add([shadow, image]);

			const name = scene.add
				.text(0, 10, r.name, {
					fontSize: '11px',
					color: '#315342',
					backgroundColor: 'rgba(255,248,224,0.62)',
					padding: { x: 4, y: 1 },
				})
				.setOrigin(0.5);
			this.add(name);

			this.setSize(asset.footprint.w + 22, asset.footprint.h + 26);
		} else {
			// shadow
			const shadow = scene.add.ellipse(0, 22, 56, 18, 0x000000, 0.14).setOrigin(0.5);
			this.add(shadow);

			// body
			const body = scene.add.circle(0, -6, 20, 0xffd7a8, 1).setStrokeStyle(3, 0xffffff, 0.85);

			// face icon
			const face = scene.add.text(
				0,
				-8,
				r.species === '猫'
					? '🐱'
					: r.species === '狐狸'
					? '🦊'
					: r.species === '鹿'
					? '🦌'
					: r.species === '熊'
					? '🐻'
					: '🐰',
				{ fontSize: '24px' }
			).setOrigin(0.5);

			this.add([body, face]);

			const name = scene.add.text(0, 32, r.name, { fontSize: '12px', color: '#315342' }).setOrigin(0.5);
			this.add(name);

			this.setSize(80, 90);
		}

		this.setInteractive({ useHandCursor: true }).on('pointerdown', onClick);

		scene.add.existing(this);

		// idle animation
		scene.tweens.add({
			targets: this,
			y: this.y - 8,
			duration: 1300,
			yoyo: true,
			repeat: -1,
			ease: 'Sine.inOut',
		});

		this.setDepth(this.y);
	}
}
