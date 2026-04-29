import { useNavigate, Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { type EventItem, type EventStatus } from "@/data/events";

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

export default EventCard;
