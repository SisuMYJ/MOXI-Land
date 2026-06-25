import { useGameStore } from '../store/useGameStore';
import { weatherConfigs } from '../content/weather';

export function HUD() {
  const { stars, moons, weather } = useGameStore();
  const weatherConfig = weatherConfigs[weather];
  const weatherEmoji = weatherConfig?.particleEmoji || '🌤️';
  const weatherLabel = weatherConfig?.label || weather;

  return (
    <div className="hud">
      <span>⭐ {stars} 星星币</span>
      <span>🌙 {moons} 月亮币</span>
      <span title={weatherConfig?.description}>{weatherEmoji} {weatherLabel}</span>
    </div>
  );
}
