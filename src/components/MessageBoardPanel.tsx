import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

export function MessageBoardPanel() {
  const { board, viewBoard } = useGameStore();

  useEffect(() => {
    viewBoard();
  }, [viewBoard]);

  return (
    <div>
      <p>留言板每天只刷新一次，查看消耗 🌙1。</p>
      <div className="letter">
        {board?.messages?.length ? (
          <ul>
            {board.messages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        ) : (
          board?.message ?? '月亮币不足，留言板上的小灯还没亮。'
        )}
      </div>
    </div>
  );
}
