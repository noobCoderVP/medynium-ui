import { formatDate, formatValue } from "@/lib/format";
import type { LabTrend } from "@/lib/api/types";
import { CHART, layoutChart, summarize } from "../lib/chart";

/**
 * A small custom SVG line chart (no chart library, 06 section 7). The reference range is a band; each point is
 * keyboard-focusable and named; a text summary and a table of the same values accompany it, so the chart is
 * never the only way to read the data (WCAG 2.2 AA).
 */
export function LabTrendChart({ trend }: { trend: LabTrend }) {
  const plot = layoutChart(trend);
  const { width, height, left, right, top, bottom } = CHART;
  const path = plot.points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const first = plot.points[0];
  const last = plot.points[plot.points.length - 1];

  return (
    <figure className="space-y-3">
      <figcaption className="text-sm">{summarize(trend)}</figcaption>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="group"
        aria-label={`${trend.test} trend chart. A table with the same values follows.`}
        className="w-full max-w-3xl"
      >
        {plot.band ? (
          <rect
            x={left}
            width={width - left - right}
            y={plot.band.top}
            height={Math.max(0, plot.band.bottom - plot.band.top)}
            className="fill-ok-soft"
          />
        ) : null}
        {plot.line !== null ? (
          <line
            x1={left}
            x2={width - right}
            y1={plot.line}
            y2={plot.line}
            strokeDasharray="4 4"
            className="stroke-ok"
          />
        ) : null}
        {plot.ticks.map((tick) => (
          <g key={tick.y}>
            <line x1={left} x2={width - right} y1={tick.y} y2={tick.y} className="stroke-border" />
            <text
              x={left - 6}
              y={tick.y + 4}
              textAnchor="end"
              className="fill-muted-foreground text-[11px]"
            >
              {formatValue(tick.value)}
            </text>
          </g>
        ))}
        {first ? (
          <>
            <text
              x={first.x}
              y={height - bottom + 18}
              textAnchor={plot.points.length > 1 ? "start" : "middle"}
              className="fill-muted-foreground text-[11px]"
            >
              {formatDate(first.date)}
            </text>
            {plot.points.length > 1 ? (
              <text
                x={last.x}
                y={height - bottom + 18}
                textAnchor="end"
                className="fill-muted-foreground text-[11px]"
              >
                {formatDate(last.date)}
              </text>
            ) : null}
          </>
        ) : null}
        <path d={path} fill="none" strokeWidth={2} className="stroke-primary" />
        {plot.points.map((p) => (
          <circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={5}
            tabIndex={0}
            role="img"
            aria-label={`${formatDate(p.date)}: ${formatValue(p.value, trend.unit)}`}
            className="fill-card stroke-primary outline-none focus-visible:stroke-[4]"
            strokeWidth={2.5}
          />
        ))}
        <text x={left} y={top - 4} className="fill-muted-foreground text-[11px]">
          {trend.unit ?? ""}
        </text>
      </svg>
      <table className="w-full max-w-md text-sm">
        <caption className="sr-only">{trend.test} values</caption>
        <thead className="text-left text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="py-1 font-medium">
              Date
            </th>
            <th scope="col" className="py-1 text-right font-medium">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {[...plot.points].reverse().map((p) => (
            <tr key={p.id} className="border-t border-border">
              <td className="py-1">{formatDate(p.date)}</td>
              <td className="py-1 text-right tabular-nums">{formatValue(p.value, trend.unit)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
