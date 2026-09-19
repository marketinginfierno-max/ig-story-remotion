import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatDelta {
  label: string;
  direction: "up" | "down";
  isGood: boolean;
}

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: StatDelta;
}

export function StatCard({ icon: Icon, label, value, delta }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-4 w-4" />
          <span className="text-sm">{label}</span>
        </div>
        <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        {delta && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              delta.isGood ? "text-emerald-400" : "text-red-400"
            )}
          >
            {delta.direction === "up" ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5" />
            )}
            <span>{delta.label}</span>
            <span className="font-normal text-muted-foreground">vs. período anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
