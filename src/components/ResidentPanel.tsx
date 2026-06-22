import { residentDialogues } from '../content/residentDialogues';
import { pickDailyOne } from '../game/systems/dailyPicker';
import { useGameStore } from '../store/useGameStore';
import { todayKey } from '../utils/date';

export function ResidentPanel() {
  const { residents, selectedResidentId, weather, chatResident, giftResident } = useGameStore();
  const resident = residents.find((item) => item.id === selectedResidentId);
  if (!resident) return null;

  const eligibleDialogues = residentDialogues.filter((line) => {
    const weatherMatch = !line.weather || line.weather.includes(weather);
    const friendshipMatch = !line.minFriendship || resident.friendship >= line.minFriendship;
    return line.residentId === resident.id && weatherMatch && friendshipMatch;
  });
  const dialogue = pickDailyOne(eligibleDialogues.length ? eligibleDialogues : residentDialogues.filter((line) => line.residentId === resident.id), `dialogue:${todayKey()}:${resident.id}:${weather}`);

  return (
    <div>
      <p className="big">{resident.species === '猫' ? '🐱' : resident.species === '狐狸' ? '🦊' : resident.species === '鹿' ? '🦌' : resident.species === '熊' ? '🐻' : '🐰'}</p>
      <h3>{resident.name} · 好感度 {resident.friendship}</h3>
      <p>{resident.currentMood}</p>
      <blockquote>{dialogue?.text ?? '今天也一起在岛上慢慢走吧。'}</blockquote>
      <button onClick={() => chatResident(resident.id)} disabled={resident.chattedDate === todayKey()}>
        {resident.chattedDate === todayKey() ? '今天聊过啦' : '聊天'}
      </button>
      <button onClick={() => giftResident(resident.id)} disabled={resident.giftedDate === todayKey()}>
        {resident.giftedDate === todayKey() ? '今天送过啦' : '送礼（占位）'}
      </button>
    </div>
  );
}
