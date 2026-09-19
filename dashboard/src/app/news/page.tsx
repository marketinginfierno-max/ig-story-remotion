import { Newspaper } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function NewsFeedPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Feed de Noticias"
        description="Mantente al día con noticias del sector, novedades de plataformas y tendencias."
        badge="Próximamente"
      />
      <ComingSoon
        icon={Newspaper}
        message="Aquí vivirá un feed curado de artículos del sector y novedades de las plataformas."
      />
    </div>
  );
}
