"use client";

import * as React from "react";
import { Table2, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BarChartDatum {
  date: string;
  value: number;
}

interface BarChartProps {
  data: BarChartDatum[];
  colorVar: string;
  hoverColorVar: string;
  valueFormatter: (value: number) => string;
  ariaLabel: string;
  tableValueHeader: string;
}

const VIEW_W = 800;
const VIEW_H = 260;
const MARGIN = { top: 16, right: 8, bottom: 28, left: 48 };
const PLOT_W = VIEW_W - MARGIN.left - MARGIN.right;
const PLOT_H = VIEW_H - MARGIN.top - MARGIN.bottom;
const MAX_BAR_WIDTH = 24;
const GAP = 2;
const RADIUS = 4;

function niceCeil(value: number): number {
  if (value <= 0) return 10;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const niceNormalized = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return niceNormalized * magnitude;
}

function barPath(x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.max(0, Math.min(radius, width / 2, height));
  const baseline = y + height;
  if (height <= 0) return "";
  return `M ${x} ${baseline} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} L ${
    x + width - r
  } ${y} Q ${x + width} ${y} ${x + width} ${y + r} L ${x + width} ${baseline} Z`;
}

function formatDateLabel(iso: string) {
  return new Intl.DateTimeFormat("es", { day: "numeric", month: "short" }).format(
    new Date(`${iso}T00:00:00Z`)
  );
}

export function BarChart({
  data,
  colorVar,
  hoverColorVar,
  valueFormatter,
  ariaLabel,
  tableValueHeader,
}: BarChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [showTable, setShowTable] = React.useState(false);

  const max = Math.max(0, ...data.map((d) => d.value));
  const niceMax = niceCeil(max);
  const yTicks = [0, niceMax / 2, niceMax];

  const slotWidth = data.length > 0 ? PLOT_W / data.length : 0;
  const barWidth = Math.max(1, Math.min(MAX_BAR_WIDTH, slotWidth - GAP));

  const xLabelStep = Math.max(1, Math.ceil(data.length / 7));

  function yFor(value: number) {
    const ratio = niceMax > 0 ? value / niceMax : 0;
    return MARGIN.top + PLOT_H - ratio * PLOT_H;
  }

  const active = activeIndex !== null ? data[activeIndex] : null;
  const activeCenterXPct = activeIndex !== null
    ? ((MARGIN.left + activeIndex * slotWidth + slotWidth / 2) / VIEW_W) * 100
    : 0;
  const activeTopYPct = active ? (yFor(active.value) / VIEW_H) * 100 : 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs text-muted-foreground"
          onClick={() => setShowTable((v) => !v)}
        >
          {showTable ? (
            <>
              <BarChart3 className="h-3.5 w-3.5" /> Ver gráfico
            </>
          ) : (
            <>
              <Table2 className="h-3.5 w-3.5" /> Ver tabla
            </>
          )}
        </Button>
      </div>

      {showTable ? (
        <div className="max-h-72 overflow-y-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-3 py-2 font-medium">Fecha</th>
                <th className="px-3 py-2 font-medium">{tableValueHeader}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.date} className="border-b border-border last:border-0">
                  <td className="px-3 py-1.5">{formatDateLabel(d.date)}</td>
                  <td className="px-3 py-1.5 tabular-nums">{valueFormatter(d.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative w-full" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-full w-full overflow-visible"
            role="img"
            aria-label={ariaLabel}
          >
            {yTicks.map((tick) => {
              const y = yFor(tick);
              return (
                <g key={tick}>
                  <line
                    x1={MARGIN.left}
                    x2={VIEW_W - MARGIN.right}
                    y1={y}
                    y2={y}
                    stroke="hsl(var(--border))"
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x={MARGIN.left - 8}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize={12}
                    fill="hsl(var(--muted-foreground))"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {valueFormatter(tick)}
                  </text>
                </g>
              );
            })}

            {data.map((d, i) => {
              const height = niceMax > 0 ? (d.value / niceMax) * PLOT_H : 0;
              const x = MARGIN.left + i * slotWidth + (slotWidth - barWidth) / 2;
              const y = MARGIN.top + PLOT_H - height;
              const isActive = activeIndex === i;
              const showLabel = i % xLabelStep === 0 || i === data.length - 1;

              return (
                <g key={d.date}>
                  <path
                    d={barPath(x, y, barWidth, height, RADIUS)}
                    fill={isActive ? `hsl(var(${hoverColorVar}))` : `hsl(var(${colorVar}))`}
                    style={{ transition: "fill 120ms ease" }}
                  />
                  {showLabel && (
                    <text
                      x={MARGIN.left + i * slotWidth + slotWidth / 2}
                      y={VIEW_H - 8}
                      textAnchor="middle"
                      fontSize={11}
                      fill="hsl(var(--muted-foreground))"
                    >
                      {formatDateLabel(d.date)}
                    </text>
                  )}
                  <rect
                    x={MARGIN.left + i * slotWidth}
                    y={MARGIN.top}
                    width={slotWidth}
                    height={PLOT_H}
                    fill="transparent"
                    tabIndex={0}
                    role="button"
                    aria-label={`${formatDateLabel(d.date)}: ${valueFormatter(d.value)}`}
                    className="cursor-pointer outline-none"
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex((cur) => (cur === i ? null : cur))}
                    onFocus={() => setActiveIndex(i)}
                    onBlur={() => setActiveIndex((cur) => (cur === i ? null : cur))}
                  />
                </g>
              );
            })}
          </svg>

          {active && (
            <div
              className={cn(
                "pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+8px)] whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md"
              )}
              style={{ left: `${activeCenterXPct}%`, top: `${activeTopYPct}%` }}
            >
              <p className="tabular-nums font-semibold text-foreground">
                {valueFormatter(active.value)}
              </p>
              <p className="text-muted-foreground">{formatDateLabel(active.date)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
