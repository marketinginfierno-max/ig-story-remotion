"use client";

import { PageHeader } from "@/components/layout/page-header";
import { usePosts } from "./use-posts";
import { NewPostDialog } from "./new-post-dialog";
import { StatusColumn } from "./status-column";
import { POST_STATUS_ORDER } from "./types";

export function InstagramBoard() {
  const { posts, addPost } = usePosts();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Gestor de Instagram"
          description="Planifica, programa y publica posts, historias y reels de Instagram."
          className="border-b-0 pb-0"
        />
        <NewPostDialog onCreate={addPost} />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-5">
        {POST_STATUS_ORDER.map((status) => (
          <StatusColumn
            key={status}
            status={status}
            posts={posts.filter((post) => post.status === status)}
          />
        ))}
      </div>
    </div>
  );
}
