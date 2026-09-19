import { CalendarDays } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function ContentCalendarPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Calendario de Contenido"
        description="Visualiza todo lo programado en cada canal de un vistazo."
        badge="Próximamente"
      />
      <ComingSoon
        icon={CalendarDays}
        message="Aquí vivirá una vista de calendario mensual y semanal con arrastrar y soltar."
      />
    </div>
  );
}
