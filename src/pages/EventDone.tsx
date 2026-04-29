import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { useEvents } from "@/contexts/EventsContext";
import { useParticipation } from "@/hooks/useParticipation";

const EventDone = () => {
  const { id } = useParams();
  const { events } = useEvents();
  const event = events.find((e) => e.id === id) ?? events[0];
  const { participation, hasJoined, join } = useParticipation(event.id);

  // 직접 URL로 들어왔을 때만 자동으로 참여 처리 (렌더 중 부작용 방지: useEffect)
  useEffect(() => {
    if (!hasJoined) join();
  }, [hasJoined, join]);

  const entryNo = participation?.coupon ?? "발급 중...";

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex min-h-screen max-w-[420px] flex-col px-6 pb-10 pt-16">
        {/* Success mark */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full"
              style={{ background: "var(--gradient-luxury)" }}
            >
              <Check className="h-10 w-10 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <Sparkles className="absolute -right-2 -top-2 h-5 w-5 text-accent" />
            <Sparkles className="absolute -bottom-1 -left-3 h-4 w-4 text-pink" />
          </div>

          <p className="mt-8 text-[11px] font-medium tracking-[0.3em] text-accent">
            ENTRY COMPLETED
          </p>
          <h1 className="mt-3 font-serif text-[32px] leading-tight text-foreground">
            참여가 완료되었습니다
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            소중한 향을 만날 준비가 끝났어요.
            <br />
            결과는 이벤트 종료 후 개별 안내드립니다.
          </p>
        </div>

        {/* Receipt card */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.25em] text-muted-foreground">
              {event.brand}
            </span>
            <span className="text-[10px] tracking-widest text-primary">CONFIRMED</span>
          </div>
          <h2 className="mt-3 font-serif text-2xl leading-tight text-foreground">
            {event.title}
          </h2>

          <div className="my-5 border-t border-dashed border-border" />

          <dl className="space-y-3 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">참여 번호</dt>
              <dd className="font-medium text-foreground">{entryNo}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">이벤트 기간</dt>
              <dd className="text-foreground">{event.period}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="flex-shrink-0 text-muted-foreground">혜택</dt>
              <dd className="text-right text-foreground">{event.reward}</dd>
            </div>
          </dl>
        </div>

        {/* Tip */}
        <div className="mt-6 rounded-2xl bg-secondary/60 p-5">
          <p className="text-[11px] font-semibold tracking-widest text-primary">TIP</p>
          <p className="mt-2 text-[13px] leading-relaxed text-foreground">
            ‘마이페이지 → 참여 이벤트’에서 응모 내역과
            <br />
            당첨 결과를 언제든 확인하실 수 있어요.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-auto space-y-3 pt-10">
          <Link
            to="/"
            className="flex h-14 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold tracking-wider text-primary-foreground shadow-[var(--shadow-soft)] transition-transform active:scale-[0.98]"
          >
            다른 이벤트 둘러보기
          </Link>
          <Link
            to={`/event/${event.id}`}
            className="flex h-14 w-full items-center justify-center rounded-full border border-border text-sm font-medium text-foreground transition-colors active:bg-secondary"
          >
            이벤트 상세로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
};

export default EventDone;
