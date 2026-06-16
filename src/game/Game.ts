import Phaser from 'phaser';
import { IslandScene } from './scenes/IslandScene';
export const createGame = (parent: string) => new Phaser.Game({ type: Phaser.AUTO, parent, backgroundColor:'#bfeecf', scale:{ mode:Phaser.Scale.RESIZE, width:540, height:820 }, scene:[IslandScene], transparent:true });
