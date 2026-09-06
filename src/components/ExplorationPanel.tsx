import { useGameStore } from '../store/useGameStore';
import { todayKey } from '../utils/date';

export function ExplorationPanel({ zone }: { zone: 'forest' | 'lake' }) {
  const { stories, advanceStory, restartStory } = useGameStore();
  const story = stories.find((item) => item.zone === zone)!;
  const currencyIcon = story.dailyCost.currency === 'star' ? '⭐' : '🌙';
  const advancedToday = story.lastAdvancedDate === todayKey();
  const disabled = story.status === 'completed' || advancedToday;

  return (
    <div>
      <h3>
        {story.title} Day {Math.max(1, story.currentDay)} / {story.totalDays}
      </h3>
      <p className="letter">{story.currentDay === 0 ? '故事还没有开始。' : story.storyLines.slice(0, story.currentDay).join('\n')}</p>
      {story.status === 'failed' ? (
        <button onClick={() => restartStory(zone)}>重新整备探索</button>
      ) : (
        <button disabled={disabled} onClick={() => advanceStory(zone)}>
          {story.status === 'completed'
            ? '探索已完成'
            : advancedToday
              ? '今日已推进'
              : `投入 ${currencyIcon}${story.dailyCost.amount} 推进探索`}
        </button>
      )}
      <p className="muted">连续推进探索可在完成后获得特别收藏。</p>
    </div>
  );
}
