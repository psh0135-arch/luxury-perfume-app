import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "perfume-event:participations";

export type Participation = {
  eventId: string;
  coupon: string;
  joinedAt: string;
};

type Store = Record<string, Participation>;

const readStore = (): Store => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Store;
  } catch {
    return {};
  }
};

const writeStore = (store: Store) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event("perfume-event:updated"));
};

const generateCoupon = (eventId: string) => {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `PE-${eventId}-${rand}`;
};

export const useParticipation = (eventId: string) => {
  const [participation, setParticipation] = useState<Participation | null>(
    () => readStore()[eventId] ?? null,
  );

  useEffect(() => {
    const sync = () => setParticipation(readStore()[eventId] ?? null);
    window.addEventListener("perfume-event:updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("perfume-event:updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [eventId]);

  const join = useCallback((): Participation => {
    const store = readStore();
    if (store[eventId]) return store[eventId];
    const next: Participation = {
      eventId,
      coupon: generateCoupon(eventId),
      joinedAt: new Date().toISOString(),
    };
    store[eventId] = next;
    writeStore(store);
    setParticipation(next);
    return next;
  }, [eventId]);

  return { participation, hasJoined: !!participation, join };
};
