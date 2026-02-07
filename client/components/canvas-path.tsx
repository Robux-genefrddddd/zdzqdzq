import { PathPoint, Path } from "@shared/types";

interface CanvasPathProps {
  path: Path;
  isSelected?: boolean;
}

export function CanvasPath({ path, isSelected }: CanvasPathProps) {
  if (path.points.length < 2) return null;

  // Generate SVG path string
  const pathData = path.points
    .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: "visible" }}
      width="100%"
      height="100%"
    >
      <path
        d={pathData}
        fill={path.closed ? path.fill || "none" : "none"}
        stroke={path.stroke || "#000"}
        strokeWidth={path.strokeWidth || 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Show anchor points if selected */}
      {isSelected && (
        <>
          {path.points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={4}
              fill="rgba(59, 130, 246, 0.8)"
              stroke="white"
              strokeWidth={1}
            />
          ))}
        </>
      )}
    </svg>
  );
}

interface PathPreviewProps {
  points: PathPoint[];
  currentPoint?: PathPoint;
}

export function PathPreview({ points, currentPoint }: PathPreviewProps) {
  if (points.length === 0) return null;

  // Show current path being drawn
  const allPoints = currentPoint ? [...points, currentPoint] : points;
  const pathData = allPoints
    .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: "visible" }}
      width="100%"
      height="100%"
    >
      {/* Path preview */}
      <path
        d={pathData}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={2}
        strokeDasharray="5,5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Anchor points */}
      {points.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r={4}
          fill="#3b82f6"
          stroke="white"
          strokeWidth={1}
        />
      ))}

      {/* Current cursor point */}
      {currentPoint && (
        <circle
          cx={currentPoint.x}
          cy={currentPoint.y}
          r={3}
          fill="rgba(59, 130, 246, 0.5)"
        />
      )}
    </svg>
  );
}
