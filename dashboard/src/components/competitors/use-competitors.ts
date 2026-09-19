"use client";

import * as React from "react";

import { useLocalStorageState } from "@/lib/use-local-storage-state";
import { createCompetitor, getSeedCompetitors } from "./mock-data";
import type { Competitor } from "./types";

const STORAGE_KEY = "dashboard.competitors";

export function useCompetitors() {
  const [competitors, setCompetitors] = useLocalStorageState<Competitor[]>(
    STORAGE_KEY,
    getSeedCompetitors()
  );

  const addCompetitor = React.useCallback(
    (handle: string) => {
      setCompetitors((prev) => [...prev, createCompetitor(handle)]);
    },
    [setCompetitors]
  );

  return { competitors, addCompetitor };
}
