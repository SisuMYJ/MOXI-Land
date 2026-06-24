import { useGameStore } from '../store/useGameStore';

export function IslandExpansionPanel() {
  const { islandTiles, unlockIslandTile } = useGameStore();

  return (
    <div>
      <p>扩岛地块是当前版本的 v1 数据结构与 UI 外壳，后续可继续接入新区域、美术与剧情事件。</p>
      {islandTiles.map((tile) => (
        <div className="card" key={tile.id}>
          <div>
            <b>{tile.name}</b>
            <p>{tile.description}</p>
            {tile.unlockCost ? <span>解锁花费：{tile.unlockCost.currency === 'star' ? '⭐' : '🌙'}{tile.unlockCost.amount}</span> : <span>无需解锁</span>}
          </div>
          <div>
            {tile.status === 'unlocked' ? (
              <button disabled>已点亮</button>
            ) : (
              <button onClick={() => unlockIslandTile(tile.id)}>解锁地块</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
