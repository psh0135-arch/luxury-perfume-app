import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  decorate,
  defaultEventSeeds,
  type EventItem,
  type EventSeed,
} from "@/data/events";

const STORAGE_KEY = "perfume_events";

const isValidSeed = (v: unknown): v is EventSeed => {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    typeof o.startDate === "string" &&
    typeof o.endDate === "string" &&
    !Number.isNaN(new Date(o.startDate as string).getTime()) &&
    !Number.isNaN(new Date(o.endDate as string).getTime())
  );
};

const loadSeeds = (): EventSeed[] => {
  if (typeof window === "undefined") return defaultEventSeeds;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultEventSeeds;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultEventSeeds;
    const valid = parsed.filter(isValidSeed);
    if (valid.length === 0) return defaultEventSeeds;
    return valid;
  } catch {
    return defaultEventSeeds;
  }
};

const saveSeeds = (seeds: EventSeed[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
  } catch {
    /* quota exceeded — ignore */
  }
};

type EventsContextValue = {
  events: EventItem[];
  seeds: EventSeed[];
  getEvent: (id: string) => EventItem | undefined;
  getSeed: (id: string) => EventSeed | undefined;
  addEvent: (seed: Omit<EventSeed, "id">) => EventSeed;
  updateEvent: (id: string, patch: Partial<Omit<EventSeed, "id">>) => void;
  removeEvent: (id: string) => void;
  resetToDefaults: () => void;
};

const EventsContext = createContext<EventsContextValue | null>(null);

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [seeds, setSeeds] = useState<EventSeed[]>(() => {
    const loaded = loadSeeds();
    // 최초 실행 시 기본 데이터 시드
    if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
      saveSeeds(loaded);
    }
    return loaded;
  });

  // 1분마다 status 재계산 (날짜 경계 통과 대응)
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const events = useMemo(() => seeds.map((s) => decorate(s, now)), [seeds, now]);

  const persist = (next: EventSeed[]) => {
    saveSeeds(next);
    setSeeds(next);
  };

  const genId = () => {
    const used = new Set(seeds.map((s) => s.id));
    // numeric incrementing id, fallback to random
    let n = seeds.length + 1;
    while (used.has(String(n))) n++;
    return String(n);
  };

  const value: EventsContextValue = {
    events,
    seeds,
    getEvent: (id) => events.find((e) => e.id === id),
    getSeed: (id) => seeds.find((s) => s.id === id),
    addEvent: (data) => {
      const id = genId();
      const seed: EventSeed = { ...data, id };
      persist([...seeds, seed]);
      return seed;
    },
    updateEvent: (id, patch) => {
      persist(seeds.map((s) => (s.id === id ? { ...s, ...patch, id } : s)));
    },
    removeEvent: (id) => {
      persist(seeds.filter((s) => s.id !== id));
    },
    resetToDefaults: () => persist(defaultEventSeeds),
  };

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
};

export const useEvents = () => {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
};
