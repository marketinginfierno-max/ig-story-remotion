import { Radar } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function CompetitorTrackerPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Competitor Tracker"
        description="Monitor competitor accounts, posting cadence, and campaigns."
      />
      <ComingSoon
        icon={Radar}
        message="Tracked competitor profiles and their recent activity will live here."
      />
    </div>
  );
}
