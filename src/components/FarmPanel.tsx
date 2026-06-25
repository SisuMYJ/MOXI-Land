import type { FarmItem, FarmStage } from '../types/game';
import { useGameStore } from '../store/useGameStore';

function iconForFarmItem(item: FarmItem): string {
  if (item.category === 'plant') {
    switch (item.stage) {
      case 'seed': return '🌾';
      case 'sprout': return '🌱';
      case 'growing': return '🌿';
      case 'mature': return '🌳';
      default: return '🌱';
    }
  } else {
    switch (item.stage) {
      case 'baby': return '🐣';
      case 'young': return '🐑';
      case 'mature': return '🐑';
      default: return '🐑';
    }
  }
}

function labelForStage(stage: FarmStage): string {
  const stageLabels: Record<FarmStage, string> = {
    'seed': '种子',
    'sprout': '发芽',
    'growing': '成长中',
    'mature': '成熟',
    'baby': '幼小',
    'young': '成长中',
  };
  return stageLabels[stage] || stage;
}

export function FarmPanel() {
  const { farm, careFarm, sellProduce } = useGameStore();
  
  return (
    <div>
      <button className="primary" onClick={careFarm}>一键浇水喂食（消耗 ⭐1）</button>
      <div className="farmgrid">
        {farm.map(f => {
          const progress = Math.floor((f.currentGrowDays / f.growDaysRequired) * 100);
          const isMature = f.stage === 'mature';
          
          return (
            <div className={`plot ${isMature ? 'mature' : ''} ${f.caredToday ? 'cared' : ''}`} key={f.id}>
              <div className="stage-icon">{iconForFarmItem(f)}</div>
              <b className="farm-name">{f.name}</b>
              <div className="farm-type">
                {f.category === 'plant' ? '🌿 植物' : '🐾 动物'}
              </div>
              <div className="farm-stage">成长阶段：{labelForStage(f.stage)}</div>
              <div className="farm-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="progress-text">{f.currentGrowDays}/{f.growDaysRequired} 天</span>
              </div>
              <div className="farm-produce">
                📦 {f.resourceName}
              </div>
              <div className="farm-value">
                💰 🌙{f.sellMoonValue}
              </div>
              {f.caredToday && <div className="cared-badge">✓ 已照顾</div>}
              <button 
                className={`farm-btn ${isMature ? 'sell-btn' : 'locked-btn'}`}
                disabled={!isMature} 
                onClick={() => sellProduce(f.id)}
              >
                {isMature ? `出售` : '未成熟'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
