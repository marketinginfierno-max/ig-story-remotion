import { CalendarDays } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function ContentCalendarPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Content Calendar"
        description="See everything scheduled across every channel at a glance."
      />
      <ComingSoon
        icon={CalendarDays}
        message="A drag-and-drop monthly and weekly calendar view will live here."
      />
    </div>
  );
}
