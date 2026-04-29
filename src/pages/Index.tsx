import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { type EventItem, type EventStatus } from "@/data/events";
import { useEvents } from "@/contexts/EventsContext";
import heroImage from "@/assets/event-1.jpg";

type FilterKey = "all" | EventStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "ongoing", label: "진행 중" },
  { key: "upcoming", label: "예정" },
  { key: "ended", label: "종료" },
];

const statusMeta: Record<
  EventStatus,
  { label: string; badge: string; cta: string; ctaClass: string; disabled: boolean }
> = {
  ongoing: {
    label: "진행 중",
    badge: "bg-primary text-primary-foreground",
    cta: "참여하기",
    ctaClass:
      "bg-primary text-primary-foreground active:scale-[0.98] shadow-[var(--shadow-soft)]",
    disabled: false,
  },
  upcoming: {
    label: "오픈 예정",
    badge: "bg-muted text-muted-foreground",
    cta: "오픈 예정",
    ctaClass: "bg-secondary text-muted-foreground cursor-not-allowed",
    disabled: true,
  },
  ended: {
    label: "종료",
    badge: "bg-foreground/80 text-background",
    cta: "종료됨",
    ctaClass: "bg-foreground/10 text-muted-foreground cursor-not-allowed",
    disabled: true,
  },
};

const EventCard = ({ event }: { event: EventItem }) => {
  const navigate = useNavigate();
  const meta = statusMeta[event.status];
  const isEnded = event.status === "ended";

  const handleJoin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (meta.disabled) return;
    navigate(`/event/${event.id}`);
  };

  return (
    <Link
      to={`/event/${event.id}`}
      className="block overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] transition-transform active:scale-[0.99]"
    >
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          width={768}
          height={768}
          loading="lazy"
          className={`h-44 w-full object-cover ${isEnded ? "grayscale" : ""}`}
        />
        {/* Status badge */}
        <span
          className={`absolute left-3 top-3 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-widest ${meta.badge}`}
        >
          {meta.label}
        </span>
        {/* Benefit chip */}
        <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-background/95 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur">
          {event.benefit}
        </span>
      </div>

      <div className="p-4">
        <p className="text-[10px] font-medium tracking-[0.25em] text-muted-foreground">
          {event.brand}
        </p>
        <h3 className="mt-1.5 truncate font-serif text-xl text-foreground">
          {event.title}
        </h3>
        <p className="mt-1 text-[12px] text-muted-foreground">{event.period}</p>

        <button
          type="button"
          onClick={handleJoin}
          disabled={meta.disabled}
          aria-disabled={meta.disabled}
          className={`mt-4 flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold tracking-wider transition-transform ${meta.ctaClass}`}
        >
          {meta.cta}
        </button>
      </div>
    </Link>
  );
};

const Index = () => {
  const [filter, setFilter] = useState<FilterKey>("all");

  const counts = useMemo(
    () => ({
      all: events.length,
      ongoing: events.filter((e) => e.status === "ongoing").length,
      upcoming: events.filter((e) => e.status === "upcoming").length,
      ended: events.filter((e) => e.status === "ended").length,
    }),
    [],
  );

  const filtered = useMemo(
    () => (filter === "all" ? events : events.filter((e) => e.status === filter)),
    [filter],
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[420px] pb-28">
        {/* Header */}
        <header className="px-6 pt-10 pb-6">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground">
              PERFUME · EVENT
            </p>
            <button
              aria-label="찜 목록"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
            >
              <Heart className="h-4 w-4 text-foreground" />
            </button>
          </div>
          <h1 className="mt-4 font-serif text-[34px] leading-[1.1] text-foreground">
            Perfume <span className="italic text-primary">Event</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            매주 새롭게 열리는 럭셔리 향수 브랜드의
            <br />
            특별한 프로모션을 가장 먼저 만나보세요.
          </p>
        </header>

        {/* Hero */}
        <section className="px-6">
          <Link
            to={`/event/${events[0].id}`}
            className="relative block overflow-hidden rounded-2xl shadow-[var(--shadow-card)]"
          >
            <img
              src={heroImage}
              alt="이주의 향수 이벤트"
              width={768}
              height={768}
              className="h-[200px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-background">
              <span className="inline-block rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold tracking-widest text-accent-foreground">
                THIS WEEK
              </span>
              <h2 className="mt-2 font-serif text-2xl leading-tight">
                Velvet Oud Edition
              </h2>
              <p className="mt-1 text-xs opacity-90">시그니처 향 5ml 증정 이벤트</p>
            </div>
          </Link>
        </section>

        {/* Filter tabs */}
        <div className="sticky top-0 z-30 mt-8 bg-background/95 backdrop-blur">
          <div
            role="tablist"
            aria-label="이벤트 상태 필터"
            className="flex gap-2 overflow-x-auto px-6 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.key)}
                  className={`flex h-9 flex-shrink-0 items-center gap-1.5 rounded-full border px-4 text-[12px] font-medium transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {f.label}
                  <span
                    className={`text-[11px] ${active ? "opacity-80" : "opacity-60"}`}
                  >
                    {counts[f.key]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* List */}
        <section className="px-6 pt-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
              <p className="font-serif text-lg text-foreground">
                해당 상태의 이벤트가 없어요
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                다른 필터를 선택해보세요.
              </p>
            </div>
          ) : (
            <ul className="space-y-5">
              {filtered.map((e) => (
                <li key={e.id}>
                  <EventCard event={e} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[420px] items-center justify-around px-6 py-3">
          <button className="flex flex-col items-center gap-1 text-primary">
            <span className="h-1 w-1 rounded-full bg-primary" />
            <span className="text-[11px] font-medium">이벤트</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <span className="h-1 w-1 rounded-full bg-transparent" />
            <span className="text-[11px]">찜</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <span className="h-1 w-1 rounded-full bg-transparent" />
            <span className="text-[11px]">마이</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;
