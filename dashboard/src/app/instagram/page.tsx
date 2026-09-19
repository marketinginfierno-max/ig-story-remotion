import { Camera } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ComingSoon } from "@/components/layout/coming-soon";

export default function InstagramManagerPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Instagram Manager"
        description="Plan, schedule, and publish Instagram posts, stories, and reels."
      />
      <ComingSoon
        icon={Camera}
        message="Post composer, media library, and scheduling queue will live here."
      />
    </div>
  );
}
