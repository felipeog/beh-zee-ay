import { SIZE } from "../../../constants/size";

import type { TPreset } from "../types/TPreset";

import { generateId } from "../../../utils/generateId";

const EMPTY: TPreset = [];
const LINEAR: TPreset = [
  { id: generateId(), order: 0, x: 0.25 * SIZE.WIDTH, y: 0.25 * SIZE.HEIGHT },
  { id: generateId(), order: 1, x: 0.75 * SIZE.WIDTH, y: 0.75 * SIZE.HEIGHT },
];
const QUADRATIC: TPreset = [
  { id: generateId(), order: 0, x: 0.25 * SIZE.WIDTH, y: 0.75 * SIZE.HEIGHT },
  { id: generateId(), order: 1, x: 0.5 * SIZE.WIDTH, y: 0.25 * SIZE.HEIGHT },
  { id: generateId(), order: 2, x: 0.75 * SIZE.WIDTH, y: 0.75 * SIZE.HEIGHT },
];
const CUBIC: TPreset = [
  { id: generateId(), order: 0, x: 0.25 * SIZE.WIDTH, y: 0.75 * SIZE.HEIGHT },
  { id: generateId(), order: 1, x: 0.25 * SIZE.WIDTH, y: 0.25 * SIZE.HEIGHT },
  { id: generateId(), order: 2, x: 0.75 * SIZE.WIDTH, y: 0.25 * SIZE.HEIGHT },
  { id: generateId(), order: 3, x: 0.75 * SIZE.WIDTH, y: 0.75 * SIZE.HEIGHT },
];
const HEART: TPreset = [
  { id: generateId(), order: 0, x: 0.5 * SIZE.WIDTH, y: 0.75 * SIZE.HEIGHT },
  { id: generateId(), order: 1, x: 0 * SIZE.WIDTH, y: 0.25 * SIZE.HEIGHT },
  { id: generateId(), order: 2, x: 0.9 * SIZE.WIDTH, y: 0.2 * SIZE.HEIGHT },
  { id: generateId(), order: 3, x: 0.5 * SIZE.WIDTH, y: 1 * SIZE.HEIGHT },
  { id: generateId(), order: 4, x: 0.1 * SIZE.WIDTH, y: 0.2 * SIZE.HEIGHT },
  { id: generateId(), order: 5, x: 1 * SIZE.WIDTH, y: 0.25 * SIZE.HEIGHT },
  { id: generateId(), order: 6, x: 0.5 * SIZE.WIDTH, y: 0.725 * SIZE.HEIGHT },
];

export const PRESET_MAP = {
  empty: EMPTY,
  linear: LINEAR,
  quadratic: QUADRATIC,
  cubic: CUBIC,
  heart: HEART,
  get random() {
    const count = Math.floor(Math.random() * 8 + 2);
    const preset: TPreset = [];

    for (let i = 0; i < count; i++) {
      preset.push({
        id: generateId(),
        order: i,
        x: Math.random() * SIZE.WIDTH,
        y: Math.random() * SIZE.HEIGHT,
      });
    }

    return preset;
  },
};
