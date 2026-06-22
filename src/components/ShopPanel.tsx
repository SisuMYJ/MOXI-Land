import { lumoLines } from '../content/lumoLines';
import { shopItems } from '../content/shopItems';
import { pickDailyMany, pickDailyOne } from '../game/systems/dailyPicker';
import { useGameStore } from '../store/useGameStore';
import { todayKey } from '../utils/date';

export function ShopPanel() {
  const { buyItem, weather } = useGameStore();
  const today = todayKey();
  const lumoPool = lumoLines.filter((line) => !line.weather || line.weather.includes(weather));
  const lumoLine = pickDailyOne(lumoPool.length ? lumoPool : lumoLines, `lumo:${today}:${weather}`);
  const dailyItems = pickDailyMany(
    shopItems.filter((item) => item.availableToday),
    4,
    `shop:${today}`,
  );

  return (
    <div>
      <p className="keeper">星灯兽 Lumo：{lumoLine?.text}</p>
      {dailyItems.map((item) => (
        <div className="card" key={item.id}>
          <b>{item.name}</b>
          <span>
            {item.category} · {item.currency === 'star' ? '⭐' : '🌙'}{item.price}
          </span>
          <button onClick={() => buyItem(item.id, item.price, item.currency)}>购买</button>
        </div>
      ))}
      <p className="muted">千灯铺现在每天固定刷新 4 件商品。节日集市入口已预留，未来会在特殊日期点灯。</p>
    </div>
  );
}
