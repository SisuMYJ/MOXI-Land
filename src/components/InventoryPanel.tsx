import { useGameStore } from '../store/useGameStore';
import type { InventoryItem } from '../types/game';

const categoryLabel: Record<InventoryItem['category'], string> = {
  gift: '礼物',
  fragment: '碎片',
  resource: '资源',
  reward: '探索奖励',
};

export function InventoryPanel() {
  const inventory = useGameStore((state) => state.inventory);

  if (inventory.length === 0) {
    return <p className="letter">背包还是空的。去千灯铺看看，或者完成一段探索吧。</p>;
  }

  return (
    <div>
      {inventory.map((item) => (
        <div className="card" key={item.id}>
          <div>
            <b>{item.name}</b>
            <p className="muted">
              {categoryLabel[item.category]}
              {item.tags?.length ? ` · ${item.tags.join(' / ')}` : ''}
            </p>
          </div>
          <strong aria-label={`数量 ${item.quantity}`}>×{item.quantity}</strong>
        </div>
      ))}
    </div>
  );
}

