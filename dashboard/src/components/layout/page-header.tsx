import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-border pb-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <Badge variant="secondary">Próximamente</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
