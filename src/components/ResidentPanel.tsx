import { friendshipBandFor, residentDialogues } from '../content/residentDialogues';
import { pickDailyItem } from '../game/systems/dailyPicker';
import { useGameStore } from '../store/useGameStore';
import { todayKey } from '../utils/date';

const iconForSpecies = (species: string) =>
  species === '猫' ? '🐱' : species === '狐狸' ? '🦊' : species === '鹿' ? '🦌' : species === '熊' ? '🐻' : '🐰';

export function ResidentPanel() {
  const { residents, selectedResidentId, weather, inventory, chatResident, giftResident } = useGameStore();
  const resident = residents.find((item) => item.id === selectedResidentId);
  if (!resident) return null;

  const today = todayKey();
  const hasGift = inventory.some((item) => item.startsWith('gift:'));
  const friendshipBand = friendshipBandFor(resident.friendship);
  const candidates = residentDialogues.filter(
    (line) =>
      (line.residentId === resident.id || line.residentId === 'any') &&
      (line.weather === weather || line.weather === 'any') &&
      line.friendshipBand === friendshipBand,
  );
  const fallback = residentDialogues.filter((line) => line.residentId === resident.id || line.residentId === 'any');
  const dailyLine = pickDailyItem(candidates.length ? candidates : fallback, {
    namespace: `resident-${resident.id}-${weather}-${friendshipBand}`,
  });

  return (
    <div>
      <p className="big">{iconForSpecies(resident.species)}</p>
      <h3>
        {resident.name} · 好感度 {resident.friendship}
      </h3>
      <p>{resident.currentMood}</p>
      <blockquote>{dailyLine?.text ?? '今天先一起安静地看看云吧。'}</blockquote>
      <button disabled={resident.chattedDate === today} onClick={() => chatResident(resident.id)}>
        {resident.chattedDate === today ? '今日已聊天' : '聊天'}
      </button>
      <button disabled={resident.giftedDate === today || !hasGift} onClick={() => giftResident(resident.id)}>
        {resident.giftedDate === today ? '今日已送礼' : hasGift ? '送出一个礼物' : '暂无礼物'}
      </button>
    </div>
  );
}
