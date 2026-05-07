# Perfume Event

럭셔리 향수 브랜드의 특별 프로모션과 이벤트를 가장 먼저 만나볼 수 있는 모바일 웹앱입니다.  
A mobile-first web app for discovering luxury perfume brand promotions and events.

---

## 주요 기능 / Features

- **인터랙티브 파티클 히어로** — p5.js 기반 이미지 맵핑 포스 필드 배경으로 마우스 움직임에 반응하는 몰입형 히어로 영역
- **실시간 이벤트 대시보드** — 진행률 / 참여율 링 차트로 나의 참여 현황을 한눈에
- **이벤트 필터 & 탐색** — 전체 / 진행 중 / 예정 / 종료 상태별 필터링
- **이벤트 참여** — 참여하기 → 완료 페이지 플로우
- **관리자 페이지** — 이벤트 CRUD (생성, 수정, 삭제) 및 대시보드
- **SEO 최적화** — 자동 생성 `sitemap.xml`, `robots.txt`, Google Search Console 연동
- **반응형 모바일 퍼스트** — 최대 너비 420px 기준의 럭셔리 모바일 UI

---

## 기술 스택 / Tech Stack

| 영역 | 기술 |
|------|------|
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + shadcn/ui |
| Animation | p5.js 1.11 (Force Field Background) |
| Routing | React Router DOM 6 |
| State | React Context + localStorage |
| Query | TanStack Query |
| Testing | Vitest + Testing Library |
| Linting | ESLint 9 + TypeScript ESLint |

---

## 프로젝트 구조 / Project Structure

```
├── public/
│   ├── google4bea01d70abc6f0f.html   # Google Search Console 인증
│   ├── robots.txt                     # 크롤러 제어 + sitemap 링크
│   └── placeholder.svg
├── scripts/
│   └── sitemap.ts                     # XML sitemap 자동 생성
├── src/
│   ├── assets/                        # 이벤트 이미지
│   ├── components/
│   │   ├── ui/                        # shadcn/ui 컴포넌트
│   │   ├── ForceFieldBackground.tsx   # p5.js 인터랙티브 배경
│   │   ├── EventCard.tsx              # 이벤트 카드
│   │   ├── StatRing.tsx               # 진행률/참여율 링
│   │   ├── ProtectedAdminRoute.tsx    # 관리자 라우트 가드
│   │   └── admin/
│   │       └── AdminShell.tsx         # 관리자 레이아웃
│   ├── contexts/
│   │   └── EventsContext.tsx          # 이벤트 전역 상태
│   ├── data/
│   │   └── events.ts                  # 기본 시드 데이터
│   ├── hooks/
│   │   ├── useCountdown.ts            # 카운트다운 타이머
│   │   └── useParticipation.ts        # 참여 상태 관리
│   ├── lib/
│   │   ├── utils.ts                   # 유틸 (cn 등)
│   │   └── adminAuth.ts               # 관리자 인증 헬퍼
│   ├── pages/
│   │   ├── Index.tsx                  # 메인 (홈)
│   │   ├── EventDetail.tsx            # 이벤트 상세
│   │   ├── EventDone.tsx              # 참여 완료
│   │   ├── NotFound.tsx               # 404
│   │   └── admin/
│   │       ├── AdminSetup.tsx         # 관리자 계정 설정
│   │       ├── AdminLogin.tsx         # 관리자 로그인
│   │       ├── AdminDashboard.tsx     # 관리자 대시보드
│   │       └── AdminEventForm.tsx     # 이벤트 생성/수정
│   └── test/                          # 단위 테스트
├── index.html
├── vite.config.ts
└── tailwind.config.ts
```

---

## 시작하기 / Getting Started

```bash
# 의존성 설치
bun install

# 개발 서버 실행
bun run dev

# 프로덕션 빌드
bun run build

# 빌드 미리보기
bun run preview

# 테스트
bun run test
```

---

## 관리자 설정 / Admin Setup

1. `/admin/setup` 접속
2. 관리자 계정의 이메일/비밀번호 설정
3. 이후 `/admin/login` 에서 로그인
4. 대시보드에서 이벤트 생성 · 수정 · 삭제 가능

> 관리자 인증 정보는 브라우저 localStorage에 저장됩니다.

---

## SEO

- **Sitemap**: `/sitemap.xml` (Vite 플러그인으로 개발/빌드 모두 자동 생성)
- **Robots**: `/robots.txt` (주요 검색 엔진 User-Agent 허용)
- **Google Search Console**: 인증 파일 포함

---

## 라이선스 / License

MIT License
