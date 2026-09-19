"use client";

import * as React from "react";

import { useLocalStorageState } from "@/lib/use-local-storage-state";
import type { Post } from "./types";
import { SEED_POSTS } from "./seed-posts";

const STORAGE_KEY = "dashboard.instagram.posts";

export function usePosts() {
  const [posts, setPosts] = useLocalStorageState<Post[]>(STORAGE_KEY, SEED_POSTS);

  const addPost = React.useCallback(
    (post: Omit<Post, "id" | "createdAt">) => {
      const newPost: Post = {
        ...post,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setPosts((prev) => [newPost, ...prev]);
    },
    [setPosts]
  );

  return { posts, addPost };
}
