"use client";

import { PageHeader } from "@/components/layout/page-header";
import { useCompetitors } from "./use-competitors";
import { AddCompetitorDialog } from "./add-competitor-dialog";
import { CompetitorsTable } from "./competitors-table";
import { DataSourceNote } from "./data-source-note";

export function CompetitorTrackerView() {
  const { competitors, addCompetitor } = useCompetitors();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Seguimiento de Competencia"
          description="Monitorea cuentas de la competencia, su ritmo de publicación y campañas."
        />
        <AddCompetitorDialog onAdd={addCompetitor} />
      </div>

      <DataSourceNote />

      <CompetitorsTable competitors={competitors} />
    </div>
  );
}
