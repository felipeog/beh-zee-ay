import { SIZE } from "../../../constants/size";

import type { TPreset } from "../types/TPreset";

import { generateId } from "../../../utils/generateId";

const EMPTY: TPreset = [];
const LINE: TPreset = [
  {
    id: generateId(),
    order: 0,
    left: { x: 0.25 * SIZE.WIDTH, y: 0.25 * SIZE.HEIGHT },
    middle: { x: 0.25 * SIZE.WIDTH, y: 0.25 * SIZE.HEIGHT },
    right: { x: 0.25 * SIZE.WIDTH, y: 0.25 * SIZE.HEIGHT },
  },
  {
    id: generateId(),
    order: 1,
    left: { x: 0.75 * SIZE.WIDTH, y: 0.75 * SIZE.HEIGHT },
    middle: { x: 0.75 * SIZE.WIDTH, y: 0.75 * SIZE.HEIGHT },
    right: { x: 0.75 * SIZE.WIDTH, y: 0.75 * SIZE.HEIGHT },
  },
];
const CURVE: TPreset = [
  {
    id: generateId(),
    order: 0,
    left: { x: 0.25 * SIZE.WIDTH, y: 0.75 * SIZE.HEIGHT },
    middle: { x: 0.25 * SIZE.WIDTH, y: 0.75 * SIZE.HEIGHT },
    right: { x: 0.25 * SIZE.WIDTH, y: 0.25 * SIZE.HEIGHT },
  },
  {
    id: generateId(),
    order: 1,
    left: { x: 0.75 * SIZE.WIDTH, y: 0.25 * SIZE.HEIGHT },
    middle: { x: 0.75 * SIZE.WIDTH, y: 0.75 * SIZE.HEIGHT },
    right: { x: 0.75 * SIZE.WIDTH, y: 0.75 * SIZE.HEIGHT },
  },
];
const HEART: TPreset = [
  {
    id: generateId(),
    order: 0,
    left: { x: 0.5 * SIZE.WIDTH, y: 0.9 * SIZE.HEIGHT },
    middle: { x: 0.5 * SIZE.WIDTH, y: 0.9 * SIZE.HEIGHT },
    right: { x: 0.2 * SIZE.WIDTH, y: 0.6 * SIZE.HEIGHT },
  },
  {
    id: generateId(),
    order: 1,
    left: { x: 0.1 * SIZE.WIDTH, y: 0.5 * SIZE.HEIGHT },
    middle: { x: 0.1 * SIZE.WIDTH, y: 0.3 * SIZE.HEIGHT },
    right: { x: 0.1 * SIZE.WIDTH, y: 0.2 * SIZE.HEIGHT },
  },
  {
    id: generateId(),
    order: 2,
    left: { x: 0.2 * SIZE.WIDTH, y: 0.1 * SIZE.HEIGHT },
    middle: { x: 0.3 * SIZE.WIDTH, y: 0.1 * SIZE.HEIGHT },
    right: { x: 0.4 * SIZE.WIDTH, y: 0.1 * SIZE.HEIGHT },
  },
  {
    id: generateId(),
    order: 3,
    left: { x: 0.45 * SIZE.WIDTH, y: 0.15 * SIZE.HEIGHT },
    middle: { x: 0.5 * SIZE.WIDTH, y: 0.25 * SIZE.HEIGHT },
    right: { x: 0.55 * SIZE.WIDTH, y: 0.15 * SIZE.HEIGHT },
  },
  {
    id: generateId(),
    order: 4,
    left: { x: 0.6 * SIZE.WIDTH, y: 0.1 * SIZE.HEIGHT },
    middle: { x: 0.7 * SIZE.WIDTH, y: 0.1 * SIZE.HEIGHT },
    right: { x: 0.8 * SIZE.WIDTH, y: 0.1 * SIZE.HEIGHT },
  },
  {
    id: generateId(),
    order: 5,
    left: { x: 0.9 * SIZE.WIDTH, y: 0.2 * SIZE.HEIGHT },
    middle: { x: 0.9 * SIZE.WIDTH, y: 0.3 * SIZE.HEIGHT },
    right: { x: 0.9 * SIZE.WIDTH, y: 0.5 * SIZE.HEIGHT },
  },
  {
    id: generateId(),
    order: 6,
    left: { x: 0.8 * SIZE.WIDTH, y: 0.575 * SIZE.HEIGHT },
    middle: { x: 0.5 * SIZE.WIDTH, y: 0.875 * SIZE.HEIGHT },
    right: { x: 0.5 * SIZE.WIDTH, y: 0.875 * SIZE.HEIGHT },
  },
];

export const PRESET_MAP = {
  empty: EMPTY,
  line: LINE,
  curve: CURVE,
  heart: HEART,
  get random() {
    const count = Math.floor(Math.random() * 8 + 2);
    const preset: TPreset = [];

    for (let i = 0; i < count; i++) {
      preset.push({
        id: generateId(),
        order: i,
        left: {
          x: Math.random() * SIZE.WIDTH,
          y: Math.random() * SIZE.HEIGHT,
        },
        middle: {
          x: Math.random() * SIZE.WIDTH,
          y: Math.random() * SIZE.HEIGHT,
        },
        right: {
          x: Math.random() * SIZE.WIDTH,
          y: Math.random() * SIZE.HEIGHT,
        },
      });
    }

    return preset;
  },
};
