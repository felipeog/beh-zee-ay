import { useRef, useState } from "react";

import type { TPoint } from "../../types/TPoint";

export function Handle({
  point,
  setPosition,
  remove,
}: {
  point: TPoint;
  setPosition: ({
    x,
    y,
    pointKey,
  }: {
    x: number;
    y: number;
    pointKey: keyof Omit<TPoint, "id" | "order">;
  }) => void;
  remove: (id: TPoint["id"]) => void;
}) {
  const leftRef = useRef<SVGRectElement>(null);
  const middleRef = useRef<SVGCircleElement>(null);
  const rightRef = useRef<SVGRectElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const refsMap = {
    middle: middleRef,
    left: leftRef,
    right: rightRef,
  };

  function getHandlePointerDown(pointKey: keyof Omit<TPoint, "id" | "order">) {
    return (event: React.PointerEvent<SVGElement>) => {
      event.preventDefault();
      refsMap[pointKey].current!.setPointerCapture(event.pointerId);
    };
  }

  function getHandlePointerUp(pointKey: keyof Omit<TPoint, "id" | "order">) {
    return (event: React.PointerEvent<SVGElement>) => {
      event.preventDefault();
      refsMap[pointKey].current!.releasePointerCapture(event.pointerId);
    };
  }

  function getHandlePointerMove(pointKey: keyof Omit<TPoint, "id" | "order">) {
    return (event: React.PointerEvent<SVGElement>) => {
      event.preventDefault();

      if (!isDragging) return;

      setPosition({
        x: event.clientX,
        y: event.clientY,
        pointKey,
      });
    };
  }

  function handleGotPointerCapture(event: React.PointerEvent<SVGElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleLostPointerCapture(event: React.PointerEvent<SVGElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleMiddleDoubleClick(event: React.MouseEvent<SVGCircleElement>) {
    event.preventDefault();
    remove(point.id);
  }

  return (
    <g>
      <text
        x={point.middle.x + 8}
        y={point.middle.y}
        dominantBaseline="central"
        fill="var(--text-fill)"
      >
        {point.order}
      </text>

      <circle
        className="svg-draggable"
        ref={middleRef}
        cx={point.middle.x}
        cy={point.middle.y}
        r="5"
        fill="var(--handle-fill)"
        stroke="var(--handle-stroke)"
        strokeWidth="1"
        onPointerDown={getHandlePointerDown("middle")}
        onPointerMove={getHandlePointerMove("middle")}
        onPointerUp={getHandlePointerUp("middle")}
        onGotPointerCapture={handleGotPointerCapture}
        onLostPointerCapture={handleLostPointerCapture}
        onDoubleClick={handleMiddleDoubleClick}
      ></circle>

      <rect
        className="svg-draggable"
        ref={rightRef}
        x={point.right.x - 7 / 2}
        y={point.right.y - 7 / 2}
        width="7"
        height="7"
        fill="var(--handle-fill)"
        stroke="var(--handle-stroke)"
        strokeWidth="1"
        onPointerDown={getHandlePointerDown("right")}
        onPointerMove={getHandlePointerMove("right")}
        onPointerUp={getHandlePointerUp("right")}
        onGotPointerCapture={handleGotPointerCapture}
        onLostPointerCapture={handleLostPointerCapture}
      ></rect>
      <rect
        className="svg-draggable"
        ref={leftRef}
        x={point.left.x - 7 / 2}
        y={point.left.y - 7 / 2}
        width="7"
        height="7"
        fill="var(--handle-fill)"
        stroke="var(--handle-stroke)"
        strokeWidth="1"
        onPointerDown={getHandlePointerDown("left")}
        onPointerMove={getHandlePointerMove("left")}
        onPointerUp={getHandlePointerUp("left")}
        onGotPointerCapture={handleGotPointerCapture}
        onLostPointerCapture={handleLostPointerCapture}
      ></rect>
    </g>
  );
}
