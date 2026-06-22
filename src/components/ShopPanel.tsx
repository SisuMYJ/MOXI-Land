import { lumoLines } from '../content/lumoLines';
import { shopItems } from '../content/shopItems';
import { useGameStore } from '../store/useGameStore';

export function ShopPanel() {
  const { buyItem, daily, inventory } = useGameStore();
  const line = lumoLines.find((item) => item.id === daily.lumoLineId) ?? lumoLines[0];
  const dailyItems = daily.shopItemIds.map((id) => shopItems.find((item) => item.id === id)).filter((item): item is (typeof shopItems)[number] => Boolean(item));
  const giftCount = inventory.filter((item) => item.startsWith('gift:')).length;
  const fragmentCount = inventory.filter((item) => item.startsWith('fragment:')).length;

  return (
    <div>
      <p className="keeper">星灯兽 Lumo：{line?.text}</p>
      <p className="muted">背包：礼物 {giftCount} · 碎片 {fragmentCount}</p>
      {dailyItems.map((item) => (
        <div className="card" key={item.id}>
          <b>{item.name}</b>
          <span>
            {item.category} · {item.currency === 'star' ? '⭐' : '🌙'}
            {item.price}
          </span>
          <button onClick={() => buyItem(item.id, item.price, item.currency)}>购买</button>
        </div>
      ))}
      <p className="muted">每日商品固定刷新；种子、鱼苗和幼崽会加入农场，礼物与碎片会进入背包。</p>
      <p className="muted">节日集市入口已预留，未来会在特殊日期点灯。</p>
    </div>
  );
}
