import { useEffect, useRef } from 'react';
import type Phaser from 'phaser';
import { useGameStore } from './store/useGameStore';
import { HUD } from './components/HUD';
import { Modal } from './components/Modal';
import { TaskPanel } from './components/TaskPanel';
import { ShopPanel } from './components/ShopPanel';
import { FarmPanel } from './components/FarmPanel';
import { MessageBoardPanel } from './components/MessageBoardPanel';
import { ResidentPanel } from './components/ResidentPanel';
import { ExplorationPanel } from './components/ExplorationPanel';
import { IslandExpansionPanel } from './components/IslandExpansionPanel';
import { Toast } from './components/Toast';
import { InventoryPanel } from './components/InventoryPanel';
import type { IslandSceneState } from './game/islandSceneState';
import './styles/global.css';
import './styles/ui.css';

export default function App() {
  const game = useRef<Phaser.Game>();
  const { activePanel, openPanel, closePanel, notify } = useGameStore();

  useEffect(() => {
    let disposed = false;
    let unsubscribe: () => void = () => undefined;
    const sceneStateFor = (state: ReturnType<typeof useGameStore.getState>): IslandSceneState => ({
      weather: state.weather,
      islandTiles: state.islandTiles,
      residents: state.residents.filter((resident) => state.daily.outsideResidentIds.includes(resident.id)),
    });
    const signatureFor = (state: IslandSceneState) =>
      JSON.stringify({
        weather: state.weather,
        tiles: state.islandTiles.map(({ id, status }) => [id, status]),
        residents: state.residents.map(({ id, position }) => [id, position]),
      });

    const open = (e: Event) => openPanel((e as CustomEvent).detail);
    const res = (e: Event) => openPanel('resident', (e as CustomEvent).detail);
    const toast = (e: Event) => notify((e as CustomEvent).detail);
    window.addEventListener('moxi-open-panel', open);
    window.addEventListener('moxi-open-resident', res);
    window.addEventListener('moxi-toast', toast);
    void import('./game/Game').then(({ createGame }) => {
      if (disposed) return;
      const initialSceneState = sceneStateFor(useGameStore.getState());
      let sceneSignature = signatureFor(initialSceneState);
      game.current = createGame('game-root', initialSceneState);
      unsubscribe = useGameStore.subscribe((state) => {
        const nextSceneState = sceneStateFor(state);
        const nextSignature = signatureFor(nextSceneState);
        if (nextSignature === sceneSignature) return;
        sceneSignature = nextSignature;
        game.current?.scene.getScene('IslandScene')?.scene.restart(nextSceneState);
      });
    });
    return () => {
      disposed = true;
      window.removeEventListener('moxi-open-panel', open);
      window.removeEventListener('moxi-open-resident', res);
      window.removeEventListener('moxi-toast', toast);
      unsubscribe();
      game.current?.destroy(true);
    };
  }, []);

  useEffect(() => {
    let midnightTimer: number;
    const refreshDaily = () => useGameStore.getState().refreshDaily();
    const scheduleMidnightRefresh = () => {
      window.clearTimeout(midnightTimer);
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 1, 0);
      midnightTimer = window.setTimeout(() => {
        refreshDaily();
        scheduleMidnightRefresh();
      }, nextMidnight.getTime() - now.getTime());
    };
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') refreshDaily();
    };

    refreshDaily();
    scheduleMidnightRefresh();
    window.addEventListener('focus', refreshDaily);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      window.clearTimeout(midnightTimer);
      window.removeEventListener('focus', refreshDaily);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, []);

  const title = {
    tasks: '任务小屋',
    shop: '千灯铺',
    farm: '农场区',
    inventory: '旅行背包',
    messages: '留言板',
    resident: '居民互动',
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
          {activePanel === 'inventory' && <InventoryPanel />}
          {activePanel === 'messages' && <MessageBoardPanel />}
          {activePanel === 'resident' && <ResidentPanel />}
          {activePanel === 'forest' && <ExplorationPanel zone="forest" />}
          {activePanel === 'lake' && <ExplorationPanel zone="lake" />}
          {activePanel === 'island' && <IslandExpansionPanel />}
        </Modal>
      )}
    </main>
  );
}
