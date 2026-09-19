"use client";

import * as React from "react";

import type { NewsItem } from "./types";

interface NewsState {
  items: NewsItem[];
  failedSources: string[];
  status: "loading" | "success" | "error";
}

export function useNews() {
  const [state, setState] = React.useState<NewsState>({
    items: [],
    failedSources: [],
    status: "loading",
  });

  const fetchNews = React.useCallback(async () => {
    setState((prev) => ({ ...prev, status: "loading" }));
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error(`API respondió ${res.status}`);
      const data = (await res.json()) as { items: NewsItem[]; failedSources: string[] };
      setState({ items: data.items, failedSources: data.failedSources ?? [], status: "success" });
    } catch {
      setState({ items: [], failedSources: [], status: "error" });
    }
  }, []);

  React.useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { ...state, refetch: fetchNews };
}
