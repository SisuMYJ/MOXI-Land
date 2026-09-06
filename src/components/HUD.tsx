import { useGameStore } from '../store/useGameStore';
import { weatherConfigs } from '../content/weather';

export function HUD() {
  const { stars, moons, weather, inventory, openPanel } = useGameStore();
  const weatherConfig = weatherConfigs[weather];
  const weatherEmoji = weatherConfig?.particleEmoji || '🌤️';
  const weatherLabel = weatherConfig?.label || weather;

  return (
    <div className="hud">
      <span>⭐ {stars} 星星币</span>
      <span>🌙 {moons} 月亮币</span>
      <span title={weatherConfig?.description}>{weatherEmoji} {weatherLabel}</span>
      <button type="button" className="hud-action" onClick={() => openPanel('inventory')}>
        🎒 背包 {inventory.reduce((total, item) => total + item.quantity, 0)}
      </button>
    </div>
  );
}
