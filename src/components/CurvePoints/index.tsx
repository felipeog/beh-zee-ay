import type { TCoord } from "../../types/TCoord";

export function CurvePoints({ coords }: { coords: TCoord[] }) {
  return coords.map((c, i) => (
    <circle
      key={i}
      cx={c.x}
      cy={c.y}
      r="2"
      fill="none"
      stroke="var(--curve-point-stroke)"
      strokeWidth="1"
    ></circle>
  ));
}
