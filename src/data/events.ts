import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";

export type EventItem = {
  id: string;
  title: string;
  subtitle: string;
  brand: string;
  image: string;
  tag: "NEW" | "HOT" | "LIMITED";
  period: string;
  reward: string;
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
    reward: "정품 향수 5ml + 시향 카드 3종",
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
    reward: "한정판 50ml 본품 (선착순 100명)",
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
    period: "2026.05.01 — 05.20",
    reward: "조향 클래스 초대권 + VIP 굿즈",
    description:
      "AURUM 조향사와 함께하는 프라이빗 향수 클래스. 나만의 시그니처 향을 직접 블렌딩 해보세요.",
    notes: ["Top — Saffron, Cardamom", "Heart — Amber, Honey", "Base — Vanilla, Sandalwood"],
  },
];
