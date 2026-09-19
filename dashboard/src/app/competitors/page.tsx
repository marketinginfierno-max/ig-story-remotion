import { Radar } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function CompetitorTrackerPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Seguimiento de Competencia"
        description="Monitorea cuentas de la competencia, su ritmo de publicación y campañas."
        badge="Próximamente"
      />
      <ComingSoon
        icon={Radar}
        message="Aquí vivirán los perfiles de competencia seguidos y su actividad reciente."
      />
    </div>
  );
}
