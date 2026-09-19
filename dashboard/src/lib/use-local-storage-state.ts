"use client";

import * as React from "react";

// Patrón de hidratación en dos pasos: el estado arranca en `initialValue`
// (lo mismo que se renderiza en el server, sin mismatch de hidratación), y
// solo se empieza a escribir a localStorage una vez que el efecto de carga
// ya corrió (`hydrated`). Si el efecto de guardado corriera antes que el de
// carga, pisaría datos reales del usuario con el valor inicial — ver
// CLAUDE.md, sección "Gestor de Instagram", para el detalle de este bug.
export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = React.useState<T>(initialValue);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) setState(JSON.parse(stored) as T);
    } catch {
      // localStorage no disponible (modo privado, etc.) — sigue en memoria.
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // idem — falla en silencio si el storage no está disponible.
    }
  }, [key, state, hydrated]);

  return [state, setState] as const;
}
