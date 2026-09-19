"use client";

import * as React from "react";
import { Eye, FileText, Heart, Users } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard, type StatDelta } from "./stat-card";
import { BarChart } from "./bar-chart";
import { DateRangePicker } from "./date-range-picker";
import { getPresetRange, getPreviousPeriod, type DateRangeValue } from "./date-range";
import { followersAt, formatCompactNumber, formatPercent, seriesForRange } from "./mock-data";
import { addDays } from "@/lib/date";

function percentChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

function buildDelta(current: number, previous: number, unit: "percent" | "points" = "percent"): StatDelta {
  const direction: StatDelta["direction"] = current >= previous ? "up" : "down";
  if (unit === "points") {
    const diff = current - previous;
    return {
      direction,
      isGood: direction === "up",
      label: `${diff >= 0 ? "+" : ""}${diff.toFixed(1)} pp`,
    };
  }
  const change = percentChange(current, previous);
  return {
    direction,
    isGood: direction === "up",
    label: `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`,
  };
}

export function AnalyticsView() {
  const [range, setRange] = React.useState<DateRangeValue>(() => getPresetRange("30d"));

  const currentSeries = React.useMemo(
    () => seriesForRange(range.start, range.end),
    [range.start, range.end]
  );
  const previousPeriod = React.useMemo(() => getPreviousPeriod(range), [range]);
  const previousSeries = React.useMemo(
    () => seriesForRange(previousPeriod.start, previousPeriod.end),
    [previousPeriod]
  );

  const totalPosts = currentSeries.reduce((sum, d) => sum + d.postsPublished, 0);
  const prevTotalPosts = previousSeries.reduce((sum, d) => sum + d.postsPublished, 0);

  const totalReach = currentSeries.reduce((sum, d) => sum + d.reach, 0);
  const prevTotalReach = previousSeries.reduce((sum, d) => sum + d.reach, 0);

  const avgEngagement =
    currentSeries.reduce((sum, d) => sum + d.engagementRate, 0) / currentSeries.length;
  const prevAvgEngagement =
    previousSeries.reduce((sum, d) => sum + d.engagementRate, 0) / previousSeries.length;

  const followersNow = followersAt(range.end);
  const followersBefore = followersAt(addDays(range.start, -1));
  const followerChange = followersNow - followersBefore;
  const followerChangePercent = percentChange(followersNow, followersBefore);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Analítica"
          description="Sigue el alcance, la interacción y el crecimiento de tus canales."
          className="border-b-0 pb-0"
        />
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Publicaciones totales"
          value={String(totalPosts)}
          delta={buildDelta(totalPosts, prevTotalPosts)}
        />
        <StatCard
          icon={Eye}
          label="Alcance"
          value={formatCompactNumber(totalReach)}
          delta={buildDelta(totalReach, prevTotalReach)}
        />
        <StatCard
          icon={Heart}
          label="Tasa de interacción"
          value={formatPercent(avgEngagement)}
          delta={buildDelta(avgEngagement, prevAvgEngagement, "points")}
        />
        <StatCard
          icon={Users}
          label="Seguidores"
          value={formatCompactNumber(followersNow)}
          delta={{
            direction: followerChange >= 0 ? "up" : "down",
            isGood: followerChange >= 0,
            label: `${followerChange >= 0 ? "+" : ""}${formatCompactNumber(
              followerChange
            )} (${followerChangePercent >= 0 ? "+" : ""}${followerChangePercent.toFixed(1)}%)`,
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Alcance por día</CardTitle>
            <CardDescription>
              Cuentas alcanzadas cada día en el período seleccionado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={currentSeries.map((d) => ({ date: d.date, value: d.reach }))}
              colorVar="--chart-reach"
              hoverColorVar="--chart-reach-hover"
              valueFormatter={formatCompactNumber}
              ariaLabel="Gráfico de barras: alcance por día"
              tableValueHeader="Alcance"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasa de interacción por día</CardTitle>
            <CardDescription>
              Interacciones sobre alcance, cada día en el período seleccionado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={currentSeries.map((d) => ({ date: d.date, value: d.engagementRate }))}
              colorVar="--chart-engagement"
              hoverColorVar="--chart-engagement-hover"
              valueFormatter={formatPercent}
              ariaLabel="Gráfico de barras: tasa de interacción por día"
              tableValueHeader="Tasa de interacción"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
