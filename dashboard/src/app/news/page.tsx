import { Newspaper } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function NewsFeedPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="News Feed"
        description="Stay current on industry news, platform updates, and trends."
      />
      <ComingSoon
        icon={Newspaper}
        message="A curated feed of industry articles and platform changelog updates will live here."
      />
    </div>
  );
}
