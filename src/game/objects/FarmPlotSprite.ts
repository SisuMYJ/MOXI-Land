import Phaser from 'phaser';

export class FarmPlotSprite extends Phaser.GameObjects.Container {
	constructor(scene: Phaser.Scene, x: number, y: number, onClick?: () => void) {
		super(scene, x, y);

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

		this.setSize(140, 120)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', onClick ?? (() => {}));

		scene.add.existing(this);
		this.setDepth(this.y);
	}
}