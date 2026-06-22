import { lumoLines } from '../content/lumoLines';
import { shopItems } from '../content/shopItems';
import { pickDailyItem, pickDailyItems } from '../game/systems/dailyPicker';
import { useGameStore } from '../store/useGameStore';

export function ShopPanel() {
  const buy = useGameStore((state) => state.buyItem);
  const line = pickDailyItem(lumoLines, { namespace: 'lumo-line' });
  const dailyItems = pickDailyItems(shopItems, { count: 4, namespace: 'shop-items' });

  return (
    <div>
      <p className="keeper">星灯兽 Lumo：{line?.text}</p>
      {dailyItems.map((item) => (
        <div className="card" key={item.id}>
          <b>{item.name}</b>
          <span>
            {item.category} · {item.currency === 'star' ? '⭐' : '🌙'}
            {item.price}
          </span>
          <button onClick={() => buy(item.id, item.price, item.currency)}>购买</button>
        </div>
      ))}
      <p className="muted">每日商品固定刷新；节日集市入口已预留，未来会在特殊日期点灯。</p>
    </div>
  );
}
