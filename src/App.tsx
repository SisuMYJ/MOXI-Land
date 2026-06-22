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
import { ExplorationPanel } from './components/ExplorationPanel';
import { Toast } from './components/Toast';
import type { Panel } from './types/game';
import './styles/global.css';
import './styles/ui.css';

const panelTitles: Record<Exclude<Panel, null>, string> = {
  tasks: '任务小屋',
  shop: '千灯铺',
  farm: '农场区',
  messages: '留言板',
  resident: '居民互动',
  forest: '森林探险',
  lake: '星光湖',
};

export default function App() {
  const game = useRef<Phaser.Game | null>(null);
  const { activePanel, openPanel, closePanel, notify } = useGameStore();

  useEffect(() => {
    if (!game.current) {
      game.current = createGame('game-root');
    }

    const open = (event: Event) => openPanel((event as CustomEvent<Panel>).detail);
    const resident = (event: Event) => openPanel('resident', (event as CustomEvent<string>).detail);
    const toast = (event: Event) => notify((event as CustomEvent<string>).detail);

    window.addEventListener('moxi-open-panel', open);
    window.addEventListener('moxi-open-resident', resident);
    window.addEventListener('moxi-toast', toast);

    return () => {
      window.removeEventListener('moxi-open-panel', open);
      window.removeEventListener('moxi-open-resident', resident);
      window.removeEventListener('moxi-toast', toast);
    };
  }, [notify, openPanel]);

  const title = activePanel ? panelTitles[activePanel] : '';

  return (
    <main>
      <HUD />
      <div id="game-root" aria-label="Moxi Island game canvas" />
      <Toast />
      {activePanel && (
        <Modal title={title} onClose={closePanel}>
          {activePanel === 'tasks' && <TaskPanel />}
          {activePanel === 'shop' && <ShopPanel />}
          {activePanel === 'farm' && <FarmPanel />}
          {activePanel === 'messages' && <MessageBoardPanel />}
          {activePanel === 'resident' && <ResidentPanel />}
          {activePanel === 'forest' && <ExplorationPanel zone="forest" />}
          {activePanel === 'lake' && <ExplorationPanel zone="lake" />}
        </Modal>
      )}
    </main>
  );
}
