"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { addMonths, startOfMonth, toISODate, today } from "@/lib/date";
import { PLATFORM_ORDER, type ContentItem, type Platform } from "./types";
import { getSeedItems } from "./seed-items";
import { PlatformFilter } from "./platform-filter";
import { MonthGrid } from "./month-grid";
import { DayItemsDialog } from "./day-items-dialog";

function formatMonthLabel(date: Date) {
  const label = new Intl.DateTimeFormat("es", { month: "long", year: "numeric" }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function CalendarView() {
  const [month, setMonth] = React.useState(() => startOfMonth(today()));
  const [activePlatforms, setActivePlatforms] = React.useState<Set<Platform>>(
    () => new Set(PLATFORM_ORDER)
  );
  const [openDay, setOpenDay] = React.useState<{ date: Date; items: ContentItem[] } | null>(
    null
  );

  const allItems = React.useMemo(() => getSeedItems(), []);
  const todayISO = React.useMemo(() => toISODate(today()), []);

  const itemsByDate = React.useMemo(() => {
    const map = new Map<string, ContentItem[]>();
    for (const item of allItems) {
      if (!activePlatforms.has(item.platform)) continue;
      const list = map.get(item.date);
      if (list) list.push(item);
      else map.set(item.date, [item]);
    }
    return map;
  }, [allItems, activePlatforms]);

  function togglePlatform(platform: Platform) {
    setActivePlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(platform)) next.delete(platform);
      else next.add(platform);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Calendario de Contenido"
          description="Visualiza todo lo programado en cada plataforma de un vistazo."
          className="border-b-0 pb-0"
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setMonth((m) => addMonths(m, -1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[10rem] text-center text-sm font-medium">
            {formatMonthLabel(month)}
          </span>
          <Button variant="outline" size="icon" onClick={() => setMonth((m) => addMonths(m, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setMonth(startOfMonth(today()))}>
            Hoy
          </Button>
        </div>
      </div>

      <PlatformFilter
        active={activePlatforms}
        onToggle={togglePlatform}
        onReset={() => setActivePlatforms(new Set(PLATFORM_ORDER))}
      />

      <MonthGrid
        month={month}
        todayISO={todayISO}
        itemsByDate={itemsByDate}
        onOpenDay={(date, items) => setOpenDay({ date, items })}
      />

      <DayItemsDialog
        date={openDay?.date ?? null}
        items={openDay?.items ?? []}
        onOpenChange={(open) => {
          if (!open) setOpenDay(null);
        }}
      />
    </div>
  );
}
