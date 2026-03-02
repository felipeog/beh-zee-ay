import { useEffect, useMemo, useRef, useState } from "react";

// TODO: move to separate files

// =============================================================================
// types
// =============================================================================

type TCoord = { x: number; y: number };
type TPoint = TCoord & { id: string; order: number };
type TPreset = TPoint[];

// =============================================================================
// constants
// =============================================================================

const WIDTH = 500;
const HEIGHT = 500;

const EMPTY: TPreset = [];
const LINEAR: TPreset = [
  { id: generateId(), order: 0, x: 0.25 * WIDTH, y: 0.25 * HEIGHT },
  { id: generateId(), order: 1, x: 0.75 * WIDTH, y: 0.75 * HEIGHT },
];
const QUADRATIC: TPreset = [
  { id: generateId(), order: 0, x: 0.25 * WIDTH, y: 0.75 * HEIGHT },
  { id: generateId(), order: 1, x: 0.5 * WIDTH, y: 0.25 * HEIGHT },
  { id: generateId(), order: 2, x: 0.75 * WIDTH, y: 0.75 * HEIGHT },
];
const CUBIC: TPreset = [
  { id: generateId(), order: 0, x: 0.25 * WIDTH, y: 0.75 * HEIGHT },
  { id: generateId(), order: 1, x: 0.25 * WIDTH, y: 0.25 * HEIGHT },
  { id: generateId(), order: 2, x: 0.75 * WIDTH, y: 0.25 * HEIGHT },
  { id: generateId(), order: 3, x: 0.75 * WIDTH, y: 0.75 * HEIGHT },
];
const HEART: TPreset = [
  { id: generateId(), order: 0, x: 0.5 * WIDTH, y: 0.75 * HEIGHT },
  { id: generateId(), order: 1, x: 0 * WIDTH, y: 0.25 * HEIGHT },
  { id: generateId(), order: 2, x: 0.9 * WIDTH, y: 0.2 * HEIGHT },
  { id: generateId(), order: 3, x: 0.5 * WIDTH, y: 1 * HEIGHT },
  { id: generateId(), order: 4, x: 0.1 * WIDTH, y: 0.2 * HEIGHT },
  { id: generateId(), order: 5, x: 1 * WIDTH, y: 0.25 * HEIGHT },
  { id: generateId(), order: 6, x: 0.5 * WIDTH, y: 0.725 * HEIGHT },
];

const PRESET_MAP = {
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
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT,
      });
    }

    return preset;
  },
};

const DEFAULT_SEGMENTS = 64;

// =============================================================================
// helpers
// =============================================================================

function logger(...args: any[]) {
  if (import.meta.env.PROD) return;

  console.log(...args);
}

function generateId() {
  return crypto.randomUUID();
}

// =============================================================================
// components
// =============================================================================

export function OneNthOrder() {
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
      x: svgCoord.x,
      y: svgCoord.y,
    };

    setPoints((prevPoints) => {
      const points = structuredClone(prevPoints);

      points.push(point);

      return points;
    });
  }

  const curveCoords = useMemo(() => {
    if (points.length <= 0) return [];

    const initialCoords: TCoord[] = points.map(({ x, y }) => ({ x, y }));
    const curveCoords = [];

    for (let segment = 0; segment <= segments; segment++) {
      const t = segment / segments;
      let coords = [...initialCoords];

      while (coords.length > 1) {
        const midCoords = [];

        for (let i = 0; i + 1 < coords.length; ++i) {
          const a = coords[i];
          const b = coords[i + 1];

          midCoords.push({
            x: a.x + t * (b.x - a.x),
            y: a.y + t * (b.y - a.y),
          });
        }

        coords = [...midCoords];
      }

      curveCoords.push(coords[0]);
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

    return (event: React.PointerEvent<SVGCircleElement>) => {
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
          x: event.clientX,
          y: event.clientY,
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

        points[index].x = clampedCoord.x;
        points[index].y = clampedCoord.y;

        return points;
      });
    };
  }

  function removeHandle(id: TPoint["id"]) {
    setPoints((prevPoints) => {
      const points = prevPoints
        .filter((p) => p.id !== id)
        .map((p, i) => ({ ...p, order: i }));

      return points;
    });
  }

  return (
    <section>
      <h2>One nth-order curve</h2>

      <p>
        <a
          href="https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm"
          target="_blank"
        >
          De Casteljau's algorithm
        </a>
      </p>

      <p>add a handle by clicking inside the square</p>
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

      <label htmlFor="segments">segments</label>
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
  setPosition: (event: React.PointerEvent<SVGCircleElement>) => void;
  remove: (id: TPoint["id"]) => void;
}) {
  const circleRef = useRef<SVGCircleElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    logger(`[Handle ${point.id}] useEffect mount`);

    return () => {
      logger(`[Handle ${point.id}] useEffect unmount`);
    };
  }, []);

  function handlePointerDown(event: React.PointerEvent<SVGCircleElement>) {
    logger(`[Handle ${point.id}] handlePointerDown`);
    event.preventDefault();

    circleRef.current!.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<SVGCircleElement>) {
    logger(`[Handle ${point.id}] handlePointerMove`);
    event.preventDefault();

    if (!isDragging) return;

    setPosition(event);
  }

  function handlePointerUp(event: React.PointerEvent<SVGCircleElement>) {
    logger(`[Handle ${point.id}] handlePointerUp`);
    event.preventDefault();

    circleRef.current!.releasePointerCapture(event.pointerId);
  }

  function handleGotPointerCapture(
    event: React.PointerEvent<SVGCircleElement>,
  ) {
    logger(`[Handle ${point.id}] handleGotPointerCapture`);
    event.preventDefault();
    setIsDragging(true);
  }

  function handleLostPointerCapture(
    event: React.PointerEvent<SVGCircleElement>,
  ) {
    logger(`[Handle ${point.id}] handleLostPointerCapture`);
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDoubleClick(event: React.MouseEvent<SVGCircleElement>) {
    logger(`[Handle ${point.id}] handleDoubleClick`);
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

function HandlePath({ points }: { points: TPoint[] }) {
  const d = useMemo(() => {
    return points.reduce((a, c, i) => {
      const command = i > 0 ? "L" : "M";

      return `${a} ${command} ${c.x} ${c.y}`;
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
