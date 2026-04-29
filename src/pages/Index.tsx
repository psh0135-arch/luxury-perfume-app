import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Sparkles, ArrowRight, User } from "lucide-react";
import { type EventItem, type EventStatus } from "@/data/events";
import { useEvents } from "@/contexts/EventsContext";
import { useAllParticipations } from "@/hooks/useParticipation";
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
      "bg-primary text-primary-foreground active:scale-[0.97] shadow-[var(--shadow-soft)]",
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

const EventCard = ({ event, joined }: { event: EventItem; joined: boolean }) => {
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
      className="group block overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-12px_hsl(0_0%_0%/0.18)] active:scale-[0.985]"
    >
      <div className="relative overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          width={768}
          height={768}
          loading="lazy"
          className={`h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${isEnded ? "grayscale" : ""}`}
        />
        <span
          className={`absolute left-3 top-3 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-widest ${meta.badge}`}
        >
          {meta.label}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-background/95 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur">
          {event.benefit}
        </span>
        {joined && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-foreground/85 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-background backdrop-blur">
            <Sparkles className="h-3 w-3" />
            참여 완료
          </span>
        )}
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
          className={`mt-4 flex h-12 min-h-[44px] w-full items-center justify-center rounded-full text-sm font-semibold tracking-wider transition-transform ${joined ? "bg-foreground text-background" : meta.ctaClass}`}
        >
          {joined ? "참여 완료" : meta.cta}
        </button>
      </div>
    </Link>
  );
};

const StatRing = ({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: "primary" | "accent";
}) => {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  const stroke = color === "primary" ? "hsl(var(--primary))" : "hsl(var(--accent))";
  const radius = 26;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-16 flex-shrink-0">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="5" />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-base text-foreground">{pct}%</span>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground">{label}</p>
        <p className="mt-1 font-serif text-lg leading-tight text-foreground">
          {value}
          <span className="text-sm text-muted-foreground"> / {total}</span>
        </p>
      </div>
    </div>
  );
};

const Index = () => {
  const [filter, setFilter] = useState<FilterKey>("all");
  const { events } = useEvents();
  const participations = useAllParticipations();
  const listRef = useRef<HTMLDivElement | null>(null);

  const counts = useMemo(
    () => ({
      all: events.length,
      ongoing: events.filter((e) => e.status === "ongoing").length,
      upcoming: events.filter((e) => e.status === "upcoming").length,
      ended: events.filter((e) => e.status === "ended").length,
    }),
    [events],
  );

  const joinedCount = useMemo(
    () => events.filter((e) => participations[e.id]).length,
    [events, participations],
  );

  const filtered = useMemo(
    () => (filter === "all" ? events : events.filter((e) => e.status === filter)),
    [filter, events],
  );

  const featured =
    events.find((e) => e.status === "ongoing") ?? events[0];

  const showOngoing = () => {
    setFilter("ongoing");
    requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[420px] pb-40">
        {/* Header */}
        <header className="px-6 pt-10 pb-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground">
              PERFUME · EVENT
            </p>
            <button
              aria-label="찜 목록"
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border transition-colors active:bg-secondary"
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
        <section className="px-6 animate-scale-in">
          <Link
            to={`/event/${featured.id}`}
            className="relative block overflow-hidden rounded-2xl shadow-[var(--shadow-card)] transition-transform duration-300 active:scale-[0.99]"
          >
            <img
              src={heroImage}
              alt="이주의 향수 이벤트"
              width={768}
              height={768}
              className="h-[200px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-background">
              <span className="inline-block rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold tracking-widest text-accent-foreground">
                THIS WEEK
              </span>
              <h2 className="mt-2 font-serif text-2xl leading-tight">{featured.title}</h2>
              <p className="mt-1 text-xs opacity-90">{featured.subtitle}</p>
            </div>
          </Link>
        </section>

        {/* Stats — 진행률 / 참여율 */}
        <section className="mt-7 px-6 animate-slide-up">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium tracking-[0.25em] text-muted-foreground">
                MY DASHBOARD
              </p>
              <span className="flex items-center gap-1 text-[10px] tracking-widest text-accent">
                <Sparkles className="h-3 w-3" /> LIVE
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <StatRing
                label="진행률"
                value={counts.ongoing}
                total={counts.all}
                color="primary"
              />
              <StatRing
                label="참여율"
                value={joinedCount}
                total={counts.all}
                color="accent"
              />
            </div>
            <div className="mt-4 h-px bg-border" />
            <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
              지금까지 <span className="font-semibold text-foreground">{joinedCount}개</span>의 이벤트에
              참여하셨어요. 진행 중인 <span className="font-semibold text-primary">{counts.ongoing}개</span>의
              혜택을 놓치지 마세요.
            </p>
          </div>
        </section>

        {/* Filter tabs */}
        <div className="sticky top-0 z-30 mt-8 bg-background/95 backdrop-blur" ref={listRef}>
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
                  className={`flex h-11 min-h-[44px] flex-shrink-0 items-center gap-1.5 rounded-full border px-4 text-[12px] font-medium transition-all duration-200 active:scale-95 ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {f.label}
                  <span className={`text-[11px] ${active ? "opacity-80" : "opacity-60"}`}>
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
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/30 py-16 text-center animate-fade-in">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ background: "var(--gradient-luxury)" }}
              >
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <p className="mt-4 font-serif text-lg text-foreground">
                해당 상태의 이벤트가 없어요
              </p>
              <p className="mt-1.5 px-8 text-xs leading-relaxed text-muted-foreground">
                다른 필터를 선택하거나
                <br />
                새로운 이벤트가 열릴 때까지 잠시만 기다려 주세요.
              </p>
              <button
                onClick={() => setFilter("all")}
                className="mt-5 inline-flex h-11 min-h-[44px] items-center rounded-full border border-border bg-background px-5 text-[12px] font-medium text-foreground transition-colors active:bg-secondary"
              >
                전체 이벤트 보기
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {filtered.map((e, i) => (
                <li
                  key={e.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${Math.min(i, 5) * 60}ms`, animationFillMode: "backwards" }}
                >
                  <EventCard event={e} joined={!!participations[e.id]} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Bottom CTA + Nav */}
      <div className="fixed inset-x-0 bottom-0 z-40">
        {/* CTA */}
        <div className="border-t border-border bg-background/95 px-6 pb-2 pt-3 backdrop-blur">
          <div className="mx-auto max-w-[420px]">
            <button
              onClick={showOngoing}
              disabled={counts.ongoing === 0}
              className="flex h-12 min-h-[44px] w-full items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-wider text-primary-foreground shadow-[var(--shadow-soft)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: "var(--gradient-luxury)" }}
            >
              진행 중 이벤트 보기
              <span className="rounded-full bg-background/20 px-2 py-0.5 text-[11px]">
                {counts.ongoing}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bottom nav */}
        <nav className="border-t border-border bg-background/98 backdrop-blur">
          <div className="mx-auto flex max-w-[420px] items-center justify-around px-6 py-2">
            <button className="flex min-h-[44px] flex-col items-center justify-center gap-1 px-4 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-[10px] font-medium tracking-wider">이벤트</span>
            </button>
            <button className="flex min-h-[44px] flex-col items-center justify-center gap-1 px-4 text-muted-foreground transition-colors active:text-foreground">
              <Heart className="h-4 w-4" />
              <span className="text-[10px] tracking-wider">찜</span>
            </button>
            <button className="flex min-h-[44px] flex-col items-center justify-center gap-1 px-4 text-muted-foreground transition-colors active:text-foreground">
              <User className="h-4 w-4" />
              <span className="text-[10px] tracking-wider">마이</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Index;
