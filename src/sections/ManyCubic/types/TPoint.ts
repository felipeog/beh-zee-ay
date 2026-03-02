import type { TCoord } from "../../../types/TCoord";

export type TPoint = {
  id: string;
  order: number;
  left: TCoord;
  middle: TCoord;
  right: TCoord;
};
