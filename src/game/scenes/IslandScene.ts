import Phaser from 'phaser';
import { weatherConfigs } from '../../content/weather';
import { residents } from '../../content/residents';
import type { Resident } from '../../types/game';
import { assetList } from '../../content/visualAssets';
import { BuildingSprite } from '../objects/BuildingSprite';
import { FarmPlotSprite } from '../objects/FarmPlotSprite';
import { ResidentSprite } from '../objects/ResidentSprite';
import { emitIslandEvent } from '../systems/interactionSystem';

const BASELAND_TEXTURE_KEY = 'baseland-portrait-v1';
const BASELAND_ASPECT = 1440 / 2520;
const MAX_OUTDOOR_RESIDENTS = 3;

type IslandLayout = {
  centerX: number;
  mapTop: number;
  mapBottom: number;
  baseX: number;
  baseY: number;
  baseSize: number;
  bgX: number;
  bgY: number;
  bgW: number;
  bgH: number;
  forestX: number;
  forestY: number;
  lakeX: number;
  lakeY: number;
  taskX: number;
  taskY: number;
  messageX: number;
  messageY: number;
  farmPlotX: number;
  farmPlotY: number;
  shopX: number;
  shopY: number;
  animalGardenX: number;
  animalGardenY: number;
};

export class IslandScene extends Phaser.Scene {
  private currentWeather: string = '晴天';

  constructor() {
    super('IslandScene');
  }

  // Get current weather from global state (injected from React)
  private initWeather() {
    const weatherElement = (window as any).__MOXI_WEATHER__;
    if (weatherElement) {
      this.currentWeather = weatherElement;
    }
  }

  private getLayout(w: number, h: number): IslandLayout {
    // Mobile-first portrait stage. Desktop displays this centered inside a quiet page shell.
    const isCompact = w < 700;
    const mapTop = 0;
    const mapBottom = h;
    const bgTop = isCompact ? -22 : 0;
    const bgH = Math.max(h - bgTop, isCompact ? 760 : 780);
    const bgW = bgH * BASELAND_ASPECT;
    const bgX = w / 2;
    const bgY = bgTop + bgH / 2;

    const at = (u: number, v: number) => ({
      x: bgX - bgW / 2 + u * bgW,
      y: bgTop + v * bgH,
    });

    const forest = at(0.52, 0.32);
    const lake = at(0.5, 0.52);

    // Place map objects by their front/door side, not by visual center.
    // Their origin is bottom-center, so each point below is the spot where the building's front path touches the island path.
    const animalGarden = at(0.285, 0.415); // entrance stones meet the upper-left ring road
    const task = at(0.815, 0.535); // moved to the right-side path clearing near the farm
    const message = at(0.19, 0.57); // restored to cover the irregular left path patch
    const farmPlot = at(0.725, 0.43); // farm keeps the upper-right garden pad and leaves room for the cottage on its right/lower side
    const shop = at(0.625, 0.685); // shop door faces the lower-right path plaza

    return {
      centerX: w / 2,
      mapTop,
      mapBottom,
      baseX: bgX,
      baseY: bgTop + bgH * 0.57,
      baseSize: bgW,
      bgX,
      bgY,
      bgW,
      bgH,
      forestX: forest.x,
      forestY: forest.y,
      lakeX: lake.x,
      lakeY: lake.y,
      taskX: task.x,
      taskY: task.y,
      messageX: message.x,
      messageY: message.y,
      farmPlotX: farmPlot.x,
      farmPlotY: farmPlot.y,
      shopX: shop.x,
      shopY: shop.y,
      animalGardenX: animalGarden.x,
      animalGardenY: animalGarden.y,
    };
  }

  private getResidentOutdoorSpots(layout: IslandLayout) {
    const bgTop = layout.bgY - layout.bgH / 2;
    const at = (u: number, v: number) => ({
      x: layout.bgX - layout.bgW / 2 + u * layout.bgW,
      y: bgTop + v * layout.bgH,
    });

    // Curated island-only spots: path edges, grass pockets, and door-front clearings.
    // Avoid the lake, cliff water, crop rows, house roofs, and large building footprints.
    return [
      at(0.58, 0.385), // upper middle path between forest and farm
      at(0.70, 0.515), // farm-to-cottage path corner
      at(0.32, 0.545), // Animal Garden entrance stones
      at(0.27, 0.645), // message-board side path
      at(0.50, 0.685), // central lower crossroads
      at(0.66, 0.675), // lantern-shop / task-cottage lower bend
      at(0.35, 0.745), // lower-left meadow edge, safely on island
    ];
  }

  private getDailyOutdoorResidentIds() {
    const ids = (window as any).__MOXI_OUTSIDE_RESIDENT_IDS__;
    if (!Array.isArray(ids)) return undefined;

    const validIds = ids.filter((id): id is string => typeof id === 'string' && residents.some((resident) => resident.id === id));
    return validIds.slice(0, Math.max(1, Math.min(MAX_OUTDOOR_RESIDENTS, residents.length - 1)));
  }

  private getOutdoorResidents() {
    const dailyOutdoorIds = this.getDailyOutdoorResidentIds();
    if (dailyOutdoorIds?.length) {
      return dailyOutdoorIds
        .map((id) => residents.find((resident) => resident.id === id))
        .filter((resident): resident is Resident => Boolean(resident));
    }

    return residents.filter((resident) => resident.isOutsideToday).slice(0, MAX_OUTDOOR_RESIDENTS);
  }

  private getRandomResidentPositions(layout: IslandLayout, outdoorResidents: Resident[]) {
    const todayKey = new Date().toISOString().slice(0, 10);
    const seed = todayKey.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const spots = [...this.getResidentOutdoorSpots(layout)];

    // Deterministic daily shuffle: changes day by day but stays stable during one preview session.
    spots.sort((a, b) => Math.sin(a.x * 0.13 + a.y * 0.07 + seed) - Math.sin(b.x * 0.13 + b.y * 0.07 + seed));

    const result: Record<string, { x: number; y: number }> = {};
    outdoorResidents.forEach((resident, index) => {
      result[resident.id] = spots[index % spots.length];
    });

    return result;
  }

  private createWeatherEffects(w: number, h: number) {
    const config = weatherConfigs[this.currentWeather];
    if (!config) return;

    switch (this.currentWeather) {
      case '晴天':
        this.createSunnyWeather(w, h, config);
        break;
      case '微风':
        this.createWindyWeather(w, h, config);
        break;
      case '雨天':
        this.createRainyWeather(w, h, config);
        break;
      case '林间薄雾':
        this.createMistyWeather(w, h, config);
        break;
      case '星光夜':
        this.createStarryNightWeather(w, h, config);
        break;
    }
  }

  preload() {
    // Only assets explicitly marked usable are loaded. The generated manifest keeps risky assets blocked.
    assetList.filter((a) => a.status === 'usable').forEach((asset) => {
      if (!this.textures.exists(asset.key)) {
        this.load.image(asset.key, asset.path);
      }
    });
  }

  private createOceanSkyBackdrop(w: number, h: number) {
    // Simple fallback behind the portrait art only. Desktop side space is handled by the page shell.
    this.add.rectangle(w / 2, h / 2, w, h, 0xfff8eb).setDepth(-26);
  }

  private createSunnyWeather(w: number, h: number, config: any) {
    // The portrait baseland already contains the main sky; keep weather behind it only as a faint fallback.
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setAlpha(0.06).setDepth(-23);
  }

  private createWindyWeather(w: number, h: number, config: any) {
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setAlpha(0.06).setDepth(-23);
  }

  private createRainyWeather(w: number, h: number, config: any) {
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setAlpha(0.1).setDepth(-23);
  }

  private createMistyWeather(w: number, h: number, config: any) {
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setAlpha(0.06).setDepth(-23);
  }

  private createStarryNightWeather(w: number, h: number, config: any) {
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setAlpha(0.1).setDepth(-23);
  }

  private createFallbackBase(layout: IslandLayout) {
    const g = this.add.graphics();
    g.fillStyle(0xfff4dc, 1);
    g.fillEllipse(layout.baseX, layout.baseY + layout.baseSize * 0.02, layout.baseSize * 0.86, layout.baseSize * 0.68);
    g.fillStyle(0xdff2d7, 0.92);
    g.fillEllipse(layout.baseX, layout.baseY, layout.baseSize * 0.68, layout.baseSize * 0.52);
    g.fillStyle(0x8bd9f3, 0.78);
    g.fillEllipse(layout.lakeX, layout.lakeY, layout.baseSize * 0.26, layout.baseSize * 0.13);
    g.lineStyle(4, 0xf2ffff, 0.78);
    g.strokeEllipse(layout.lakeX, layout.lakeY, layout.baseSize * 0.26, layout.baseSize * 0.13);
    g.setDepth(-12);
  }

  private addLakeHotspot(layout: IslandLayout) {
    const lakeHotspot = this.add.ellipse(layout.lakeX, layout.lakeY, layout.baseSize * 0.22, layout.baseSize * 0.13, 0xffffff, 0.001);
    lakeHotspot
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'lake'))
      .setDepth(70);

    const lakeLabel = this.add
      .text(layout.lakeX, layout.lakeY + layout.baseSize * 0.03, '星光湖 ✨', {
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#2f6b6f',
        backgroundColor: 'rgba(255,255,255,0.28)',
        padding: { x: 7, y: 2 },
      })
      .setOrigin(0.5)
      .setDepth(78);

    lakeLabel.setInteractive({ useHandCursor: true }).on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'lake'));
  }

  private addForestHotspot(layout: IslandLayout) {
    const gatePlate = this.add.ellipse(0, 0, 150, 40, 0xffffff, 0.16).setStrokeStyle(2, 0xffffff, 0.24);
    const gateText = this.add.text(0, 0, '森林探险区', { fontSize: '15px', color: '#315342' }).setOrigin(0.5);
    const gateContainer = this.add.container(layout.forestX, layout.forestY, [gatePlate, gateText]);
    gateContainer.setSize(170, 58).setInteractive({ useHandCursor: true }).on('pointerdown', () => emitIslandEvent('moxi-open-panel', 'forest'));
    gateContainer.setDepth(90);
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    const layout = this.getLayout(w, h);

    // Initialize weather
    this.initWeather();

    this.createOceanSkyBackdrop(w, h);

    // Apply weather effects behind the portrait art as a subtle fallback tint.
    this.createWeatherEffects(w, h);

    // The painted portrait baseland owns the full mobile scene.
    if (this.textures.exists(BASELAND_TEXTURE_KEY)) {
      this.add.image(layout.bgX, layout.bgY, BASELAND_TEXTURE_KEY).setOrigin(0.5).setDisplaySize(layout.bgW, layout.bgH).setDepth(-12);
    } else {
      this.createFallbackBase(layout);
    }

    this.addForestHotspot(layout);
    this.addLakeHotspot(layout);

    // Cleaned PNGs now replace the rough vector building placeholders.
    new BuildingSprite(this, layout.animalGardenX, layout.animalGardenY, 'Animal Garden', 0xcfe7a0, () => emitIslandEvent('moxi-open-panel', 'animalGarden'), 'animal-garden');
    new BuildingSprite(this, layout.taskX, layout.taskY, '任务小屋', 0xf7d794, () => emitIslandEvent('moxi-open-panel', 'tasks'), 'task-cottage');
    new BuildingSprite(this, layout.messageX, layout.messageY, '留言板', 0xc9a06a, () => emitIslandEvent('moxi-open-panel', 'messages'), 'message-board');
    new FarmPlotSprite(this, layout.farmPlotX, layout.farmPlotY, 'farm-plot', () => emitIslandEvent('moxi-open-panel', 'farm'));
    new BuildingSprite(this, layout.shopX, layout.shopY, '千灯铺', 0xffc9de, () => emitIslandEvent('moxi-open-panel', 'shop'), 'lantern-shop');

    const outdoorResidents = this.getOutdoorResidents();
    const residentPositions = this.getRandomResidentPositions(layout, outdoorResidents);

    outdoorResidents.forEach((resident) => {
      const positionedResident: Resident = {
        ...resident,
        position: residentPositions[resident.id] ?? resident.position,
      };
      new ResidentSprite(this, positionedResident, () => emitIslandEvent('moxi-open-resident', resident.id));
    });
  }
}
