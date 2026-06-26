import Phaser from 'phaser';
import type { Resident } from '../../types/game';
import { visualAssets } from '../../content/visualAssets';

const residentMap: Record<string, string> = {
	'mist-cat': 'mist-cat',
	'foko-fox': 'foko-fox',
	'deer-lamp': 'deer-lamp',
	'slow-bear': 'slow-bear',
	'dango-rabbit': 'dango-rabbit',
};

export class ResidentSprite extends Phaser.GameObjects.Container {
	constructor(scene: Phaser.Scene, r: Resident, onClick: () => void) {
		super(scene, r.position?.x ?? 260, r.position?.y ?? 420);

		// shadow
		const shadow = scene.add.ellipse(0, 22, 56, 18, 0x000000, 0.14).setOrigin(0.5);
		this.add(shadow);

		const assetKey = residentMap[r.id];
		const asset = assetKey ? visualAssets[assetKey] : undefined;
		if (asset && scene.textures.exists(asset.key)) {
			const img = scene.add.image(0, -6, asset.key).setOrigin(asset.origin?.[0] ?? 0.5, asset.origin?.[1] ?? 1.0).setScale(asset.scale ?? 1);
			this.add(img);
		} else {
			const body = scene.add.circle(0, -6, 19, 0xffd7a8).setStrokeStyle(3, 0xffffff, 0.85);
			const face = scene.add.text(0, -7, r.species === '猫' ? '🐱' : r.species === '狐狸' ? '🦊' : r.species === '鹿' ? '🦌' : r.species === '熊' ? '🐻' : '🐰', { fontSize: '24px' }).setOrigin(0.5);
			this.add([body, face]);
		}

		const name = scene.add.text(0, 32, r.name, { fontSize: '12px', color: '#315342' }).setOrigin(0.5);
		this.add(name);

		this.setSize(80, 90).setInteractive({ useHandCursor: true }).on('pointerdown', onClick);
		scene.add.existing(this);

		scene.tweens.add({
			targets: this,
			y: this.y - 10,
			duration: 1300,
			yoyo: true,
			repeat: -1,
			ease: 'Sine.inOut',
			delay: Math.random() * 800,
		});

		scene.tweens.add({
			targets: this,
			x: this.x + Phaser.Math.Between(-12, 12),
			duration: 2600,
			yoyo: true,
			repeat: -1,
			ease: 'Sine.inOut',
		});

		this.setDepth(this.y);
	}
}
