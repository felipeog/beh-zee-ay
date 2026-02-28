import { useMemo, useRef, useState } from "react";

const WIDTH = 500;
const HEIGHT = 500;
const DEFAULT_POINTS = [
  { id: 0, x: 0.5 * WIDTH, y: 0.75 * HEIGHT },
  { id: 1, x: 0 * WIDTH, y: 0.25 * HEIGHT },
  { id: 2, x: 0.9 * WIDTH, y: 0.2 * HEIGHT },
  { id: 3, x: 0.5 * WIDTH, y: 1 * HEIGHT },
  { id: 4, x: 0.1 * WIDTH, y: 0.2 * HEIGHT },
  { id: 5, x: 1 * WIDTH, y: 0.25 * HEIGHT },
  { id: 6, x: 0.5 * WIDTH, y: 0.725 * HEIGHT },
];
const DEFAULT_STEPS = 32;

export function App() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [steps, setSteps] = useState(DEFAULT_STEPS);
  const [points, setPoints] = useState(DEFAULT_POINTS);

  function handleRectClick(event: React.MouseEvent<SVGRectElement>) {
    const cursorPoint = getSvgPoint({
      x: event.clientX,
      y: event.clientY,
    });

    setPoints((prevPoints) => [
      ...prevPoints,
      {
        id: prevPoints.length,
        x: cursorPoint.x,
        y: cursorPoint.y,
      },
    ]);
  }

  const curvePoints = useMemo(() => {
    if (points.length < 2 || steps < 2) return [];

    const initialPoints = points.map(({ x, y }) => ({ x, y }));
    const curvePoints = [{ ...initialPoints[0] }];

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      let points = [...initialPoints];

      while (points.length > 1) {
        const midpoints = [];

        for (let i = 0; i + 1 < points.length; ++i) {
          let a = points[i];
          let b = points[i + 1];

          midpoints.push({
            x: a.x + t * (b.x - a.x),
            y: a.y + t * (b.y - a.y),
          });
        }

        points = [...midpoints];
      }

      curvePoints.push(points[0]);
    }

    return curvePoints;
  }, [points, steps]);

  function getSvgPoint({ x, y }: { x: number; y: number }) {
    const svgPoint = svgRef.current!.createSVGPoint();
    const screenMatrix = svgRef.current!.getScreenCTM();
    const svgMatrix = screenMatrix!.inverse();

    svgPoint.x = x;
    svgPoint.y = y;

    return svgPoint.matrixTransform(svgMatrix);
  }

  function handleStepsInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(event.target.value, 10);

    if (!isNaN(value) && value > 0) {
      setSteps(value);
    }
  }

  function handleResetButtonClick() {
    setPoints(DEFAULT_POINTS);
    setSteps(DEFAULT_STEPS);
  }

  function getHandleSetPosition(id: number) {
    return (event: React.PointerEvent<SVGCircleElement>) => {
      setPoints((prevPoints) => {
        const rect = svgRef.current!.getBoundingClientRect();
        const topLeftPoint = getSvgPoint({
          x: rect.left,
          y: rect.top,
        });
        const bottomRightPoint = getSvgPoint({
          x: rect.right,
          y: rect.bottom,
        });

        const cursorPoint = getSvgPoint({
          x: event.clientX,
          y: event.clientY,
        });
        const clampedPoint = {
          x: Math.min(
            Math.max(cursorPoint.x, topLeftPoint.x),
            bottomRightPoint.x,
          ),
          y: Math.min(
            Math.max(cursorPoint.y, topLeftPoint.y),
            bottomRightPoint.y,
          ),
        };

        const points = [...prevPoints];
        const point = { id, x: clampedPoint.x, y: clampedPoint.y };
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
        viewBox="0 0 500 500"
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
          <CurvePoints points={curvePoints} />
        </g>

        <g>
          <CurvePath points={curvePoints} />
        </g>

        <g>
          {points.map((point) => (
            <Handle
              key={point.id}
              point={point}
              setPosition={getHandleSetPosition(point.id)}
            />
          ))}
        </g>
      </svg>

      <br />
      <br />

      <label>
        steps{" "}
        <input
          value={steps}
          onChange={handleStepsInputChange}
          type="number"
          min="1"
        />
      </label>

      <br />
      <br />

      <button onClick={handleResetButtonClick}>reset</button>
    </main>
  );
}

function Handle({
  point,
  setPosition,
}: {
  point: { id: number; x: number; y: number };
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

function HandlePath({
  points,
}: {
  points: { id: number; x: number; y: number }[];
}) {
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

function CurvePoints({ points }: { points: { x: number; y: number }[] }) {
  return points.map((point, index) => (
    <circle
      className="CurvePoints"
      key={index}
      cx={point.x}
      cy={point.y}
      r="2"
      fill="none"
      stroke="var(--curve-point-stroke)"
      strokeWidth="1"
    ></circle>
  ));
}

function CurvePath({ points }: { points: { x: number; y: number }[] }) {
  const d = useMemo(() => {
    return points.reduce((a, c, i) => {
      const command = i > 0 ? "L" : "M";

      return `${a} ${command} ${c.x} ${c.y}`;
    }, "");
  }, [points]);

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
