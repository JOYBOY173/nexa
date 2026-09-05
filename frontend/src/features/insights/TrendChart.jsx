/**
 * A small, dependency-free line chart. Deliberately hand-rolled rather than
 * pulling in a charting library for a single sparkline-style visual.
 */
export default function TrendChart({ points, height = 160 }) {
  if (!points || points.length === 0) return null;

  const width = 560;
  const paddingX = 12;
  const paddingY = 16;
  const max = 100;
  const min = 0;

  const stepX = (width - paddingX * 2) / Math.max(points.length - 1, 1);

  const coords = points.map((p, i) => {
    const x = paddingX + i * stepX;
    const y = paddingY + (1 - (p.value - min) / (max - min)) * (height - paddingY * 2);
    return { x, y, ...p };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label={`Productivity trend from ${points[0].label} to ${points[points.length - 1].label}, ending at ${points[points.length - 1].value}%`}
    >
      <path d={areaPath} fill="#176B87" opacity="0.08" />
      <path d={linePath} fill="none" stroke="#176B87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map((c, i) => (
        <circle
          key={i}
          cx={c.x}
          cy={c.y}
          r={i === coords.length - 1 ? 4 : 2.5}
          fill={i === coords.length - 1 ? "#176B87" : "#FFFFFF"}
          stroke="#176B87"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}
