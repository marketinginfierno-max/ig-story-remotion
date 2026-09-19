"use client";

import * as React from "react";

import type { Post } from "./types";
import { SEED_POSTS } from "./seed-posts";

const STORAGE_KEY = "dashboard.instagram.posts";

export function usePosts() {
  const [posts, setPosts] = React.useState<Post[]>(SEED_POSTS);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setPosts(JSON.parse(stored) as Post[]);
    } catch {
      // localStorage no disponible (modo privado, etc.) — se sigue usando el estado en memoria.
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch {
      // idem — falla en silencio si el storage no está disponible.
    }
  }, [posts, hydrated]);

  const addPost = React.useCallback((post: Omit<Post, "id" | "createdAt">) => {
    const newPost: Post = {
      ...post,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  return { posts, addPost };
}
