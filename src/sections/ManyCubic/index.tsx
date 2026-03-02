import { useMemo, useRef, useState } from "react";

import { CurvePath } from "../../components/CurvePath";
import { CurvePoints } from "../../components/CurvePoints";
import { Handle } from "./components/Handle";
import { HandlePath } from "./components/HandlePath";

import { DEFAULT_PRESET } from "./constants/defaultPreset";
import { DEFAULT_SEGMENTS } from "./constants/defaultSegments";
import { PRESET_MAP } from "./constants/presetMap";
import { SIZE } from "../../constants/size";

import type { TCoord } from "../../types/TCoord";
import type { TPoint } from "./types/TPoint";

import { generateId } from "../../utils/generateId";

export function ManyCubic() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [segments, setSegments] = useState(DEFAULT_SEGMENTS);
  const [points, setPoints] = useState(DEFAULT_PRESET);

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
        viewBox={`0 0 ${SIZE.WIDTH} ${SIZE.HEIGHT}`}
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

      <label>
        segments per curve
        <input
          value={segments}
          onChange={handleSegmentsInputChange}
          type="number"
          min="1"
        />
      </label>

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
