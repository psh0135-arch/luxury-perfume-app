import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Share2, Heart, Calendar, Gift, Sparkles, Clock, Check, Copy } from "lucide-react";
import { useEvents } from "@/contexts/EventsContext";
import { useParticipation } from "@/hooks/useParticipation";
import { useCountdown } from "@/hooks/useCountdown";
import { toast } from "@/hooks/use-toast";

const tagStyles: Record<string, string> = {
  NEW: "bg-primary text-primary-foreground",
  HOT: "bg-pink text-pink-foreground",
  LIMITED: "bg-accent text-accent-foreground",
};

const pad = (n: number) => String(n).padStart(2, "0");

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const { events } = useEvents();
  const event = events.find((e) => e.id === id) ?? events[0];

  const { participation, hasJoined, join } = useParticipation(event.id);
  const countdown = useCountdown(event.endDate);

  const isOngoing = event.status === "ongoing" && !countdown.ended;
  const isUpcoming = event.status === "upcoming";
  const isEnded = event.status === "ended" || (event.status === "ongoing" && countdown.ended);

  const handleJoin = () => {
    if (isUpcoming) {
      toast({ title: "아직 오픈 전이에요", description: "이벤트가 시작되면 참여할 수 있습니다." });
      return;
    }
    if (isEnded) {
      toast({ title: "종료된 이벤트입니다", description: "다음 이벤트를 기대해주세요." });
      return;
    }
    if (hasJoined) {
      toast({ title: "이미 참여한 이벤트입니다", description: `쿠폰 코드: ${participation?.coupon}` });
      return;
    }
    const next = join();
    toast({ title: "참여가 완료되었습니다 🎉", description: `쿠폰 코드: ${next.coupon}` });
  };

  const copyCoupon = async () => {
    if (!participation) return;
    try {
      await navigator.clipboard.writeText(participation.coupon);
      toast({ title: "쿠폰 코드가 복사되었어요" });
    } catch {
      toast({ title: "복사에 실패했어요" });
    }
  };

  // CTA state
  const cta = (() => {
    if (hasJoined) return { label: "참여 완료", className: "bg-foreground text-background", disabled: true };
    if (isUpcoming) return { label: "오픈 예정", className: "bg-secondary text-muted-foreground cursor-not-allowed", disabled: true };
    if (isEnded) return { label: "종료됨", className: "bg-foreground/10 text-muted-foreground cursor-not-allowed", disabled: true };
    return {
      label: "지금 참여하기",
      className: "bg-primary text-primary-foreground shadow-[var(--shadow-soft)] active:scale-[0.98]",
      disabled: false,
    };
  })();

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
            className={`h-[380px] w-full object-cover ${isEnded ? "grayscale" : ""}`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
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
                <Heart className={`h-5 w-5 ${liked ? "fill-pink text-pink" : "text-foreground"}`} />
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

          {/* Countdown / Status */}
          <div
            className="mt-6 rounded-2xl p-5"
            style={{
              background: isOngoing ? "var(--gradient-luxury)" : undefined,
              backgroundColor: isOngoing ? undefined : "hsl(var(--secondary))",
            }}
          >
            <div className="flex items-center gap-2">
              <Clock className={`h-4 w-4 ${isOngoing ? "text-primary-foreground" : "text-muted-foreground"}`} />
              <p className={`text-[11px] font-medium tracking-[0.2em] ${isOngoing ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {isOngoing ? "남은 시간" : isUpcoming ? "오픈 예정" : "종료된 이벤트"}
              </p>
            </div>
            {isOngoing ? (
              <div className="mt-3 grid grid-cols-4 gap-2 text-center text-primary-foreground">
                {[
                  { v: countdown.days, l: "DAYS" },
                  { v: countdown.hours, l: "HRS" },
                  { v: countdown.minutes, l: "MIN" },
                  { v: countdown.seconds, l: "SEC" },
                ].map((u) => (
                  <div key={u.l} className="rounded-xl bg-background/10 py-2.5 backdrop-blur">
                    <p className="font-serif text-2xl leading-none">{pad(u.v)}</p>
                    <p className="mt-1 text-[9px] tracking-widest opacity-80">{u.l}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 font-serif text-xl text-foreground">
                {isUpcoming ? "곧 만나보실 수 있어요" : "이벤트가 종료되었습니다"}
              </p>
            )}
          </div>

          {/* Info rows */}
          <div className="mt-5 space-y-4 rounded-2xl bg-secondary/60 p-5">
            <div className="flex gap-3">
              <Calendar className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-[11px] font-medium tracking-wider text-muted-foreground">이벤트 기간</p>
                <p className="mt-0.5 text-sm text-foreground">{event.period}</p>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="flex gap-3">
              <Gift className="mt-0.5 h-4 w-4 text-accent" />
              <div>
                <p className="text-[11px] font-medium tracking-wider text-muted-foreground">참여 혜택</p>
                <p className="mt-0.5 text-sm text-foreground">{event.reward}</p>
                <p className="mt-1 text-[12px] font-semibold text-primary">{event.benefit}</p>
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

          {/* Participation result */}
          {hasJoined && participation && (
            <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                </div>
                <p className="font-serif text-lg text-foreground">참여가 완료되었어요</p>
              </div>
              <p className="mt-2 text-[12px] text-muted-foreground">
                아래 쿠폰 코드를 결제 시 입력하시면 혜택이 적용됩니다.
              </p>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-primary/40 bg-background px-4 py-3">
                <span className="font-mono text-sm font-semibold tracking-widest text-primary">
                  {participation.coupon}
                </span>
                <button
                  onClick={copyCoupon}
                  className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground"
                >
                  <Copy className="h-3 w-3" />
                  복사
                </button>
              </div>
            </div>
          )}

          <p className="mt-8 text-[11px] leading-relaxed text-muted-foreground">
            * 당첨자는 이벤트 종료 후 7일 이내 개별 안내됩니다.
            <br />* 본 이벤트는 1인 1회 참여 가능합니다.
          </p>
        </section>
      </main>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto max-w-[420px]">
          <button
            onClick={handleJoin}
            disabled={cta.disabled}
            aria-disabled={cta.disabled}
            className={`flex h-14 w-full items-center justify-center rounded-full text-sm font-semibold tracking-wider transition-transform ${cta.className}`}
          >
            {hasJoined && <Check className="mr-1 h-4 w-4" strokeWidth={2.5} />}
            {cta.label}
          </button>
          {hasJoined && (
            <button
              onClick={() => navigate(`/event/${event.id}/done`)}
              className="mt-2 w-full text-center text-[12px] text-muted-foreground underline-offset-4 hover:underline"
            >
              참여 완료 화면 보기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
