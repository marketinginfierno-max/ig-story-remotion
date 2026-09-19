import { Info } from "lucide-react";

export function DataSourceNote() {
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-dashed border-border bg-card/40 p-3 text-xs text-muted-foreground">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <p>
        Los datos de esta tabla son de ejemplo — no vienen de Instagram real todavía.
        Cuando quieras conectar una fuente de datos real (por ejemplo la API de Meta/Instagram,
        o un servicio de terceros que scrapee perfiles públicos), el lugar donde engancharla es{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-foreground">
          src/components/competitors/use-competitors.ts
        </code>
        : ahí es donde hoy se generan las estadísticas de ejemplo para cada handle, y donde
        pasarían a pedirse a esa fuente en su lugar.
      </p>
    </div>
  );
}
