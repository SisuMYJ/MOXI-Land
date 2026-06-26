import Phaser from 'phaser';
import type { Resident } from '../../types/game';

export class ResidentSprite extends Phaser.GameObjects.Container {
	constructor(scene: Phaser.Scene, r: Resident, onClick: () => void) {
		super(scene, r.position?.x ?? 260, r.position?.y ?? 420);

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

		this.setSize(80, 90)
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', onClick);

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