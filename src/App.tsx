import { useMemo, useRef, useState } from "react";

type TCoordinates = { x: number; y: number };
type TPoint = TCoordinates & { id: number };
type TPreset = TPoint[];

const WIDTH = 500;
const HEIGHT = 500;

const EMPTY: TPreset = [];
const LINEAR: TPreset = [
  { id: 0, x: 0.25 * WIDTH, y: 0.25 * HEIGHT },
  { id: 1, x: 0.75 * WIDTH, y: 0.75 * HEIGHT },
];
const QUADRATIC: TPreset = [
  { id: 0, x: 0.25 * WIDTH, y: 0.75 * HEIGHT },
  { id: 1, x: 0.5 * WIDTH, y: 0.25 * HEIGHT },
  { id: 2, x: 0.75 * WIDTH, y: 0.75 * HEIGHT },
];
const CUBIC: TPreset = [
  { id: 0, x: 0.25 * WIDTH, y: 0.75 * HEIGHT },
  { id: 1, x: 0.25 * WIDTH, y: 0.25 * HEIGHT },
  { id: 2, x: 0.75 * WIDTH, y: 0.25 * HEIGHT },
  { id: 3, x: 0.75 * WIDTH, y: 0.75 * HEIGHT },
];
const HEART: TPreset = [
  { id: 0, x: 0.5 * WIDTH, y: 0.75 * HEIGHT },
  { id: 1, x: 0 * WIDTH, y: 0.25 * HEIGHT },
  { id: 2, x: 0.9 * WIDTH, y: 0.2 * HEIGHT },
  { id: 3, x: 0.5 * WIDTH, y: 1 * HEIGHT },
  { id: 4, x: 0.1 * WIDTH, y: 0.2 * HEIGHT },
  { id: 5, x: 1 * WIDTH, y: 0.25 * HEIGHT },
  { id: 6, x: 0.5 * WIDTH, y: 0.725 * HEIGHT },
];

const PRESET_MAP = {
  empty: EMPTY,
  linear: LINEAR,
  quadratic: QUADRATIC,
  cubic: CUBIC,
  heart: HEART,
};
const PRESET_KEYS = Object.keys(PRESET_MAP);
const PRESET_VALUES = Object.values(PRESET_MAP);

const DEFAULT_SEGMENTS = 32;

export function App() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [segments, setSegments] = useState(DEFAULT_SEGMENTS);
  const [points, setPoints] = useState(HEART);

  function handleRectClick(event: React.MouseEvent<SVGRectElement>) {
    const svgCoordinates = getSvgCoordinatesFromScreenCoordinates({
      x: event.clientX,
      y: event.clientY,
    });
    const point: TPoint = {
      id: points.length,
      x: svgCoordinates.x,
      y: svgCoordinates.y,
    };

    setPoints((prevPoints) => [...prevPoints, point]);
  }

  const curveCoordinates = useMemo(() => {
    if (points.length <= 0) return [];

    const initialCoordinates: TCoordinates[] = points.map(({ x, y }) => ({
      x,
      y,
    }));
    const curveCoordinates = [];

    for (let segment = 0; segment < segments; segment++) {
      const t = segment / segments;
      let coordinates = [...initialCoordinates];

      while (coordinates.length > 1) {
        const midCoordinates = [];

        for (let i = 0; i + 1 < coordinates.length; ++i) {
          const a = coordinates[i];
          const b = coordinates[i + 1];

          midCoordinates.push({
            x: a.x + t * (b.x - a.x),
            y: a.y + t * (b.y - a.y),
          });
        }

        coordinates = [...midCoordinates];
      }

      curveCoordinates.push(coordinates[0]);
    }

    curveCoordinates.push({
      ...initialCoordinates[initialCoordinates.length - 1],
    });

    return curveCoordinates;
  }, [points, segments]);

  function getSvgCoordinatesFromScreenCoordinates(
    screenCoordinates: TCoordinates,
  ): TCoordinates {
    const screenMatrix = svgRef.current!.getScreenCTM();
    const svgMatrix = screenMatrix!.inverse();
    const svgPoint = svgRef.current!.createSVGPoint();

    svgPoint.x = screenCoordinates.x;
    svgPoint.y = screenCoordinates.y;

    const svgCoordinates = svgPoint.matrixTransform(svgMatrix);

    return {
      x: svgCoordinates.x,
      y: svgCoordinates.y,
    };
  }

  function handleSegmentsInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const value = parseInt(event.target.value, 10) || 1;

    setSegments(value);
  }

  function getHandleSetPosition(id: TPoint["id"]) {
    return (event: React.PointerEvent<SVGCircleElement>) => {
      setPoints((prevPoints) => {
        const rect = svgRef.current!.getBoundingClientRect();
        const topLeftCoordinates = getSvgCoordinatesFromScreenCoordinates({
          x: rect.left,
          y: rect.top,
        });
        const bottomRightCoordinates = getSvgCoordinatesFromScreenCoordinates({
          x: rect.right,
          y: rect.bottom,
        });
        const cursorCoordinates = getSvgCoordinatesFromScreenCoordinates({
          x: event.clientX,
          y: event.clientY,
        });
        const clampedCoordinates = {
          x: Math.min(
            Math.max(cursorCoordinates.x, topLeftCoordinates.x),
            bottomRightCoordinates.x,
          ),
          y: Math.min(
            Math.max(cursorCoordinates.y, topLeftCoordinates.y),
            bottomRightCoordinates.y,
          ),
        };
        const points = [...prevPoints];
        const point: TPoint = {
          id,
          x: clampedCoordinates.x,
          y: clampedCoordinates.y,
        };
        const index = points.findIndex((p) => p.id === id);

        points.splice(index, 1, point);

        return points;
      });
    };
  }

  return (
    <main className="App">
      <h1>Beh Zee Ay</h1>

      <a
        href="https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm"
        target="_blank"
      >
        De Casteljau's algorithm
      </a>

      <br />

      <svg
        className="App__svg"
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
          <CurvePoints coordinates={curveCoordinates} />
        </g>

        <g>
          <CurvePath coordinates={curveCoordinates} />
        </g>

        <g>
          {points.map((p) => (
            <Handle
              key={p.id}
              point={p}
              setPosition={getHandleSetPosition(p.id)}
            />
          ))}
        </g>
      </svg>

      <br />
      <br />

      <label>
        segments
        <br />
        <input
          value={segments}
          onChange={handleSegmentsInputChange}
          type="number"
          min="1"
        />
      </label>

      <br />
      <br />

      <p>presets</p>

      {PRESET_KEYS.map((k, i) => (
        <button key={k} onClick={() => setPoints(PRESET_VALUES[i])}>
          {k}
        </button>
      ))}
    </main>
  );
}

function Handle({
  point,
  setPosition,
}: {
  point: TPoint;
  setPosition: (event: React.PointerEvent<SVGCircleElement>) => void;
}) {
  const circleRef = useRef<SVGCircleElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handlePointerDown(event: React.PointerEvent<SVGCircleElement>) {
    setIsDragging(true);

    circleRef.current!.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<SVGCircleElement>) {
    if (!isDragging) return;

    setPosition(event);
  }

  function handlePointerUp(event: React.PointerEvent<SVGCircleElement>) {
    setIsDragging(false);

    circleRef.current!.releasePointerCapture(event.pointerId);
  }

  return (
    <g className="Handle">
      <circle
        className="Handle__circle"
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
      ></circle>

      <text
        x={point.x + 8}
        y={point.y}
        dominantBaseline="central"
        fill="var(--text-fill)"
      >
        {point.id}
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
      className="HandlePath"
      fill="none"
      stroke="var(--handle-path-stroke)"
      strokeWidth="1"
      d={d}
    ></path>
  );
}

function CurvePoints({ coordinates }: { coordinates: TCoordinates[] }) {
  return coordinates.map((c, i) => (
    <circle
      className="CurvePoints"
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

function CurvePath({ coordinates }: { coordinates: TCoordinates[] }) {
  const d = useMemo(() => {
    return coordinates.reduce((a, c, i) => {
      const command = i > 0 ? "L" : "M";

      return `${a} ${command} ${c.x} ${c.y}`;
    }, "");
  }, [coordinates]);

  return (
    <path
      className="CurvePath"
      fill="none"
      stroke="var(--curve-path-stroke)"
      strokeWidth="2"
      d={d}
    ></path>
  );
}
