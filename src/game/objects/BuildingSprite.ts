import Phaser from 'phaser';
import { visualAssets } from '../../content/visualAssets';

export class BuildingSprite extends Phaser.GameObjects.Container {
	constructor(scene: Phaser.Scene, x: number, y: number, label: string, color: number, onClick: () => void, assetKey?: string) {
		super(scene, x, y);

		// soft shadow
		const shadow = scene.add.ellipse(0, 26, 100, 28, 0x000000, 0.12).setOrigin(0.5, 0.5);
		this.add(shadow);

		// main body either image or simple shapes
		let main: Phaser.GameObjects.GameObject;
		const asset = assetKey ? visualAssets[assetKey] : undefined;
		if (asset && scene.textures.exists(asset.key)) {
			main = scene.add.image(0, 0, asset.key).setOrigin(asset.origin?.[0] ?? 0.5, asset.origin?.[1] ?? 0.5).setScale(asset.scale ?? 1);
		} else {
			const base = scene.add.ellipse(0, 8, 92, 36, 0x5faa77, 0.32);
			const body = scene.add.rectangle(0, -6, 68, 54, color, 1).setStrokeStyle(3, 0xffffff, 0.7);
			const roof = scene.add.triangle(0, -40, -44, 0, 44, 0, 0xf0b66d, 1);
			main = scene.add.container(0, 0, [base, body, roof]);
		}

		const text = scene.add.text(0, 58, label, { fontFamily: 'sans-serif', fontSize: '15px', color: '#315342' }).setOrigin(0.5);
		this.add([main, text]);

		this.setSize(140, 130).setInteractive({ useHandCursor: true })
			.on('pointerdown', onClick)
			.on('pointerover', () => scene.tweens.add({ targets: this, scale: 1.06, duration: 120 }))
			.on('pointerout', () => scene.tweens.add({ targets: this, scale: 1, duration: 120 }));

		scene.add.existing(this);

		// depth by y
		this.setDepth(this.y);
	}
}
