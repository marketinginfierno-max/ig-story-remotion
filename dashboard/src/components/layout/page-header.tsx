import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  badge?: string;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-b border-border pb-6",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {badge && <Badge variant="secondary">{badge}</Badge>}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
