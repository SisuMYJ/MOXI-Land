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
    // The portrait baseland is treated as the original mobile screen.
    // Desktop only gains extra side space; the portrait stage itself remains centered and stable.
    const isCompact = w < 700;
    const mapTop = 0;
    const mapBottom = h;
    const bgTop = isCompact ? -22 : 0;
    // Always let the portrait art cover the full visible height. Previously the height cap could leave
    // a blank strip at the bottom on phone-like screens or tall desktop windows.
    const bgH = Math.max(h - bgTop, isCompact ? 760 : 780);
    const bgW = bgH * BASELAND_ASPECT;
    const bgX = w / 2;
    const bgY = bgTop + bgH / 2;

    const at = (u: number, v: number) => ({
      x: bgX - bgW / 2 + u * bgW,
      y: bgTop + v * bgH,
    });

    const forest = at(0.52, 0.34);
    const lake = at(0.5, 0.52);
    const task = at(0.45, 0.43);
    const message = at(0.24, 0.55);
    const farmPlot = at(0.72, 0.45);
    const shop = at(0.66, 0.66);

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
    };
  }

  private getResidentPosition(residentId: string, layout: IslandLayout): { x: number; y: number } | undefined {
    const bgTop = layout.bgY - layout.bgH / 2;
    const at = (u: number, v: number) => ({
      x: layout.bgX - layout.bgW / 2 + u * layout.bgW,
      y: bgTop + v * layout.bgH,
    });

    const residentPositions: Record<string, { x: number; y: number }> = {
      'foko-fox': at(0.35, 0.32),
      'deer-lamp': at(0.67, 0.36),
      'mist-cat': at(0.2, 0.54),
      'slow-bear': at(0.18, 0.75),
      'dango-rabbit': at(0.56, 0.75),
    };

    return residentPositions[residentId];
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

  private mixColor(from: [number, number, number], to: [number, number, number], t: number) {
    const r = Math.round(from[0] + (to[0] - from[0]) * t);
    const g = Math.round(from[1] + (to[1] - from[1]) * t);
    const b = Math.round(from[2] + (to[2] - from[2]) * t);
    return (r << 16) | (g << 8) | b;
  }

  private getSideEdgeColor(yRatio: number): [number, number, number] {
    // Approximate the portrait art's left/right edge colors: brighter sky at the top,
    // stronger turquoise ocean in the middle/lower area, then soft misty blue near the bottom.
    if (yRatio < 0.22) return [122, 199, 235];
    if (yRatio < 0.42) return [92, 202, 232];
    if (yRatio < 0.72) return [48, 189, 215];
    return [105, 214, 226];
  }

  private createOceanSkyBackdrop(w: number, h: number, layout: IslandLayout) {
    // Desktop side extension only. The centered portrait stage remains untouched.
    const outer: [number, number, number] = [255, 250, 235];
    const leftEdge = layout.bgX - layout.bgW / 2;
    const rightEdge = layout.bgX + layout.bgW / 2;

    this.add.rectangle(w / 2, h / 2, w, h, 0xfffaeb).setDepth(-26);

    const graphics = this.add.graphics().setDepth(-25);
    const stepsX = 64;
    const stepsY = 18;

    const drawSideGradient = (x0: number, sideW: number, reverse: boolean) => {
      if (sideW <= 0) return;
      const stripW = sideW / stepsX;
      const stripH = h / stepsY;
      for (let ix = 0; ix < stepsX; ix++) {
        // At the portrait edge, start from a stronger edge color. Fade outward to the page color.
        const edgeAmount = reverse ? 1 - ix / (stepsX - 1) : (ix + 1) / stepsX;
        const eased = Math.pow(Phaser.Math.Clamp(edgeAmount, 0, 1), 0.72);
        for (let iy = 0; iy < stepsY; iy++) {
          const yRatio = (iy + 0.5) / stepsY;
          const edgeColor = this.getSideEdgeColor(yRatio);
          const color = this.mixColor(outer, edgeColor, eased);
          graphics.fillStyle(color, 1);
          graphics.fillRect(x0 + ix * stripW, iy * stripH, stripW + 1, stripH + 1);
        }
      }
    };

    drawSideGradient(0, leftEdge, false);
    drawSideGradient(rightEdge, w - rightEdge, true);

    // A tiny side haze softens only the seam; keep it subtle so the edge color is not washed out.
    const seam = this.add.graphics().setDepth(-13);
    const seamW = Math.min(34, Math.max(14, layout.bgW * 0.045));
    if (leftEdge > 0) {
      for (let i = 0; i < 8; i++) {
        const alpha = 0.025 * (1 - i / 7);
        seam.fillStyle(0xf7ffff, alpha);
        seam.fillRect(leftEdge - seamW + (i * seamW) / 8, 0, seamW / 8 + 1, h);
      }
    }
    if (rightEdge < w) {
      for (let i = 0; i < 8; i++) {
        const alpha = 0.025 * (1 - i / 7);
        seam.fillStyle(0xf7ffff, alpha);
        seam.fillRect(rightEdge + (i * seamW) / 8, 0, seamW / 8 + 1, h);
      }
    }
  }

  private createSunnyWeather(w: number, h: number, config: any) {
    // The portrait baseland already contains the main sky; keep weather behind it only as side fill.
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setAlpha(0.08).setDepth(-23);
  }

  private createWindyWeather(w: number, h: number, config: any) {
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setAlpha(0.08).setDepth(-23);
  }

  private createRainyWeather(w: number, h: number, config: any) {
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setAlpha(0.12).setDepth(-23);
  }

  private createMistyWeather(w: number, h: number, config: any) {
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setAlpha(0.08).setDepth(-23);
  }

  private createStarryNightWeather(w: number, h: number, config: any) {
    this.add.rectangle(w / 2, 80, w, 180, config.skyColor).setAlpha(0.12).setDepth(-23);
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

    this.createOceanSkyBackdrop(w, h, layout);

    // Apply weather effects behind the portrait art as a subtle side-fill tint.
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
    new BuildingSprite(this, layout.taskX, layout.taskY, '任务小屋', 0xf7d794, () => emitIslandEvent('moxi-open-panel', 'tasks'), 'task-cottage');
    new BuildingSprite(this, layout.messageX, layout.messageY, '留言板', 0xc9a06a, () => emitIslandEvent('moxi-open-panel', 'messages'), 'message-board');
    new FarmPlotSprite(this, layout.farmPlotX, layout.farmPlotY, 'farm-plot', () => emitIslandEvent('moxi-open-panel', 'farm'));
    new BuildingSprite(this, layout.shopX, layout.shopY, '千灯铺', 0xffc9de, () => emitIslandEvent('moxi-open-panel', 'shop'), 'lantern-shop');

    residents
      .filter((resident) => resident.isOutsideToday)
      .forEach((resident) => {
        const positionedResident: Resident = {
          ...resident,
          position: this.getResidentPosition(resident.id, layout) ?? resident.position,
        };
        new ResidentSprite(this, positionedResident, () => emitIslandEvent('moxi-open-resident', resident.id));
      });
  }
}
