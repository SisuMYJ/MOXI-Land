import Phaser from 'phaser';
import { IslandScene } from './scenes/IslandScene';
import type { IslandSceneState } from './islandSceneState';

export const createGame = (parent: string, initialState: IslandSceneState) =>
  new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: '#bfeecf',
    scale: { mode: Phaser.Scale.RESIZE, width: 540, height: 820 },
    scene: [new IslandScene(initialState)],
    transparent: true,
  });
