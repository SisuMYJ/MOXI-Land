import Phaser from 'phaser';
import { IslandScene } from './scenes/IslandScene';

export const createGame = (parent: string) =>
  new Phaser.Game({
    type: Phaser.CANVAS,
    parent,
    backgroundColor: '#bfeecf',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 540,
      height: 820,
    },
    scene: [IslandScene],
  });
