import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Share2, Heart, Calendar, Gift, Sparkles } from "lucide-react";
import { events } from "@/data/events";

const tagStyles: Record<string, string> = {
  NEW: "bg-primary text-primary-foreground",
  HOT: "bg-pink text-pink-foreground",
  LIMITED: "bg-accent text-accent-foreground",
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const event = events.find((e) => e.id === id) ?? events[0];

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[420px] pb-32">
        {/* Hero image */}
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            width={768}
            height={768}
            className="h-[380px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
          {/* Top bar */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-10">
            <button
              onClick={() => navigate(-1)}
              aria-label="뒤로"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 backdrop-blur"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setLiked((v) => !v)}
                aria-label="찜"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 backdrop-blur"
              >
                <Heart
                  className={`h-5 w-5 ${liked ? "fill-pink text-pink" : "text-foreground"}`}
                />
              </button>
              <button
                aria-label="공유"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background/90 backdrop-blur"
              >
                <Share2 className="h-5 w-5 text-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <section className="-mt-8 rounded-t-[28px] bg-background px-6 pt-7">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-widest ${tagStyles[event.tag]}`}
            >
              {event.tag}
            </span>
            <span className="text-[11px] tracking-[0.25em] text-muted-foreground">
              {event.brand}
            </span>
          </div>
          <h1 className="mt-3 font-serif text-3xl leading-tight text-foreground">
            {event.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{event.subtitle}</p>

          {/* Info rows */}
          <div className="mt-7 space-y-4 rounded-2xl bg-secondary/60 p-5">
            <div className="flex gap-3">
              <Calendar className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-[11px] font-medium tracking-wider text-muted-foreground">
                  이벤트 기간
                </p>
                <p className="mt-0.5 text-sm text-foreground">{event.period}</p>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex gap-3">
              <Gift className="mt-0.5 h-4 w-4 text-accent" />
              <div>
                <p className="text-[11px] font-medium tracking-wider text-muted-foreground">
                  참여 혜택
                </p>
                <p className="mt-0.5 text-sm text-foreground">{event.reward}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="font-serif text-xl text-foreground">이벤트 소개</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          </div>

          {/* Notes */}
          <div className="mt-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <h2 className="font-serif text-xl text-foreground">Fragrance Notes</h2>
            </div>
            <ul className="mt-4 space-y-2.5">
              {event.notes.map((n) => (
                <li
                  key={n}
                  className="rounded-xl border border-border px-4 py-3 text-[13px] text-foreground"
                >
                  {n}
                </li>
              ))}
            </ul>
          </div>

          {/* Notice */}
          <p className="mt-8 text-[11px] leading-relaxed text-muted-foreground">
            * 당첨자는 이벤트 종료 후 7일 이내 개별 안내됩니다.
            <br />* 본 이벤트는 1인 1회 참여 가능합니다.
          </p>
        </section>
      </main>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto max-w-[420px]">
          <Link
            to={`/event/${event.id}/done`}
            className="flex h-14 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold tracking-wider text-primary-foreground shadow-[var(--shadow-soft)] transition-transform active:scale-[0.98]"
          >
            지금 참여하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
