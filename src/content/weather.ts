export interface WeatherConfig {
  id: string;
  label: string;
  description: string;
  skyColor: number;
  islandTint: number;
  particleEmoji: string;
}

export const weatherConfigs: Record<string, WeatherConfig> = {
  '晴天': {
    id: '晴天',
    label: '晴天',
    description: '阳光灿烂，是外出的好天气',
    skyColor: 0xffd89b,
    islandTint: 0xffffff,
    particleEmoji: '☀️',
  },
  '微风': {
    id: '微风',
    label: '微风',
    description: '微风拂过，云朵悠闲漂浮',
    skyColor: 0xe8f4f8,
    islandTint: 0xfbfbfb,
    particleEmoji: '☁️',
  },
  '雨天': {
    id: '雨天',
    label: '雨天',
    description: '雨水滋润大地，静享室内时光',
    skyColor: 0x7a9db5,
    islandTint: 0xd8dfe8,
    particleEmoji: '💧',
  },
  '林间薄雾': {
    id: '林间薄雾',
    label: '林间薄雾',
    description: '白雾笼罩，透出神秘意境',
    skyColor: 0xc5d9e6,
    islandTint: 0xf0f5f9,
    particleEmoji: '🌫️',
  },
  '星光夜': {
    id: '星光夜',
    label: '星光夜',
    description: '繁星闪烁，入眠前的冥想时刻',
    skyColor: 0x1a2a3f,
    islandTint: 0x3a4a5a,
    particleEmoji: '⭐',
  },
};

export const weatherOptions = Object.keys(weatherConfigs);
