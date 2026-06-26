import Phaser from 'phaser';

export class BuildingSprite extends Phaser.GameObjects.Container {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		label: string,
		color: number,
		onClick: () => void,
		_assetKey?: string
	) {
		super(scene, x, y);

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

		this.setSize(140, 130)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', onClick)
			.on('pointerover', () => scene.tweens.add({ targets: this, scale: 1.05, duration: 120 }))
			.on('pointerout', () => scene.tweens.add({ targets: this, scale: 1, duration: 120 }));

		scene.add.existing(this);
		this.setDepth(this.y);
	}
}