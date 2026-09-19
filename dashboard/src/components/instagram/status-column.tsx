import { cn } from "@/lib/utils";
import {
  POST_STATUS_DOT_CLASSES,
  POST_STATUS_LABELS,
  type Post,
  type PostStatus,
} from "./types";
import { PostCard } from "./post-card";

export function StatusColumn({
  status,
  posts,
}: {
  status: PostStatus;
  posts: Post[];
}) {
  return (
    <div className="flex w-72 shrink-0 flex-col gap-3 sm:w-auto">
      <div className="flex items-center gap-2 px-1">
        <span
          className={cn("h-2 w-2 rounded-full", POST_STATUS_DOT_CLASSES[status])}
        />
        <h2 className="text-sm font-semibold tracking-tight">
          {POST_STATUS_LABELS[status]}
        </h2>
        <span className="text-xs text-muted-foreground">{posts.length}</span>
      </div>
      <div className="flex flex-col gap-3">
        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            Sin publicaciones
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
