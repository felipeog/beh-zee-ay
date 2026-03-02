import { useMemo } from "react";

import type { TCoord } from "../../types/TCoord";

export function CurvePath({ coords }: { coords: TCoord[] }) {
  const d = useMemo(() => {
    return coords.reduce((a, c, i) => {
      const command = i > 0 ? "L" : "M";

      return `${a} ${command} ${c.x} ${c.y}`;
    }, "");
  }, [coords]);

  return (
    <path
      fill="none"
      stroke="var(--curve-path-stroke)"
      strokeWidth="2"
      d={d}
    ></path>
  );
}
