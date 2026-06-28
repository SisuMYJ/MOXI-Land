import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGame } from './game/Game';
import { useGameStore } from './store/useGameStore';
import { HUD } from './components/HUD';
import { Modal } from './components/Modal';
import { TaskPanel } from './components/TaskPanel';
import { ShopPanel } from './components/ShopPanel';
import { FarmPanel } from './components/FarmPanel';
import { MessageBoardPanel } from './components/MessageBoardPanel';
import { ResidentPanel } from './components/ResidentPanel';
import { AnimalGardenPanel } from './components/AnimalGardenPanel';
import { ExplorationPanel } from './components/ExplorationPanel';
import { IslandExpansionPanel } from './components/IslandExpansionPanel';
import { Toast } from './components/Toast';
import './styles/global.css';
import './styles/ui.css';

export default function App() {
  const game = useRef<Phaser.Game>();
  const { activePanel, openPanel, closePanel, notify, weather, daily } = useGameStore();

  useEffect(() => {
    // Set weather and daily resident state globally for Phaser scene to access.
    (window as any).__MOXI_WEATHER__ = weather;
    (window as any).__MOXI_OUTSIDE_RESIDENT_IDS__ = daily.outsideResidentIds;

    game.current = createGame('game-root');
    const open = (e: Event) => openPanel((e as CustomEvent).detail);
    const res = (e: Event) => openPanel('resident', (e as CustomEvent).detail);
    const toast = (e: Event) => notify((e as CustomEvent).detail);
    window.addEventListener('moxi-open-panel', open);
    window.addEventListener('moxi-open-resident', res);
    window.addEventListener('moxi-toast', toast);
    return () => {
      window.removeEventListener('moxi-open-panel', open);
      window.removeEventListener('moxi-open-resident', res);
      window.removeEventListener('moxi-toast', toast);
      game.current?.destroy(true);
    };
  }, []);

  // Update globals for React-side daily refreshes. Phaser reads the first value when the scene is created.
  useEffect(() => {
    (window as any).__MOXI_WEATHER__ = weather;
    (window as any).__MOXI_OUTSIDE_RESIDENT_IDS__ = daily.outsideResidentIds;
  }, [weather, daily.outsideResidentIds]);

  const title = {
    tasks: '任务小屋',
    shop: '千灯铺',
    farm: '农场区',
    messages: '留言板',
    resident: '居民互动',
    animalGarden: 'Animal Garden',
    forest: '森林探险',
    lake: '星光湖',
    island: '扩岛计划',
  }[activePanel ?? 'tasks'];

  return (
    <main>
      <HUD />
      <div id="game-root" />
      <Toast />
      {activePanel && (
        <Modal title={title} onClose={closePanel}>
          {activePanel === 'tasks' && <TaskPanel />}
          {activePanel === 'shop' && <ShopPanel />}
          {activePanel === 'farm' && <FarmPanel />}
          {activePanel === 'messages' && <MessageBoardPanel />}
          {activePanel === 'resident' && <ResidentPanel />}
          {activePanel === 'animalGarden' && <AnimalGardenPanel />}
          {activePanel === 'forest' && <ExplorationPanel zone="forest" />}
          {activePanel === 'lake' && <ExplorationPanel zone="lake" />}
          {activePanel === 'island' && <IslandExpansionPanel />}
        </Modal>
      )}
    </main>
  );
}
