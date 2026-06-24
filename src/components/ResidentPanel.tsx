import { friendshipBandFor, residentDialogues } from '../content/residentDialogues';
import { pickDailyItem } from '../game/systems/dailyPicker';
import { useGameStore } from '../store/useGameStore';
import { useState } from 'react';

const iconForSpecies = (species: string) =>
  species === '猫' ? '🐱' : species === '狐狸' ? '🦊' : species === '鹿' ? '🦌' : species === '熊' ? '🐻' : '🐰';

export function ResidentPanel() {
  const { residents, selectedResidentId, weather, chatResident, giftResident, inventory } = useGameStore();
  const [selectedGiftId, setSelectedGiftId] = useState<string | undefined>();

  const resident = residents.find((item) => item.id === selectedResidentId);
  if (!resident) return null;

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

  const gifts = inventory.filter((it) => it.category === 'gift');
  const alreadyGifted = resident.giftedDate === new Date().toISOString().split('T')[0];
  const hasGift = gifts.length > 0;

  return (
    <div>
      <p className="big">{iconForSpecies(resident.species)}</p>
      <h3>
        {resident.name} · 好感度 {resident.friendship}
      </h3>
      <p>{resident.currentMood}</p>
      <blockquote>{dailyLine?.text ?? '今天先一起安静地看看云吧。'}</blockquote>
      <button onClick={() => chatResident(resident.id)}>聊天</button>
      {hasGift ? (
        <div>
          <select
            value={selectedGiftId ?? ''}
            onChange={(e: { target: { value: string } }) => setSelectedGiftId(e.target.value || undefined)}
          >
            <option value="">选择礼物</option>
            {gifts.map((gift) => (
              <option key={gift.id} value={gift.id}>
                {gift.name} ({gift.quantity})
              </option>
            ))}
          </select>
          <button
            disabled={alreadyGifted || !selectedGiftId}
            onClick={() => selectedGiftId && giftResident(resident.id, selectedGiftId)}
          >
            送礼
          </button>
        </div>
      ) : (
        <button disabled>送礼（背包无礼物）</button>
      )}
    </div>
  );
}
