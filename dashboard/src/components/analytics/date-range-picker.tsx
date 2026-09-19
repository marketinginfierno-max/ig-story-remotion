"use client";

import * as React from "react";
import { Calendar, Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  PRESET_LABELS,
  PRESET_ORDER,
  formatRangeLabel,
  getPresetRange,
  type DateRangeValue,
} from "./date-range";
import { today, toISODate } from "@/lib/date";

interface DateRangePickerProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [customStart, setCustomStart] = React.useState(toISODate(value.start));
  const [customEnd, setCustomEnd] = React.useState(toISODate(value.end));

  React.useEffect(() => {
    setCustomStart(toISODate(value.start));
    setCustomEnd(toISODate(value.end));
  }, [value.start, value.end]);

  function applyCustomRange(startStr: string, endStr: string) {
    if (!startStr || !endStr) return;
    const start = new Date(`${startStr}T00:00:00Z`);
    const end = new Date(`${endStr}T00:00:00Z`);
    if (start.getTime() > end.getTime()) return;
    onChange({ preset: "custom", start, end });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {formatRangeLabel(value)}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="flex flex-col py-1">
          {PRESET_ORDER.map((preset) => {
            const isActive = value.preset === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  onChange(getPresetRange(preset));
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-accent/60",
                  isActive && "text-foreground"
                )}
              >
                {PRESET_LABELS[preset]}
                {isActive && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 border-t border-border p-3">
          <span className="text-xs font-medium text-muted-foreground">
            {PRESET_LABELS.custom}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex flex-1 flex-col gap-1">
              <Label htmlFor="range-start" className="text-xs text-muted-foreground">
                Desde
              </Label>
              <Input
                id="range-start"
                type="date"
                value={customStart}
                max={customEnd}
                onChange={(e) => {
                  setCustomStart(e.target.value);
                  applyCustomRange(e.target.value, customEnd);
                }}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <Label htmlFor="range-end" className="text-xs text-muted-foreground">
                Hasta
              </Label>
              <Input
                id="range-end"
                type="date"
                value={customEnd}
                min={customStart}
                max={toISODate(today())}
                onChange={(e) => {
                  setCustomEnd(e.target.value);
                  applyCustomRange(customStart, e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
