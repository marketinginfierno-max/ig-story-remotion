import { ArrowDown, ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";

export function GrowthDelta({ value }: { value: number }) {
  const isUp = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium tabular-nums",
        isUp ? "text-emerald-400" : "text-red-400"
      )}
    >
      {isUp ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}
