import { Camera } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function InstagramManagerPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Gestor de Instagram"
        description="Planifica, programa y publica posts, historias y reels de Instagram."
      />
      <ComingSoon
        icon={Camera}
        message="Aquí vivirán el compositor de publicaciones, la biblioteca de medios y la cola de programación."
      />
    </div>
  );
}
