"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCompactNumber, formatPercent } from "@/lib/format";
import type { Competitor, SortKey, SortState } from "./types";
import { GrowthDelta } from "./growth-delta";

const COLUMNS: Array<{ key: SortKey; label: string; align: "left" | "right" }> = [
  { key: "handle", label: "Handle", align: "left" },
  { key: "followers", label: "Seguidores", align: "right" },
  { key: "recentPosts", label: "Posts recientes (30 días)", align: "right" },
  { key: "postsPerWeek", label: "Frecuencia (por semana)", align: "right" },
  { key: "engagementRate", label: "Interacción", align: "right" },
  { key: "growthPercent", label: "Crecimiento (30 días)", align: "right" },
];

function defaultDirectionFor(key: SortKey): "asc" | "desc" {
  return key === "handle" ? "asc" : "desc";
}

function compare(a: Competitor, b: Competitor, key: SortKey): number {
  const av = a[key];
  const bv = b[key];
  if (typeof av === "string" && typeof bv === "string") {
    return av.localeCompare(bv);
  }
  return (av as number) - (bv as number);
}

export function CompetitorsTable({ competitors }: { competitors: Competitor[] }) {
  const [sort, setSort] = React.useState<SortState>({ key: "followers", direction: "desc" });

  const sorted = React.useMemo(() => {
    const copy = [...competitors];
    copy.sort((a, b) => {
      const result = compare(a, b, sort.key);
      return sort.direction === "asc" ? result : -result;
    });
    return copy;
  }, [competitors, sort]);

  function handleSort(key: SortKey) {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: defaultDirectionFor(key) }
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-card/40">
            {COLUMNS.map((col) => {
              const isActive = sort.key === col.key;
              return (
                <th key={col.key} className={cn("p-0", col.align === "right" && "text-right")}>
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className={cn(
                      "flex w-full items-center gap-1 px-3 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
                      col.align === "right" && "justify-end"
                    )}
                  >
                    {col.label}
                    {isActive ? (
                      sort.direction === "asc" ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )
                    ) : (
                      <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                    )}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((competitor) => (
            <tr key={competitor.id} className="border-b border-border last:border-0 hover:bg-accent/20">
              <td className="px-3 py-3 font-medium text-foreground">{competitor.handle}</td>
              <td className="px-3 py-3 text-right tabular-nums">
                {formatCompactNumber(competitor.followers)}
              </td>
              <td className="px-3 py-3 text-right tabular-nums">{competitor.recentPosts}</td>
              <td className="px-3 py-3 text-right tabular-nums">
                {competitor.postsPerWeek.toFixed(1)}
              </td>
              <td className="px-3 py-3 text-right tabular-nums">
                {formatPercent(competitor.engagementRate)}
              </td>
              <td className="px-3 py-3 text-right">
                <GrowthDelta value={competitor.growthPercent} />
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length} className="px-3 py-8 text-center text-muted-foreground">
                Todavía no agregaste ningún competidor.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
