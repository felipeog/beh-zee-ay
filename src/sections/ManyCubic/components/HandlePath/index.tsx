import { useMemo } from "react";

import type { TPoint } from "../../types/TPoint";

export function HandlePath({ points }: { points: TPoint[] }) {
  const d = useMemo(() => {
    return points.reduce((a, c) => {
      return `${a}M ${c.left.x} ${c.left.y} L ${c.middle.x} ${c.middle.y} L ${c.right.x} ${c.right.y} `;
    }, "");
  }, [points]);

  return (
    <path
      fill="none"
      stroke="var(--handle-path-stroke)"
      strokeWidth="1"
      d={d}
    ></path>
  );
}
