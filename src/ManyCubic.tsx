import { useMemo, useRef, useState } from "react";

// TODO: move to separate files

// =============================================================================
// types
// =============================================================================

type TCoord = {
  x: number;
  y: number;
};
type TPoint = {
  id: string;
  order: number;
  left: TCoord;
  middle: TCoord;
  right: TCoord;
};
type TPreset = TPoint[];

// =============================================================================
// constants
// =============================================================================

const WIDTH = 500;
const HEIGHT = 500;

const EMPTY: TPreset = [];
const LINE: TPreset = [
  {
    id: generateId(),
    order: 0,
    left: { x: 0.25 * WIDTH, y: 0.25 * HEIGHT },
    middle: { x: 0.25 * WIDTH, y: 0.25 * HEIGHT },
    right: { x: 0.25 * WIDTH, y: 0.25 * HEIGHT },
  },
  {
    id: generateId(),
    order: 1,
    left: { x: 0.75 * WIDTH, y: 0.75 * HEIGHT },
    middle: { x: 0.75 * WIDTH, y: 0.75 * HEIGHT },
    right: { x: 0.75 * WIDTH, y: 0.75 * HEIGHT },
  },
];
const CURVE: TPreset = [
  {
    id: generateId(),
    order: 0,
    left: { x: 0.25 * WIDTH, y: 0.75 * HEIGHT },
    middle: { x: 0.25 * WIDTH, y: 0.75 * HEIGHT },
    right: { x: 0.25 * WIDTH, y: 0.25 * HEIGHT },
  },
  {
    id: generateId(),
    order: 1,
    left: { x: 0.75 * WIDTH, y: 0.25 * HEIGHT },
    middle: { x: 0.75 * WIDTH, y: 0.75 * HEIGHT },
    right: { x: 0.75 * WIDTH, y: 0.75 * HEIGHT },
  },
];
const HEART: TPreset = [
  {
    id: generateId(),
    order: 0,
    left: { x: 0.5 * WIDTH, y: 0.9 * HEIGHT },
    middle: { x: 0.5 * WIDTH, y: 0.9 * HEIGHT },
    right: { x: 0.2 * WIDTH, y: 0.6 * HEIGHT },
  },
  {
    id: generateId(),
    order: 1,
    left: { x: 0.1 * WIDTH, y: 0.5 * HEIGHT },
    middle: { x: 0.1 * WIDTH, y: 0.3 * HEIGHT },
    right: { x: 0.1 * WIDTH, y: 0.2 * HEIGHT },
  },
  {
    id: generateId(),
    order: 2,
    left: { x: 0.2 * WIDTH, y: 0.1 * HEIGHT },
    middle: { x: 0.3 * WIDTH, y: 0.1 * HEIGHT },
    right: { x: 0.4 * WIDTH, y: 0.1 * HEIGHT },
  },
  {
    id: generateId(),
    order: 3,
    left: { x: 0.45 * WIDTH, y: 0.15 * HEIGHT },
    middle: { x: 0.5 * WIDTH, y: 0.25 * HEIGHT },
    right: { x: 0.55 * WIDTH, y: 0.15 * HEIGHT },
  },
  {
    id: generateId(),
    order: 4,
    left: { x: 0.6 * WIDTH, y: 0.1 * HEIGHT },
    middle: { x: 0.7 * WIDTH, y: 0.1 * HEIGHT },
    right: { x: 0.8 * WIDTH, y: 0.1 * HEIGHT },
  },
  {
    id: generateId(),
    order: 5,
    left: { x: 0.9 * WIDTH, y: 0.2 * HEIGHT },
    middle: { x: 0.9 * WIDTH, y: 0.3 * HEIGHT },
    right: { x: 0.9 * WIDTH, y: 0.5 * HEIGHT },
  },
  {
    id: generateId(),
    order: 6,
    left: { x: 0.8 * WIDTH, y: 0.575 * HEIGHT },
    middle: { x: 0.5 * WIDTH, y: 0.875 * HEIGHT },
    right: { x: 0.5 * WIDTH, y: 0.875 * HEIGHT },
  },
];

const PRESET_MAP = {
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
          x: Math.random() * WIDTH,
          y: Math.random() * HEIGHT,
        },
        middle: {
          x: Math.random() * WIDTH,
          y: Math.random() * HEIGHT,
        },
        right: {
          x: Math.random() * WIDTH,
          y: Math.random() * HEIGHT,
        },
      });
    }

    return preset;
  },
};

const DEFAULT_SEGMENTS = 8;

// =============================================================================
// helpers
// =============================================================================

// function logger(...args: any[]) {
//   if (import.meta.env.PROD) return;

//   console.log(...args);
// }

function generateId() {
  return crypto.randomUUID();
}

// =============================================================================
// components
// =============================================================================

export function ManyCubic() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [segments, setSegments] = useState(DEFAULT_SEGMENTS);
  const [points, setPoints] = useState(HEART);

  function handleRectClick(event: React.MouseEvent<SVGRectElement>) {
    const svgCoord = getSvgCoordFromScreenCoord({
      x: event.clientX,
      y: event.clientY,
    });
    const point: TPoint = {
      id: generateId(),
      order: points.length,
      left: { x: svgCoord.x, y: svgCoord.y },
      middle: { x: svgCoord.x, y: svgCoord.y },
      right: { x: svgCoord.x, y: svgCoord.y },
    };

    setPoints((prevPoints) => {
      const points = structuredClone(prevPoints);

      points.push(point);

      return points;
    });
  }

  const curveCoords = useMemo(() => {
    if (points.length < 2) return [];

    const curveCoords: TCoord[] = [];

    for (let i = 0; i < points.length - 1; ++i) {
      const a = points[i];
      const b = points[i + 1];
      const p0 = { ...a.middle };
      const p1 = { ...a.right };
      const p2 = { ...b.left };
      const p3 = { ...b.middle };

      for (let segment = 0; segment <= segments; segment++) {
        const t = segment / segments;
        const u = 1 - t;

        curveCoords.push({
          x:
            u * u * u * p0.x +
            3 * u * u * t * p1.x +
            3 * u * t * t * p2.x +
            t * t * t * p3.x,
          y:
            u * u * u * p0.y +
            3 * u * u * t * p1.y +
            3 * u * t * t * p2.y +
            t * t * t * p3.y,
        });
      }
    }

    return curveCoords;
  }, [points, segments]);

  function getSvgCoordFromScreenCoord(screenCoord: TCoord): TCoord {
    const screenMatrix = svgRef.current!.getScreenCTM();
    const svgMatrix = screenMatrix!.inverse();
    const svgPoint = svgRef.current!.createSVGPoint();

    svgPoint.x = screenCoord.x;
    svgPoint.y = screenCoord.y;

    const svgCoord = svgPoint.matrixTransform(svgMatrix);

    return {
      x: svgCoord.x,
      y: svgCoord.y,
    };
  }

  function handleSegmentsInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const value = parseInt(event.target.value, 10) || 1;

    setSegments(value);
  }

  function getHandleSetPosition(id: TPoint["id"]) {
    const index = points.findIndex((p) => p.id === id);

    return ({
      x,
      y,
      pointKey,
    }: {
      x: number;
      y: number;
      pointKey: keyof Omit<TPoint, "id" | "order">;
    }) => {
      setPoints((prevPoints) => {
        const rect = svgRef.current!.getBoundingClientRect();
        const topLeftCoord = getSvgCoordFromScreenCoord({
          x: rect.left,
          y: rect.top,
        });
        const bottomRightCoord = getSvgCoordFromScreenCoord({
          x: rect.right,
          y: rect.bottom,
        });
        const cursorCoord = getSvgCoordFromScreenCoord({
          x,
          y,
        });
        const clampedCoord = {
          x: Math.min(
            Math.max(cursorCoord.x, topLeftCoord.x),
            bottomRightCoord.x,
          ),
          y: Math.min(
            Math.max(cursorCoord.y, topLeftCoord.y),
            bottomRightCoord.y,
          ),
        };
        const points = structuredClone(prevPoints);

        points[index][pointKey].x = clampedCoord.x;
        points[index][pointKey].y = clampedCoord.y;

        return points;
      });
    };
  }

  function removeHandle(id: TPoint["id"]) {
    setPoints((prevPoints) => {
      const points = structuredClone(prevPoints);

      return points
        .filter((p) => p.id !== id)
        .map((p, i) => ({ ...p, order: i }));
    });
  }

  return (
    <section>
      <h2>Many cubic curves</h2>

      <p>
        <a href="https://en.wikipedia.org/wiki/Bernstein_polynomial">
          Bernstein polynomial
        </a>
      </p>

      <p>
        add a handle (circle) with its control points (squares) by clicking
        inside the square
      </p>
      <p>change the curve by dragging the control points</p>
      <p>remove a handle by double clicking it</p>
      <p>move a handle by dragging it</p>

      <svg
        className="svg-container"
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      >
        <rect
          onClick={handleRectClick}
          width="100%"
          height="100%"
          fill="var(--rect-fill)"
          stroke="var(--rect-stroke)"
          strokeWidth="1"
        />

        <g>
          <HandlePath points={points} />
        </g>

        <g>
          <CurvePoints coords={curveCoords} />
        </g>

        <g>
          <CurvePath coords={curveCoords} />
        </g>

        <g>
          {points.map((p) => (
            <Handle
              key={p.id}
              point={p}
              setPosition={getHandleSetPosition(p.id)}
              remove={removeHandle}
            />
          ))}
        </g>
      </svg>

      <label htmlFor="segments">segments per curve</label>
      <input
        id="segments"
        value={segments}
        onChange={handleSegmentsInputChange}
        type="number"
        min="1"
      />

      <p>presets</p>
      <div className="grid">
        {Object.entries(PRESET_MAP).map(([k, v]) => (
          <button key={k} onClick={() => setPoints(v)}>
            {k}
          </button>
        ))}
      </div>
    </section>
  );
}

function Handle({
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

function HandlePath({ points }: { points: TPoint[] }) {
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

function CurvePoints({ coords }: { coords: TCoord[] }) {
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

function CurvePath({ coords }: { coords: TCoord[] }) {
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
