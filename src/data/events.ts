import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";

export type EventStatus = "upcoming" | "ongoing" | "ended";

export type EventItem = {
  id: string;
  title: string;
  subtitle: string;
  brand: string;
  image: string;
  tag: "NEW" | "HOT" | "LIMITED";
  period: string;
  /** ISO 종료 일시 — 남은 시간 계산용 */
  endAt: string;
  reward: string;
  /** 카드에 노출되는 핵심 혜택 (예: 30% OFF, 5ml 증정) */
  benefit: string;
  status: EventStatus;
  description: string;
  notes: string[];
};

export const events: EventItem[] = [
  {
    id: "1",
    title: "Velvet Oud Edition",
    subtitle: "시그니처 향을 가장 먼저 만나보세요",
    brand: "MAISON NOIR",
    image: event1,
    tag: "NEW",
    period: "2026.04.20 — 05.15",
    endAt: "2026-05-15T23:59:59",
    reward: "정품 향수 5ml + 시향 카드 3종",
    benefit: "정품 5ml 증정",
    status: "ongoing",
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
    period: "2026.04.25 — 05.10",
    endAt: "2026-05-10T23:59:59",
    reward: "한정판 50ml 본품 (선착순 100명)",
    benefit: "30% OFF",
    status: "ongoing",
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
    period: "2026.05.10 — 05.30",
    endAt: "2026-05-30T23:59:59",
    reward: "조향 클래스 초대권 + VIP 굿즈",
    benefit: "VIP 클래스 초대",
    status: "upcoming",
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
    period: "2026.03.01 — 03.31",
    endAt: "2026-03-31T23:59:59",
    reward: "베스트셀러 라인 최대 40% 할인",
    benefit: "40% OFF",
    status: "ended",
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
    period: "2026.06.01 — 06.20",
    endAt: "2026-06-20T23:59:59",
    reward: "사전 예약 시 미니어처 증정",
    benefit: "미니어처 증정",
    status: "upcoming",
    description: "Midnight Oud의 사전 예약 이벤트. 정식 출시 전 가장 먼저 만나보세요.",
    notes: ["Top — Black Pepper", "Heart — Oud, Leather", "Base — Tobacco, Amber"],
  },
];
