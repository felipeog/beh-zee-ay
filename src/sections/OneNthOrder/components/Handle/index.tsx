import { useRef, useState } from "react";

import type { TPoint } from "../../types/TPoint";

export function Handle({
  point,
  setPosition,
  remove,
}: {
  point: TPoint;
  setPosition: (event: React.PointerEvent<SVGCircleElement>) => void;
  remove: (id: TPoint["id"]) => void;
}) {
  const circleRef = useRef<SVGCircleElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handlePointerDown(event: React.PointerEvent<SVGCircleElement>) {
    event.preventDefault();
    circleRef.current!.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<SVGCircleElement>) {
    event.preventDefault();

    if (!isDragging) return;

    setPosition(event);
  }

  function handlePointerUp(event: React.PointerEvent<SVGCircleElement>) {
    event.preventDefault();
    circleRef.current!.releasePointerCapture(event.pointerId);
  }

  function handleGotPointerCapture(
    event: React.PointerEvent<SVGCircleElement>,
  ) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleLostPointerCapture(
    event: React.PointerEvent<SVGCircleElement>,
  ) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDoubleClick(event: React.MouseEvent<SVGCircleElement>) {
    event.preventDefault();
    remove(point.id);
  }

  return (
    <g>
      <circle
        className="svg-draggable"
        ref={circleRef}
        cx={point.x}
        cy={point.y}
        r="5"
        fill="var(--handle-fill)"
        stroke="var(--handle-stroke)"
        strokeWidth="1"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onGotPointerCapture={handleGotPointerCapture}
        onLostPointerCapture={handleLostPointerCapture}
        onDoubleClick={handleDoubleClick}
      ></circle>

      <text
        x={point.x + 8}
        y={point.y}
        dominantBaseline="central"
        fill="var(--text-fill)"
      >
        {point.order}
      </text>
    </g>
  );
}
