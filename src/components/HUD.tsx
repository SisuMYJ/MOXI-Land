import { useGameStore } from '../store/useGameStore';
export function HUD(){const {stars,moons,weather}=useGameStore(); return <div className="hud"><span>⭐ {stars} 星星币</span><span>🌙 {moons} 月亮币</span><span>天气：{weather}</span></div>}
