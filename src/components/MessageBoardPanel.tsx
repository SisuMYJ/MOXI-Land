import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

export function MessageBoardPanel() {
  const { board, viewBoard } = useGameStore();

  useEffect(() => {
    viewBoard();
  }, [viewBoard]);

  return (
    <div>
      <p>留言板每天只刷新一次，查看消耗 🌙1。之后你写的留言会按天气、居民、探索和农场状态进入这里。</p>
      <div className="letter">
        {board?.entries?.length ? (
          board.entries.map((entry) => (
            <p key={entry.id}>
              {entry.speaker && <b>{entry.speaker}：</b>}
              {entry.text}
            </p>
          ))
        ) : (
          <p>月亮币不足，留言板上的小灯还没亮。</p>
        )}
      </div>
    </div>
  );
}
