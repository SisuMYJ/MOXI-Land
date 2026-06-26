import { useGameStore } from '../store/useGameStore';
import { todayKey } from '../utils/date';

export function ExplorationPanel({ zone }: { zone: 'forest' | 'lake' }) {
  const { stories, advanceStory } = useGameStore();
  const story = stories.find((item) => item.zone === zone)!;
  const currencyIcon = story.dailyCost.currency === 'star' ? '⭐' : '🌙';
  const advancedToday = story.lastAdvancedDate === todayKey();
  const disabled = story.status === 'completed' || story.status === 'failed' || advancedToday;

  return (
    <div>
      <h3>
        {story.title} Day {Math.max(1, story.currentDay)} / {story.totalDays}
      </h3>
      <p className="letter">{story.currentDay === 0 ? '故事还没有开始。' : story.storyLines.slice(0, story.currentDay).join('\n')}</p>
      <button disabled={disabled} onClick={() => advanceStory(zone)}>
        {story.status === 'completed'
          ? '探索已完成'
          : story.status === 'failed'
            ? '探索已关闭'
            : advancedToday
              ? '今日已推进'
              : `投入 ${currencyIcon}${story.dailyCost.amount} 推进探索`}
      </button>
      <p className="muted">预留连续天数、中断失败与奖励：{story.rewardIds.join('、')}</p>
    </div>
  );
}
