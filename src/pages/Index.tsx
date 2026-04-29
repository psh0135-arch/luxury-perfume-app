import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { events } from "@/data/events";
import heroImage from "@/assets/event-1.jpg";

const tagStyles: Record<string, string> = {
  NEW: "bg-primary text-primary-foreground",
  HOT: "bg-pink text-pink-foreground",
  LIMITED: "bg-accent text-accent-foreground",
};

const Index = () => {
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

        {/* Hero card */}
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
              className="h-[220px] w-full object-cover"
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

        {/* Section title */}
        <div className="flex items-end justify-between px-6 pt-10 pb-4">
          <div>
            <h3 className="font-serif text-xl text-foreground">진행 중인 이벤트</h3>
            <p className="mt-1 text-xs text-muted-foreground">총 {events.length}개의 프로모션</p>
          </div>
          <button className="text-xs font-medium text-primary underline-offset-4 hover:underline">
            전체보기
          </button>
        </div>

        {/* Event list */}
        <ul className="space-y-4 px-6">
          {events.map((e) => (
            <li key={e.id}>
              <Link
                to={`/event/${e.id}`}
                className="flex gap-4 rounded-2xl bg-card p-3 shadow-[var(--shadow-soft)] transition-transform active:scale-[0.98]"
              >
                <img
                  src={e.image}
                  alt={e.title}
                  width={768}
                  height={768}
                  loading="lazy"
                  className="h-24 w-24 flex-shrink-0 rounded-xl object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-wider ${tagStyles[e.tag]}`}
                      >
                        {e.tag}
                      </span>
                      <span className="text-[10px] tracking-[0.2em] text-muted-foreground">
                        {e.brand}
                      </span>
                    </div>
                    <h4 className="mt-1.5 truncate font-serif text-lg text-foreground">
                      {e.title}
                    </h4>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {e.subtitle}
                    </p>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{e.period}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      {/* Bottom thumb-friendly bar */}
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
