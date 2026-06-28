import { useGameStore } from '../store/useGameStore';
import type { Resident } from '../types/game';

const MAX_OUTDOOR_RESIDENTS = 3;

const iconForSpecies = (species: string) =>
  species === '猫' ? '🐱' : species === '狐狸' ? '🦊' : species === '鹿' ? '🦌' : species === '熊' ? '🐻' : '🐰';

const normalizeOutdoorIds = (outsideResidentIds: string[], allResidents: Resident[]) => {
  const allIds = new Set(allResidents.map((resident) => resident.id));
  const validIds = outsideResidentIds.filter((id) => allIds.has(id));
  const maxOutdoorCount = Math.max(1, Math.min(MAX_OUTDOOR_RESIDENTS, allResidents.length - 1));

  if (validIds.length > 0) {
    return validIds.slice(0, maxOutdoorCount);
  }

  return allResidents.slice(0, maxOutdoorCount).map((resident) => resident.id);
};

export function AnimalGardenPanel() {
  const { residents, daily, openPanel } = useGameStore();
  const outdoorIds = normalizeOutdoorIds(daily.outsideResidentIds, residents);
  const outdoorIdSet = new Set(outdoorIds);
  const insideResidents = residents.filter((resident) => !outdoorIdSet.has(resident.id));
  const outsideResidents = outdoorIds
    .map((id) => residents.find((resident) => resident.id === id))
    .filter((resident): resident is Resident => Boolean(resident));

  const renderResidentCard = (resident: Resident, status: string) => (
    <div className="card" key={resident.id}>
      <div>
        <strong>
          {iconForSpecies(resident.species)} {resident.name}
        </strong>
        <span>{status} · {resident.currentMood}</span>
      </div>
      <button onClick={() => openPanel('resident', resident.id)}>去找它</button>
    </div>
  );

  return (
    <div>
      <p className="keeper">花园门半开着。今天有些居民留在里面晒太阳、打盹、照顾小花；有些会跑到主岛路边散步。</p>

      <h3>在花园里休息</h3>
      {insideResidents.length > 0 ? (
        insideResidents.map((resident) => renderResidentCard(resident, '今天在 Animal Garden'))
      ) : (
        <p>今天大家都跑出去玩啦，花园里暂时空空的。</p>
      )}

      <h3>正在岛上散步</h3>
      {outsideResidents.map((resident) => renderResidentCard(resident, '今天在主岛'))}
    </div>
  );
}
