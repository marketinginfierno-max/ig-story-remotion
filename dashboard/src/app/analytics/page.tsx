import { BarChart3 } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Analytics"
        description="Track reach, engagement, and growth across your channels."
      />
      <ComingSoon
        icon={BarChart3}
        message="Engagement charts, audience breakdowns, and top-post rankings will live here."
      />
    </div>
  );
}
