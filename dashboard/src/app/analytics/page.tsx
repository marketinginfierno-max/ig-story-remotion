import { BarChart3 } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Analítica"
        description="Sigue el alcance, la interacción y el crecimiento de tus canales."
      />
      <ComingSoon
        icon={BarChart3}
        message="Aquí vivirán los gráficos de interacción, el desglose de audiencia y el ranking de mejores publicaciones."
      />
    </div>
  );
}
