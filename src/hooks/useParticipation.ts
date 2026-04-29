import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "perfume_participation";

export type Participation = {
  eventId: string;
  coupon: string;
  joinedAt: string;
};

type Store = Record<string, Participation>;

const isValidParticipation = (v: unknown): v is Participation => {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return typeof o.eventId === "string" && typeof o.coupon === "string" && typeof o.joinedAt === "string";
};

const readStore = (): Store => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Store = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (isValidParticipation(v)) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
};

const writeStore = (store: Store) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event("perfume-event:updated"));
  } catch {
    /* ignore */
  }
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
    sync();
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

export const useAllParticipations = () => {
  const [store, setStore] = useState<Store>(() => readStore());
  useEffect(() => {
    const sync = () => setStore(readStore());
    window.addEventListener("perfume-event:updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("perfume-event:updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return store;
};
