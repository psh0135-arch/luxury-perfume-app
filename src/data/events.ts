import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import event4 from "@/assets/event-4.jpg";
import event5 from "@/assets/event-5.jpg";

export type EventStatus = "upcoming" | "ongoing" | "ended";

/** 저장/직렬화 가능한 raw 이벤트 (status는 날짜로 계산되므로 저장하지 않음) */
export type EventSeed = {
  id: string;
  title: string;
  subtitle: string;
  brand: string;
  image: string;
  tag: "NEW" | "HOT" | "LIMITED";
  /** ISO 시작 일시 */
  startDate: string;
  /** ISO 종료 일시 */
  endDate: string;
  reward: string;
  /** 카드에 노출되는 핵심 혜택 */
  benefit: string;
  description: string;
  notes: string[];
};

/** 화면에서 사용하는 이벤트 — 계산된 status/period 포함 */
export type EventItem = EventSeed & {
  status: EventStatus;
  period: string;
};

const fmt = (iso: string) => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
};

export const computeStatus = (startDate: string, endDate: string, now = new Date()): EventStatus => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const t = now.getTime();
  if (t < start) return "upcoming";
  if (t > end) return "ended";
  return "ongoing";
};

export const decorate = (seed: EventSeed, now = new Date()): EventItem => ({
  ...seed,
  status: computeStatus(seed.startDate, seed.endDate, now),
  period: `${fmt(seed.startDate)} — ${fmt(seed.endDate)}`,
});

/** 앱 최초 실행 시 시드되는 기본 이벤트 데이터 */
export const defaultEventSeeds: EventSeed[] = [
  {
    id: "1",
    title: "Velvet Oud Edition",
    subtitle: "시그니처 향을 가장 먼저 만나보세요",
    brand: "MAISON NOIR",
    image: event1,
    tag: "NEW",
    startDate: "2026-04-20T00:00:00",
    endDate: "2026-05-15T23:59:59",
    reward: "정품 향수 5ml + 시향 카드 3종",
    benefit: "정품 5ml 증정",
    description:
      "메종 누아르의 신규 시그니처 ‘Velvet Oud’ 출시 기념 이벤트. 단 3분만에 응모하고 깊고 우아한 우드 향을 가장 먼저 경험해보세요.",
    notes: ["Top — Bergamot, Pink Pepper", "Heart — Rose, Saffron", "Base — Oud, Amber, Musk"],
  },
  {
    id: "2",
    title: "Rose Petal Bloom",
    subtitle: "봄을 담은 한정판 컬렉션",
    brand: "FLEUR DE PARIS",
    image: event2,
    tag: "LIMITED",
    startDate: "2026-04-25T00:00:00",
    endDate: "2026-05-10T23:59:59",
    reward: "한정판 50ml 본품 (선착순 100명)",
    benefit: "30% OFF",
    description:
      "봄의 정원에서 영감을 받은 로즈 페탈 블룸. 응모 후 추첨을 통해 한정판 본품을 만나보실 수 있습니다.",
    notes: ["Top — Lychee, Mandarin", "Heart — Bulgarian Rose, Peony", "Base — White Musk, Cedar"],
  },
  {
    id: "3",
    title: "Amber Gold Soirée",
    subtitle: "골드 멤버를 위한 프라이빗 클래스",
    brand: "AURUM",
    image: event3,
    tag: "HOT",
    startDate: "2026-05-10T00:00:00",
    endDate: "2026-05-30T23:59:59",
    reward: "조향 클래스 초대권 + VIP 굿즈",
    benefit: "VIP 클래스 초대",
    description:
      "AURUM 조향사와 함께하는 프라이빗 향수 클래스. 나만의 시그니처 향을 직접 블렌딩 해보세요.",
    notes: ["Top — Saffron, Cardamom", "Heart — Amber, Honey", "Base — Vanilla, Sandalwood"],
  },
  {
    id: "4",
    title: "Spring Bloom Sale",
    subtitle: "봄맞이 베스트셀러 단독 할인",
    brand: "FLEUR DE PARIS",
    image: event2,
    tag: "HOT",
    startDate: "2026-03-01T00:00:00",
    endDate: "2026-03-31T23:59:59",
    reward: "베스트셀러 라인 최대 40% 할인",
    benefit: "40% OFF",
    description: "지난 봄 진행된 베스트셀러 컬렉션 단독 할인 이벤트입니다.",
    notes: ["Top — Peach, Freesia", "Heart — Jasmine", "Base — Musk"],
  },
  {
    id: "5",
    title: "Midnight Oud Preview",
    subtitle: "여름 신규 라인 사전 예약",
    brand: "MAISON NOIR",
    image: event1,
    tag: "NEW",
    startDate: "2026-06-01T00:00:00",
    endDate: "2026-06-20T23:59:59",
    reward: "사전 예약 시 미니어처 증정",
    benefit: "미니어처 증정",
    description: "Midnight Oud의 사전 예약 이벤트. 정식 출시 전 가장 먼저 만나보세요.",
    notes: ["Top — Black Pepper", "Heart — Oud, Leather", "Base — Tobacco, Amber"],
  },
];

/** 호환용: 기존 코드에서 import { events } 사용처를 위한 export (계산된 status 포함) */
export const events: EventItem[] = defaultEventSeeds.map((s) => decorate(s));
